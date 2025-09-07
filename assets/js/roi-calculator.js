let roiChartInstance = null;

function calculateResults() {
  const invested = parseFloat(document.getElementById("amountInvested").value.replace(/,/g, "")) || 0;
  const returned = parseFloat(document.getElementById("amountReturned").value.replace(/,/g, "")) || 0;
  const dateFrom = new Date(document.getElementById("dateFrom").value);
  const dateTo = new Date(document.getElementById("dateTo").value);
  const resultDiv = document.querySelector(".roi-results");
  
  resultDiv.innerHTML = "";
  
  
  // Calculate ROI values
  const gain = returned - invested;
  const roi = (gain / invested) * 100;
  const timeDiff = dateTo.getTime() - dateFrom.getTime();
  const years = timeDiff / (1000 * 60 * 60 * 24 * 365.25);
  const annualizedROI = Math.pow(returned / invested, 1 / years) - 1;
  
  // Format numbers without currency
  const formatNumber = (val) =>
    val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  
  // Build results table
  const tableHTML = `
    <div class="tableWrap">
      <table class="result-table">
        <tr>
          <td class="table-txt">Investment Gain</td>
          <td class="table-numb"><span class="currency-display-for-expanded-results" >$
  </span>${formatNumber(gain)}</td>
        </tr>
        <tr>
          <td class="table-txt">ROI</td>
          <td class="table-numb">${roi.toFixed(2)}%</td>
        </tr>
        <tr>
          <td class="table-txt">Annualized ROI</td>
          <td class="table-numb">${(annualizedROI * 100).toFixed(2)}%</td>
        </tr>
        <tr>
          <td class="table-txt">Investment Length</td>
          <td class="table-numb-age">${years.toFixed(3)} years</td>
        </tr>
      </table>
    </div>
  `;
  
  resultDiv.innerHTML = tableHTML;
  loadSavedCurrency();
}

// Auto-calculate whenever inputs change
document
  .querySelectorAll("#amountInvested, #amountReturned, #dateFrom, #dateTo")
  .forEach((input) => input.addEventListener("input", calculateResults));
  
  window.addEventListener("load", () => {
  calculateResults();
});