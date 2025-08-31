// Function to calculate results
function calculateResults() {
  const P = parseFloat(document.getElementById("loanAmount").value.replace(/,/g, ''));
  const years = parseInt(document.getElementById("Years").value) || 0;
  const months = parseInt(document.getElementById("Months").value) || 0;
  const M = parseFloat(document.getElementById("monthlyPayments").value.replace(/,/g, ''));
  
  const resultsDiv = document.querySelector(".interest-rate-results");
  resultsDiv.innerHTML = "";
  
  
  
  const totalMonths = years * 12 + months;
  
  let low = -0.99; // allow negative rates
let high = 1;
let i = 0;
const tolerance = 0.0000001;
let iterations = 0;
const maxIterations = 100;

while (iterations < maxIterations) {
  i = (low + high) / 2;
  const guessPayment = P * i / (1 - Math.pow(1 + i, -totalMonths));
  
  if (Math.abs(guessPayment - M) < tolerance) {
    break;
  }
  
  if (guessPayment > M) {
    high = i;
  } else {
    low = i;
  }
  iterations++;
}

const monthlyRate = i;
const annualRate = monthlyRate * 12 * 100;
  
  const totalPaid = M * totalMonths;
  const totalInterest = totalPaid - P;
  
  // Format without currency symbol
  const formatted = {
    interestRate: `${annualRate.toFixed(3)}%`,
    totalPayments: totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    totalInterest: totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  };
  
  const recommendations = `
  <div class="recommendations-list">
      <div>Your effective annual interest rate is <strong class="money"><span class="currency-display-for-expanded-results" >$
  </span> ${formatted.interestRate}</strong>, which determines the true cost of the loan over time.</div>
      <div>Over the course of <strong class="money">${totalMonths}</strong> months, you will pay back a total of <strong class="money"><span class="currency-display-for-expanded-results" >$
  </span>${formatted.totalPayments}</strong>.</div>
      <div>The total interest you will pay on the loan is <strong class="money"><span class="currency-display-for-expanded-results" >$
  </span>${formatted.totalInterest}</strong>.</div>
      <div>Consider refinancing if your interest rate is significantly above the average market rate.</div>
      <div>Making extra payments can reduce your total interest paid and shorten your loan term.</div>
      </div>
  `;
  
  resultsDiv.innerHTML = `
    <div class="head-txt-re-wrap">
      <div><strong class="head-txt-re">Interest rate:</strong><strong class="money-one"> ${formatted.interestRate}</strong> </div>
      <div class="head-txt-re"><strong class="head-txt-re">Total of ${totalMonths} monthly payments:</strong> <strong class="money-one"><span class="currency-display-for-expanded-results" >$
  </span>${formatted.totalPayments}</strong></div>
      <div><strong class="head-txt-re">Total interest paid:</strong> <strong class="money-one"><span class="currency-display-for-expanded-results" >$
  </span>${formatted.totalInterest}</strong></div>
    </div>
    <br>${recommendations}
  `;
  loadSavedCurrency();
}

// Enable automatic calculation on input/change
function enableAutoCalculation() {
  const fields = [
    "#loanAmount",
    "#Years",
    "#Months",
    "#monthlyPayments"
  ];
  
  fields.forEach(id => {
    const field = document.querySelector(id);
    field.addEventListener("input", calculateResults);
    field.addEventListener("change", calculateResults);
  });
}

// Initialize automatic calculation when page loads
document.addEventListener("DOMContentLoaded", enableAutoCalculation);