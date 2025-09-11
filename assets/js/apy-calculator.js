function cleanNumber(value) {
  return parseFloat(value.replace(/,/g, '')) || 0;
}

function updateFromAPR() {
  const apr = cleanNumber(document.getElementById('AnnualPercentageRateOfCharge').value);
  const frequency = document.getElementById('compoundingFrequency').value;

  const periods = {
    'Yearly': 1,
    'Half-Yearly': 2,
    'Quarterly': 4,
    'Monthly': 12,
    'Weekly': 52,
    'Daily': 365
  };

  const n = periods[frequency];
  const r = apr / 100;

  if (!apr || !n) {
    document.getElementById('AnnualPercentageYield').value = '';
    return r;
  }

  const apy = (Math.pow(1 + r / n, n) - 1) * 100;
  document.getElementById('AnnualPercentageYield').value = apy.toFixed(2);
  return r;
}

function updateFromAPY() {
  const apy = cleanNumber(document.getElementById('AnnualPercentageYield').value);
  const frequency = document.getElementById('compoundingFrequency').value;

  const periods = {
    'Yearly': 1,
    'Half-Yearly': 2,
    'Quarterly': 4,
    'Monthly': 12,
    'Weekly': 52,
    'Daily': 365
  };

  const n = periods[frequency];
  if (!apy || !n) {
    document.getElementById('AnnualPercentageRateOfCharge').value = '';
    return 0;
  }

  const r = Math.pow(1 + apy / 100, 1 / n) - 1;
  const apr = r * n * 100;

  document.getElementById('AnnualPercentageRateOfCharge').value = apr.toFixed(2);
  return apr / 100;
}

function calculateResults(source = 'apr') {
  const principal = cleanNumber(document.getElementById('initialDeposit').value);
  const term = cleanNumber(document.getElementById('Term').value);
  const termUnit = document.getElementById('TermDate').value;

  let r;
  if (source === 'apr') {
    r = updateFromAPR();
  } else if (source === 'apy') {
    // only update APR, do NOT calculate final balance
    updateFromAPY();
    return;
  }

  if (principal <= 0 || isNaN(r) || term <= 0) {
    document.getElementById('Finaldeposit').value = '';
    return;
  }

  let years;
  switch (termUnit) {
    case 'days': years = term / 365; break;
    case 'weeks': years = term / 52; break;
    case 'mons': years = term / 12; break;
    case 'years':
    default: years = term;
  }

  const frequency = document.getElementById('compoundingFrequency').value;
  const periods = {
    'Yearly': 1,
    'Half-Yearly': 2,
    'Quarterly': 4,
    'Monthly': 12,
    'Weekly': 52,
    'Daily': 365
  };

  const n = periods[frequency];

  const amount = principal * Math.pow(1 + r / n, n * years);

  document.getElementById('Finaldeposit').value = amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// --- Event bindings ---
['initialDeposit', 'Term', 'TermDate', 'compoundingFrequency'].forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener('input', () => calculateResults());
  el.addEventListener('change', () => calculateResults());
});

// Special handling for APR ↔ APY two-way binding
const aprEl = document.getElementById('AnnualPercentageRateOfCharge');
const apyEl = document.getElementById('AnnualPercentageYield');

aprEl.addEventListener('input', () => {
  setActiveInput(aprEl);
  calculateResults('apr');
});

apyEl.addEventListener('input', () => {
  setActiveInput(apyEl);
  calculateResults('apy'); // updates APR but does NOT recalc final balance
});

function setActiveInput(el) {
  [aprEl, apyEl].forEach(e => e.classList.add('result'));
  el.classList.remove('result');
}

window.addEventListener('DOMContentLoaded', () => calculateResults('apr'));