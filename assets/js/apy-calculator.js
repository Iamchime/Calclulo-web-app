
let isSyncing = false;

// Utility: parse numeric input (commas allowed). Returns Number or NaN.
function getNumberFrom(id) {
  const el = document.getElementById(id);
  if (!el) return NaN;
  const raw = String(el.value ?? '').trim();
  if (raw === '') return NaN;
  const num = Number(raw.replace(/,/g, ''));
  return Number.isFinite(num) ? num : NaN;
}

// Utility: set value programmatically without triggering cascading loops
function setValueSafe(id, val) {
  const el = document.getElementById(id);
  if (!el) return;
  try {
    isSyncing = true;
    el.value = val;
  } finally {
    // small timeout to allow input events to finish before clearing flag
    setTimeout(() => { isSyncing = false; }, 0);
  }
}

// Normalize frequency option to an integer number of periods per year
function periodsPerYear(frequencyValue) {
  if (!frequencyValue) return NaN;
  const normalized = String(frequencyValue).replace(/[\s-]/g, '').toLowerCase();
  switch (normalized) {
    case 'yearly':
    case 'annual':
      return 1;
    case 'halfyearly':
    case 'halfyear':
      return 2;
    case 'quarterly':
      return 4;
    case 'monthly':
      return 12;
    case 'weekly':
      return 52;
    case 'daily':
      return 365;
    default:
      return NaN;
  }
}

// Update APY field from APR input. Returns nominal APR as decimal (e.g., 2.1193)
function updateFromAPR() {
  const aprNum = getNumberFrom('AnnualPercentageRateOfCharge'); // percent, e.g., 211.93
  const freqEl = document.getElementById('compoundingFrequency');
  const n = periodsPerYear(freqEl ? freqEl.value : null);

  if (!Number.isFinite(aprNum) || !Number.isFinite(n)) {
    setValueSafe('AnnualPercentageYield', '');
    return NaN;
  }

  const aprDecimal = aprNum / 100; // nominal APR as decimal
  const apyDecimal = Math.pow(1 + aprDecimal / n, n) - 1;
  const apyPercent = apyDecimal * 100;
  setValueSafe('AnnualPercentageYield', apyPercent.toFixed(2));
  return aprDecimal;
}

// Update APR field from APY input. Returns nominal APR as decimal (e.g., 2.1193)
function updateFromAPY() {
  const apyNum = getNumberFrom('AnnualPercentageYield'); // percent, e.g., 604
  const freqEl = document.getElementById('compoundingFrequency');
  const n = periodsPerYear(freqEl ? freqEl.value : null);

  if (!Number.isFinite(apyNum) || !Number.isFinite(n)) {
    setValueSafe('AnnualPercentageRateOfCharge', '');
    return NaN;
  }

  const apyDecimal = apyNum / 100;
  // periodic rate
  const periodic = Math.pow(1 + apyDecimal, 1 / n) - 1;
  const aprDecimal = periodic * n; // nominal APR in decimal
  const aprPercent = aprDecimal * 100;
  setValueSafe('AnnualPercentageRateOfCharge', aprPercent.toFixed(2));
  return aprDecimal;
}

// Calculate final deposit amount using the nominal APR decimal returned by the update functions
function calculateResults(source = 'apr') {
  // prevent running while programmatically updating fields
  if (isSyncing) return;

  const principal = getNumberFrom('initialDeposit');
  const term = getNumberFrom('Term');
  const termUnitEl = document.getElementById('TermDate');
  const termUnit = termUnitEl ? termUnitEl.value : 'years';

  let aprDecimal = NaN;
  if (source === 'apr') {
    aprDecimal = updateFromAPR(); // returns nominal APR decimal (apr/100)
  } else if (source === 'apy') {
    aprDecimal = updateFromAPY();
  } else {
    // fallback: try reading APR field directly
    const aprNum = getNumberFrom('AnnualPercentageRateOfCharge');
    aprDecimal = Number.isFinite(aprNum) ? aprNum / 100 : NaN;
  }

  // If any required value is missing or invalid, clear output and stop
  if (!Number.isFinite(principal) || principal <= 0 ||
      !Number.isFinite(term) || term <= 0 ||
      !Number.isFinite(aprDecimal)) {
    setValueSafe('Finaldeposit', '');
    return;
  }

  // convert term to years
  let years;
  switch ((termUnit || '').toString().toLowerCase()) {
    case 'days': years = term / 365; break;
    case 'weeks': years = term / 52; break;
    case 'mons': case 'months': years = term / 12; break;
    case 'years':
    default: years = term;
  }

  const freqEl = document.getElementById('compoundingFrequency');
  const n = periodsPerYear(freqEl ? freqEl.value : null);
  if (!Number.isFinite(n)) {
    setValueSafe('Finaldeposit', '');
    return;
  }

  const amount = principal * Math.pow(1 + aprDecimal / n, n * years);

  // format output with two decimals and thousands separators
  const formatted = amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  setValueSafe('Finaldeposit', formatted);
}

// --- Event bindings (guarded) ---
['initialDeposit', 'Term', 'TermDate', 'compoundingFrequency'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('input', () => calculateResults());
  el.addEventListener('change', () => calculateResults());
});

// Two-way binding for APR <-> APY with recursion guard
const aprEl = document.getElementById('AnnualPercentageRateOfCharge');
const apyEl = document.getElementById('AnnualPercentageYield');

if (aprEl) {
  aprEl.addEventListener('input', () => {
    if (isSyncing) return;
    setActiveInput(aprEl);
    calculateResults('apr');
  });
}
if (apyEl) {
  apyEl.addEventListener('input', () => {
    if (isSyncing) return;
    setActiveInput(apyEl);
    calculateResults('apy');
  });
}

function setActiveInput(el) {
  if (!el) return;
  [aprEl, apyEl].forEach(e => { if (e) e.classList.add('result'); });
  el.classList.remove('result');
}

// initial compute on load
window.addEventListener('DOMContentLoaded', () => calculateResults('apr'));