document.addEventListener("DOMContentLoaded", function() {
  const diamondInput = document.getElementById("tiktokdiamonds");
  const resultDiv = document.querySelector(".tiktokDiamondsResult");
  
  function calculateResults() {
    const diamonds = parseFloat(diamondInput.value.replace(/,/g, "")) || 0;
    
    // If input is empty or negative, clear results
    if (isNaN(diamonds) || diamonds < 0) {
      resultDiv.innerHTML = "";
      return;
    }
    
    // Conversion logic
    const usd = diamonds * 0.005;
    const coins = diamonds * 2;
    
    // Display results
    resultDiv.innerHTML = `
      <div class="output-group">
        <label>Earnings in USD</label>
        <span class="output-box">$${usd
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
      </div>
      <div id="goldwrap" class="output-group">
        <label>Coins equivalent</label>
        <span id="gold" class="output-box">${coins.toLocaleString()}</span>
      </div>
    `;
  }
  
  // Auto-calculate on input
  diamondInput.addEventListener("input", calculateResults);
});

window.addEventListener("load", () => {
  calculateResults();
});