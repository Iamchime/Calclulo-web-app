function calculateResults() {
  const p1Raw = parseFloat(document.getElementById("probabilityOfFailureOne").value) || 0;
  const l1 = parseFloat(document.getElementById("LossOne").value.replace(/,/g, '')) || 0;
  const p2Raw = parseFloat(document.getElementById("probabilityOfFailureTwo").value) || 0;
  const l2 = parseFloat(document.getElementById("LossTwo").value.replace(/,/g, '')) || 0;
  
  const p1 = p1Raw / 100;
  const p2 = p2Raw / 100;
  
  const r1 = p1 * l1;
  const r2 = p2 * l2;
  
  // Format with commas and two decimals
  const formattedR1 = r1.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formattedR2 = r2.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
  document.getElementById("RiskOne").value = formattedR1;
  document.getElementById("RiskTwo").value = formattedR2;
  
  let message = "";
  if (r1 < r2) {
    message = `You should choose option <strong>A</strong> – it is far less risky!`;
  } else if (r2 < r1) {
    message = `You should choose option <strong>B</strong> – it is far less risky!`;
  } else {
    message = `Both options carry the same level of risk.`;
  }
  
  document.querySelector(".risk-insights-result").innerHTML = `
    <div class="result-message">${message}</div>
  `;
  
  // Auto-save if enabled
  if (window.isAutoSaveEnabled && window.isAutoSaveEnabled()) {
    if (typeof window.saveInputs === "function") window.saveInputs();
  }
}

// Attach automatic calculation to inputs
document.querySelectorAll("#probabilityOfFailureOne, #LossOne, #probabilityOfFailureTwo, #LossTwo").forEach(input => {
  input.addEventListener("input", calculateResults);
});

window.addEventListener("load", () => {
  calculateResults();
});