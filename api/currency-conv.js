// /api/currency-conv.js
// Secure proxy for CurrencyBeacon – hides your API key from frontend
// Works seamlessly with existing frontend variable names

const CB_BASE = process.env.CB_BASE || "https://api.currencybeacon.com/v1";
const API_KEY = process.env.CURRENCYBEACON_API_KEY;

const ALLOWED_ORIGINS = [
  "https://calclulo.com",
  "https://www.calclulo.com",
  "http://localhost:3000",
  "http://127.0.0.1:3000"
];

// Basic memory cache and rate limiting (per Vercel instance)
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 60;
const CACHE_TTL_MS = 3 * 60 * 1000;

if (!globalThis._cb_rate_limit_map) globalThis._cb_rate_limit_map = new Map();
if (!globalThis._cb_cache) globalThis._cb_cache = new Map();

function getClientIp(req) {
  return (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.socket.remoteAddress || "unknown";
}

function rateLimitAllow(ip) {
  const now = Date.now();
  const map = globalThis._cb_rate_limit_map;
  if (!map.has(ip)) map.set(ip, []);
  const arr = map.get(ip);
  while (arr.length && arr[0] < now - RATE_LIMIT_WINDOW_MS) arr.shift();
  if (arr.length >= RATE_LIMIT_MAX) return false;
  arr.push(now);
  return true;
}

function cacheGet(key) {
  const entry = globalThis._cb_cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL_MS) {
    globalThis._cb_cache.delete(key);
    return null;
  }
  return entry.val;
}

function cacheSet(key, val) {
  globalThis._cb_cache.set(key, { ts: Date.now(), val });
}

export default async function handler(req, res) {
  try {
    if (!API_KEY) {
      return res.status(500).json({ error: "server_missing_api_key" });
    }
    
    // Origin whitelist
    const origin = req.headers.origin || req.headers.referer || "";
    if (origin) {
      const allowed = ALLOWED_ORIGINS.some(o => origin.startsWith(o));
      if (!allowed) {
        return res.status(403).json({ error: "unauthorized_origin" });
      }
    }
    
    // Rate limiting
    const ip = getClientIp(req);
    if (!rateLimitAllow(ip)) {
      return res.status(429).json({ error: "rate_limit_exceeded" });
    }
    
    const action = (req.query.action || "").toLowerCase();
    
    // ======================
    // 1️⃣  LATEST endpoint
    // ======================
    if (action === "latest") {
      const base = (req.query.base || "").toUpperCase();
      const symbols = (req.query.symbols || "").toUpperCase();
      if (!base) return res.status(400).json({ error: "missing_base" });
      
      const cacheKey = `latest::${base}::${symbols}`;
      const cached = cacheGet(cacheKey);
      if (cached) return res.status(200).json({ ok: true, cached: true, rates: cached });
      
      const url = new URL(`${CB_BASE}/latest`);
      url.searchParams.set("base", base);
      if (symbols) url.searchParams.set("symbols", symbols);
      url.searchParams.set("api_key", API_KEY);
      
      const resp = await fetch(url.toString(), { headers: { Accept: "application/json" } });
      const body = await resp.text();
      
      if (!resp.ok) {
        return res.status(resp.status).json({ error: "currencybeacon_error", status: resp.status, body });
      }
      
      let json;
      try { json = JSON.parse(body); } catch { json = body; }
      
      let rates = null;
      if (json?.rates) {
        rates = Object.fromEntries(Object.entries(json.rates).map(([k, v]) => [k.toUpperCase(), +v]));
      } else if (json?.data?.rates) {
        rates = Object.fromEntries(Object.entries(json.data.rates).map(([k, v]) => [k.toUpperCase(), +v]));
      }
      
      if (rates && Object.keys(rates).length) {
        cacheSet(cacheKey, rates);
        return res.status(200).json({ ok: true, cached: false, rates });
      }
      
      return res.status(200).json({ ok: true, cached: false, raw: json });
    }
    
    // ======================
    // 2️⃣  CONVERT endpoint
    // ======================
    if (action === "convert") {
      const from = (req.query.from || "").toUpperCase();
      const to = (req.query.to || "").toUpperCase();
      const amount = (req.query.amount || "1");
      if (!from || !to) return res.status(400).json({ error: "missing_from_or_to" });
      
      const url = new URL(`${CB_BASE}/convert`);
      url.searchParams.set("from", from);
      url.searchParams.set("to", to);
      url.searchParams.set("amount", amount);
      url.searchParams.set("api_key", API_KEY);
      
      const resp = await fetch(url.toString(), { headers: { Accept: "application/json" } });
      const body = await resp.text();
      
      if (!resp.ok) {
        return res.status(resp.status).json({ error: "currencybeacon_error", status: resp.status, body });
      }
      
      let json;
      try { json = JSON.parse(body); } catch { json = body; }
      
      let value = json?.result ?? json?.data?.result ?? json?.conversion?.result ?? json?.value ?? null;
      if (typeof value === "number") {
        return res.status(200).json({ ok: true, value, raw: json });
      }
      
      return res.status(200).json({ ok: true, raw: json });
    }
    
    // ======================
    // 3️⃣  Fallback
    // ======================
    return res.status(400).json({ error: "missing_action", info: "use action=latest or action=convert" });
  } catch (err) {
    console.error("currency-conv API error:", err);
    return res.status(500).json({ error: "internal_server_error" });
  }
}