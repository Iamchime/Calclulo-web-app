function calculateResults() {
  // Remove commas before parsing
  const principal = parseFloat(document.getElementById('initialDeposit').value.replace(/,/g, ''));
  const rate = parseFloat(document.getElementById('interestRate').value.replace(/,/g, ''));
  const compound = document.getElementById('compoundingFrequency').value;
  const years = parseFloat(document.getElementById('years').value.replace(/,/g, '')) || 0;
  const months = parseFloat(document.getElementById('month').value.replace(/,/g, '')) || 0;
  const taxRate = parseFloat(document.getElementById('MarginalTaxRate').value.replace(/,/g, '')) || 0;
  
  if (isNaN(principal) || isNaN(rate)) {
    document.getElementById('Final balance').value = '';
    document.getElementById('InterestEarned').value = '';
    return;
  }
  
  // Convert duration to total years
  const totalYears = years + (months / 12);
  
  // Compounding frequencies
  const frequencies = {
    'Yearly': 1,
    'Half-Yearly': 2,
    'Quarterly': 4,
    'Monthly': 12,
    'Weekly': 52,
    'Daily': 365
  };
  const n = frequencies[compound] || 1;
  const r = rate / 100;
  
  // Compound interest formula
  const amount = principal * Math.pow(1 + r / n, n * totalYears);
  const interest = amount - principal;
  
  // Apply marginal tax to interest earned
  const taxedInterest = interest * (1 - taxRate / 100);
  const finalBalance = principal + taxedInterest;
  
  // Output as formatted numbers, no currency symbol
  document.getElementById('Final balance').value = finalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById('InterestEarned').value = taxedInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}



// Auto-calculate on any input change
function enableAutoCalculation() {
  const fields = document.querySelectorAll('#initialDeposit, #interestRate, #compoundingFrequency, #years, #month, #MarginalTaxRate');
  fields.forEach(field => {
    field.addEventListener('input', calculateResults);
    field.addEventListener('change', calculateResults);
  });
}

window.addEventListener('DOMContentLoaded', enableAutoCalculation);

window.addEventListener("load", () => {
  calculateResults();
});