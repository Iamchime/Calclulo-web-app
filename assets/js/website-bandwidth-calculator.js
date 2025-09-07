document.addEventListener("DOMContentLoaded", () => {
  const inputs = [
    "pageViews",
    "pageSize",
    "redundancy"
  ];
  
  // Attach event listeners for input and change
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", calculateResults);
      el.addEventListener("change", calculateResults);
    }
  });
  
  // Also attach listener to the radio buttons
  const sizeRadios = document.querySelectorAll('input[name="sizeUnit"]');
  sizeRadios.forEach(radio => {
    radio.addEventListener("change", calculateResults);
  });
});

function calculateResults() {
  // Remove commas before parsing
  const pageViews = parseFloat(document.getElementById("pageViews").value.replace(/,/g, ""));
  const pageSize = parseFloat(document.getElementById("pageSize").value.replace(/,/g, ""));
  const unitEl = document.querySelector('input[name="sizeUnit"]:checked');
  const unit = unitEl ? unitEl.value : "MB";
  const redundancy = parseFloat(document.getElementById("redundancy").value.replace(/,/g, "")) || 1;
  
  if (isNaN(pageViews) || isNaN(pageSize) || pageViews <= 0 || pageSize <= 0) {
    document.getElementById("EstimatedMonthlyBandwidth").value = "";
    return;
  }
  
  const sizeMB = unit === "KB" ? pageSize / 1024 : pageSize;
  const dailyUsageMB = pageViews * sizeMB * redundancy;
  const monthlyUsageGB = (dailyUsageMB * 30) / 1024;
  
  // Format number with commas
  document.getElementById("EstimatedMonthlyBandwidth").value = monthlyUsageGB.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

window.addEventListener("load", () => {
  calculateResults();
});