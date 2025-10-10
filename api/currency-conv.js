// /api/currency-conv.js
// Vercel serverless endpoint — proxy for CurrencyBeacon (protects your API key)

const CB_BASE = process.env.CB_BASE || "https://api.currencybeacon.com/v1";
const API_KEY = process.env.CURRENCYBEACON_API_KEY;

const ALLOWED_ORIGINS = [
  "https://calclulo.com",
  "https://www.calclulo.com",
  "http://localhost:3000",
  "http://127.0.0.1:3000"
];

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 60s
const RATE_LIMIT_MAX = 60; // max requests per IP per window (tune as needed)
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes for latest rates caching (instance-level)

if (!globalThis._cb_rate_limit_map) globalThis._cb_rate_limit_map = new Map();
if (!globalThis._cb_cache) globalThis._cb_cache = new Map();

function getClientIp(req) {
  return (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.socket.remoteAddress || "unknown";
}

function rateLimitAllow(ip) {
  const now = Date.now();
  const map = globalThis._cb_rate_limit_map;
  if (!map.has(ip)) {
    map.set(ip, []);
  }
  const arr = map.get(ip);
  // remove old timestamps
  while (arr.length && arr[0] < now - RATE_LIMIT_WINDOW_MS) arr.shift();
  if (arr.length >= RATE_LIMIT_MAX) return false;
  arr.push(now);
  return true;
}

function cacheGet(key) {
  const c = globalThis._cb_cache.get(key);
  if (!c) return null;
  if (Date.now() - c.ts > CACHE_TTL_MS) {
    globalThis._cb_cache.delete(key);
    return null;
  }
  return c.val;
}
function cacheSet(key, val) {
  globalThis._cb_cache.set(key, { ts: Date.now(), val });
}

export default async function handler(req, res) {
  try {
    if (!API_KEY) {
      return res.status(500).json({ error: "server_missing_api_key" });
    }

    // Basic origin check
    const origin = req.headers.origin || req.headers.referer || "";
    if (origin) {
      const allowed = ALLOWED_ORIGINS.some(o => origin.startsWith(o));
      if (!allowed) {
        // Allow empty origin (curl, server-to-server) — but block non-whitelisted browser origins
        // If you want to be stricter, remove the "origin === ''" allowance
        return res.status(403).json({ error: "unauthorized_origin" });
      }
    }

    // Rate limiting (best-effort)
    const ip = getClientIp(req);
    if (!rateLimitAllow(ip)) {
      return res.status(429).json({ error: "rate_limit_exceeded" });
    }

    const action = (req.query.action || "").toLowerCase();

    if (action === "latest") {
      const base = (req.query.base || "").toUpperCase();
      const symbols = (req.query.symbols || "").toUpperCase();

      if (!base) return res.status(400).json({ error: "missing_base" });

      const cacheKey = `latest::${base}::${symbols}`;
      const cached = cacheGet(cacheKey);
      if (cached) return res.status(200).json({ ok: true, cached: true, rates: cached });

      // forward request
      const url = new URL(`${CB_BASE}/latest`);
      url.searchParams.set("base", base);
      if (symbols) url.searchParams.set("symbols", symbols);
      url.searchParams.set("api_key", API_KEY);

      const resp = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        }
      });

      const bodyText = await resp.text();
      if (!resp.ok) {
        return res.status(resp.status).json({ error: "currencybeacon_error", status: resp.status, body: bodyText });
      }

      // Try to parse JSON
      let json;
      try { json = JSON.parse(bodyText); } catch (e) { json = bodyText; }

      // Normalize rates into { CODE: number } if present, otherwise return raw
      let rates = null;
      if (json && typeof json === "object") {
        if (json.rates && typeof json.rates === "object") {
          rates = {};
          Object.keys(json.rates).forEach(k => { rates[k.toUpperCase()] = Number(json.rates[k]); });
        } else if (json.data && json.data.rates && typeof json.data.rates === "object") {
          rates = {};
          Object.keys(json.data.rates).forEach(k => { rates[k.toUpperCase()] = Number(json.data.rates[k]); });
        } else if (json.quotes && typeof json.quotes === "object") {
          rates = {};
          Object.keys(json.quotes).forEach(k => {
            const val = Number(json.quotes[k]);
            const key = String(k).toUpperCase();
            if (key.length === 6) rates[key.slice(3)] = val;
            else rates[key] = val;
          });
        }
      }

      if (rates && Object.keys(rates).length > 0) {
        cacheSet(cacheKey, rates);
        return res.status(200).json({ ok: true, cached: false, rates });
      }

      // fallback return raw JSON
      return res.status(200).json({ ok: true, cached: false, raw: json });
    }

    if (action === "convert") {
      const from = (req.query.from || "").toUpperCase();
      const to = (req.query.to || "").toUpperCase();
      const amount = (req.query.amount || "1");

      if (!from || !to) return res.status(400).json({ error: "missing_from_or_to" });

      const url = new URL(`${CB_BASE}/convert`);
      url.searchParams.set("from", from);
      url.searchParams.set("to", to);
      url.searchParams.set("amount", String(amount));
      url.searchParams.set("api_key", API_KEY);

      const resp = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        }
      });

      const bodyText = await resp.text();
      if (!resp.ok) {
        return res.status(resp.status).json({ error: "currencybeacon_error", status: resp.status, body: bodyText });
      }

      let json;
      try { json = JSON.parse(bodyText); } catch (e) { json = bodyText; }

      // try to extract numeric result
      let value = null;
      if (json && typeof json === "object") {
        if (typeof json.result === "number") value = json.result;
        else if (json.data && typeof json.data.result === "number") value = json.data.result;
        else if (json.conversion && typeof json.conversion.result === "number") value = json.conversion.result;
        else if (typeof json.value === "number") value = json.value;
      }

      if (value !== null) return res.status(200).json({ ok: true, value, raw: json });

      return res.status(200).json({ ok: true, raw: json });
    }

    return res.status(400).json({ error: "missing_action", info: "use action=latest or action=convert" });
  } catch (err) {
    console.error("currency-conv api error:", err);
    return res.status(500).json({ error: "internal_server_error" });
  }
}