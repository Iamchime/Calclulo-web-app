const tiktokCoinsInput = document.getElementById("tiktokCoins");
const quickAmounts = document.querySelectorAll(".quick-amounts-wrap span");
const resultDiv = document.querySelector(".tiktokCoinsResult");

// Constants
const COIN_TO_USD = 0.01; // Conversion rate

// Helper to format currency
function formatUSD(value) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

// Main calculation function
function calculateResults() {
  const rawValue = tiktokCoinsInput.value.replace(/,/g, ""); // Remove commas
  const coins = parseInt(rawValue, 10);
  
  if (isNaN(coins) || coins <= 0) {
    resultDiv.innerHTML = '<p id="error-txt">Please enter a valid number of TikTok coins.</p>';
    return;
  }
  
  const totalUSD = coins * COIN_TO_USD;
  const tiktokShare = totalUSD * 0.30;
  const creatorShare = totalUSD * 0.70;
  
  resultDiv.innerHTML = `
    <div class="result-block">
      <label>Total Value (USD)</label>
      <span class="result-amount total-usd">${formatUSD(totalUSD)}</span>
    </div>

    <div class="result-block">
      <label>TikTok Share (30%)</label>
      <span class="result-amount tiktok-share">${formatUSD(tiktokShare)}</span>
    </div>

    <div class="result-block">
      <label>Creator Share (70%)</label>
      <span class="result-amount creator-share">${formatUSD(creatorShare)}</span>
    </div>
  `;
}

// Automatically calculate when typing
tiktokCoinsInput.addEventListener("input", () => {
  // Format the number with commas while typing
  const cleanedValue = tiktokCoinsInput.value.replace(/,/g, "");
  if (!isNaN(cleanedValue) && cleanedValue !== "") {
    tiktokCoinsInput.value = parseInt(cleanedValue, 10).toLocaleString();
  }
  
  calculateResults();
});

// Quick amounts click functionality
quickAmounts.forEach((btn) => {
  btn.addEventListener("click", () => {
    tiktokCoinsInput.value = parseInt(btn.textContent.replace(/,/g, ""), 10).toLocaleString();
    calculateResults();
  });
});

window.addEventListener("load", () => {
  calculateResults();
});