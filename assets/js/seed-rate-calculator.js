let lastResult = "";

// Auto-calculate whenever inputs change
document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll("#population, #grainWeight, #germination, #fieldLosses, #area");
  inputs.forEach(input => {
    input.addEventListener("input", calculateResults);
  });
});

function calculateResults() {
  const TP = parseFloat(document.getElementById('population').value);
  const TGW = parseFloat(document.getElementById('grainWeight').value);
  const G = parseFloat(document.getElementById('germination').value);
  const L = parseFloat(document.getElementById('fieldLosses').value);
  const Area = parseFloat(document.getElementById('area').value);
  
  const resultsDiv = document.querySelector(".seed-rate-results");
  
  if ([TP, TGW, G, L, Area].some(isNaN)) {
    
    lastResult = "";
    return;
  }
  
  const seedsPerSqM = TP / ((G / 100) * ((100 - L) / 100));
  const seedRateKgPerHa = (seedsPerSqM * 10000 * TGW) / 1000000;
  const totalTonnes = (seedRateKgPerHa * Area) / 1000;
  
  lastResult = `
Sowing rate:           ${seedRateKgPerHa.toFixed(2)} kg/Ha
Seed tonnage needed:   ${totalTonnes.toFixed(2)} tonnes
Seeds sown:            ${Math.round(seedsPerSqM)} seeds/m²
Seeds per hectare:     ${(seedsPerSqM * 10000).toLocaleString()} seeds
Total seeds needed:    ${(seedsPerSqM * 10000 * Area / 1000000).toFixed(2)} million
Effective germination: ${(G * (100 - L) / 100).toFixed(2)}%
Adjusted loss rate:    ${L}%
`;
  
  resultsDiv.innerHTML = formatResultHTML(lastResult);
}

function downloadTxt() {
  if (!lastResult.trim()) {
    alert("Please calculate results first.");
    return;
  }
  
  const blob = new Blob([lastResult.trim()], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `seed_rate_results_${Math.round(Math.random() * 100000)}.txt`;
  link.click();
}

function formatResultHTML(resultText) {
  return `
    ${resultText.split("\n").map(line => {
      if (line.trim() === "") return "";
      const [label, value] = line.split(":");
      return `<div class="result-line"><span class="label">${label.trim()}:</span> ${value.trim()}</div>`;
    }).join("")}
    <button class="download" onclick="downloadTxt()">Download Results</button>
  `;
}

window.addEventListener("load", () => {
  calculateResults();
});