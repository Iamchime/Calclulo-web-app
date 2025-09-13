document.addEventListener("DOMContentLoaded", function() {
  const decimalEl = document.getElementById("decimal");
  const percentEl = document.getElementById("percent");
  
  // Helper: clean number (handle commas)
  function cleanNumber(value) {
    return parseFloat(value.replace(/,/g, '')) || 0;
  }
  
  // Helper: format number with commas
  function formatNumber(value) {
    return value.toLocaleString("en-US", { maximumFractionDigits: 10 });
  }
  
  let isUpdating = false; // prevent feedback loop
  
  decimalEl.addEventListener("input", function() {
    if (isUpdating) return;
    decimalEl.classList.remove("result"); // user typing -> remove
    const decimal = cleanNumber(decimalEl.value);
    isUpdating = true;
    const percent = decimal * 100;
    percentEl.value = formatNumber(percent);
    percentEl.classList.add("result"); // programmatic update
    isUpdating = false;
  });
  
  percentEl.addEventListener("input", function() {
    if (isUpdating) return;
    percentEl.classList.remove("result"); // user typing -> remove
    const percent = cleanNumber(percentEl.value);
    isUpdating = true;
    const decimal = percent / 100;
    decimalEl.value = formatNumber(decimal);
    decimalEl.classList.add("result"); // programmatic update
    isUpdating = false;
  });
});