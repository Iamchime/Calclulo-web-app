const utilityCheckbox = document.getElementById('include-utilities');
const utilitiesGroup = document.getElementById('utilities-group');

utilityCheckbox.addEventListener('change', () => {
  utilitiesGroup.style.display = utilityCheckbox.checked ? 'none' : 'block';
});
utilitiesGroup.style.display = utilityCheckbox.checked ? 'none' : 'block';

// Auto-calculate rent affordability
function calculateResults() {
  const income = parseFloat(document.getElementById('income').value.replace(/,/g, '')) || 0;
  const frequency = document.getElementById('income-frequency').value;
  const debt = parseFloat(document.getElementById('monthly-debt').value.replace(/,/g, '')) || 0;
  const ratio = parseFloat(document.getElementById('rent-ratio').value) / 100 || 0.3;
  const includeUtilities = document.getElementById('include-utilities').checked;
  const utilities = includeUtilities ? 0 : (parseFloat(document.getElementById('utility-cost').value.replace(/,/g, '')) || 0);
  
  // Convert yearly income to monthly if needed
  const monthlyIncome = frequency === 'yearly' ? income / 12 : income;
  
  // Calculate affordability
  const maxAffordable = (monthlyIncome * ratio) - debt - utilities;
  const recommendedAffordable = (monthlyIncome * 0.25) - debt - utilities;
  
  // Get output div
  const outputDiv = document.getElementById('rent-output');
  
  if (maxAffordable > 0) {
    const formattedMaxAffordable = maxAffordable.toLocaleString(undefined, { maximumFractionDigits: 0 });
    const formattedRecommended = recommendedAffordable.toLocaleString(undefined, { maximumFractionDigits: 0 });
    outputDiv.innerHTML = `
      <label>Rent Affordability Result</label>
      <p>You can afford up to <strong><span class="currency-display-for-expanded-results" >$
  </span>${formattedMaxAffordable}</strong> per month on rent.</p>
      <p>It is recommended to keep your rental payment below <strong><span class="currency-display-for-expanded-results" >$
  </span>${formattedRecommended}</strong> per month.</p>
    `;
  } else {
    outputDiv.innerHTML = `<p id="error-txt">Your income and expenses suggest you cannot currently afford rent within your selected ratio.</p>`;
  }
  loadSavedCurrency();
}

// Automatically trigger calculation when inputs change
document.querySelectorAll('#income, #income-frequency, #monthly-debt, #rent-ratio, #utility-cost, #include-utilities')
  .forEach(input => input.addEventListener('input', calculateResults));
  
  window.addEventListener("load", () => {
  calculateResults();
});