function calculateResults() {
  // Function to clean and parse numbers properly
  function cleanNumber(value) {
    return parseFloat(value.replace(/,/g, '')) || 0;
  }

  const principal = cleanNumber(document.getElementById('initialDeposit').value);
  const apr = cleanNumber(document.getElementById('AnnualPercentageRateOfCharge').value);
  const term = cleanNumber(document.getElementById('Term').value);
  const termUnit = document.getElementById('TermDate').value;
  const frequency = document.getElementById('compoundingFrequency').value;

  if (principal <= 0 || isNaN(apr) || term <= 0) {
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

  const amount = principal * Math.pow(1 + r / n, n * years);

  // Format result nicely with commas
  document.getElementById('Finaldeposit').value = amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Auto-calculate whenever any input changes
['initialDeposit', 'AnnualPercentageRateOfCharge', 'Term', 'TermDate', 'compoundingFrequency'].forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener('input', calculateResults);
  el.addEventListener('change', calculateResults);
});

// Initial calculation on page load
document.addEventListener('DOMContentLoaded', calculateResults);