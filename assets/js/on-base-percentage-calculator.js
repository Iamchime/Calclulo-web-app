// --- Helper: parse numbers that may contain commas or spaces ---
function parseNumberWithCommas(value) {
  if (value == null) return 0;
  const cleaned = String(value).trim().replace(/,/g, '').replace(/\s+/g, '');
  if (cleaned === '' || isNaN(cleaned)) return 0;
  return parseFloat(cleaned);
}

// --- Helper: format integer-style numbers with commas on blur ---
function formatIntegerWithCommas(value) {
  if (value == null) return '';
  const n = parseNumberWithCommas(value);
  const parts = String(n).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

// --- Calculate OBP and write result to #OnBasePercentage ---
function calculateOnBasePercentage() {
  const hitsEl = document.getElementById('hits-base-percentage-calculator');
  const bbEl = document.getElementById('bases-on-balls-on-base-percentage-calculator');
  const hbpEl = document.getElementById('hitsByPitch');
  const abEl = document.getElementById('AtBats');
  const sfEl = document.getElementById('SacrificeFlies');
  const outEl = document.getElementById('OnBasePercentage');

  if (!outEl) return;

  const H = parseNumberWithCommas(hitsEl?.value);
  const BB = parseNumberWithCommas(bbEl?.value);
  const HBP = parseNumberWithCommas(hbpEl?.value);
  const AB = parseNumberWithCommas(abEl?.value);
  const SF = parseNumberWithCommas(sfEl?.value);

  const numerator = H + BB + HBP;
  const denominator = AB + BB + HBP + SF;

  if (denominator <= 0) {
    outEl.value = '';
    outEl.setAttribute('aria-label', 'On base percentage not available');
    return;
  }

  // Calculate OBP and round to 4 decimal places
  let obp = numerator / denominator;
  const obpRounded = (Math.round(obp * 10000) / 10000).toFixed(4); // Always 4 decimals

  // ✅ Keep leading zero (e.g., 0.2455, not .2455)
  outEl.value = obpRounded;
  outEl.setAttribute('aria-label', `On base percentage ${obpRounded}`);
}

// --- Attach listeners for live updating and input formatting ---
(function attachOBPListeners() {
  const ids = [
    'hits-base-percentage-calculator',
    'bases-on-balls-on-base-percentage-calculator',
    'hitsByPitch',
    'AtBats',
    'SacrificeFlies'
  ];

  ids.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    el.addEventListener('input', calculateOnBasePercentage);

    el.addEventListener('blur', (e) => {
      if (e.target.value === '') return;
      e.target.value = formatIntegerWithCommas(e.target.value);
    });

    el.addEventListener('focus', (e) => {
      e.target.value = e.target.value.replace(/,/g, '');
    });

    el.addEventListener('paste', () => {
      setTimeout(calculateOnBasePercentage, 0);
    });
  });

  document.addEventListener('DOMContentLoaded', calculateOnBasePercentage);
  calculateOnBasePercentage();
})();