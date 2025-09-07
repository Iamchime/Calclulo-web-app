function calculateResults() {
  const adSpendInput = document.querySelector('#adspend');
  const avgCpcInput = document.querySelector('#averageCpc');
  const leadConvRateInput = document.querySelector('#leadConversionRate');
  const resultDiv = document.querySelector('#resultdiv');
  
  const adSpend = parseFloat(adSpendInput.value);
  const avgCpc = parseFloat(avgCpcInput.value);
  let leadConvRate = leadConvRateInput.value.replace('%', '').trim();
  leadConvRate = parseFloat(leadConvRate);
  
  // Check if all fields are filled first
  if (
    adSpendInput.value.trim() === '' ||
    avgCpcInput.value.trim() === '' ||
    leadConvRateInput.value.trim() === ''
  ) {
    resultDiv.innerHTML = ''; // Clear output until all inputs are filled
    return;
  }
  
  // Validation after all fields are filled
  if (
    isNaN(adSpend) || adSpend <= 0 ||
    isNaN(avgCpc) || avgCpc <= 0 ||
    isNaN(leadConvRate) || leadConvRate <= 0 || leadConvRate > 100
  ) {
    resultDiv.innerHTML = `
      <p id="error-txt">
        Please enter valid positive numbers. Lead Conversion Rate must be between 0 and 100.
      </p>`;
    return;
  }
  
  // Calculate total clicks (website sessions)
  const totalSessions = adSpend / avgCpc;
  
  // Calculate conversions/leads
  const conversions = totalSessions * (leadConvRate / 100);
  
  // Calculate cost per raw inquiry (cost per lead)
  const costPerInquiry = adSpend / conversions;
  
  // Format numbers with commas only
  function formatNumber(num) {
    return num.toLocaleString(undefined, { maximumFractionDigits: 0 });
  }
  
  // Output results HTML
  resultDiv.innerHTML = `
    <h3>Facebook Ads Lead Metrics</h3>
    <p class="result-fb"><strong>Total Website Sessions from PPC</strong><br>${formatNumber(totalSessions)}</p>
    <p class="result-fb"><strong>Conversions/Leads/Inquiries</strong><br>${formatNumber(conversions)}</p>
    <p class="result-fb"><strong>Cost Per Raw Inquiry</strong><br><span><span class="currency-display-for-expanded-results" >$
  </span>${costPerInquiry.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
  `;
  loadSavedCurrency();
}


// Attach automatic calculation on input change
document.querySelectorAll('#adspend, #averageCpc, #leadConversionRate').forEach(input => {
  input.addEventListener('input', calculateResults);
});

window.addEventListener("load", () => {
  calculateResults();
});