function calculateResults() {
  const priceInput = document.getElementById("price").value.replace(/,/g, '');
  const taxRateInput = document.getElementById("taxRate").value.replace(/,/g, '');
  
  const price = parseFloat(priceInput);
  const taxRate = parseFloat(taxRateInput);
  const isIncluded = document.querySelector('input[name="included"]:checked')?.value === "yes";
  
  
  
  let taxAmount, total;
  
  if (isIncluded) {
    const basePrice = price / (1 + taxRate / 100);
    taxAmount = price - basePrice;
    total = price;
  } else {
    taxAmount = (price * taxRate) / 100;
    total = price + taxAmount;
  }
  
  document.querySelector("#taxAmount").value = formatNumber(taxAmount);
  document.querySelector("#totalPrice").value = formatNumber(total);
  
  saveInputsIfNeeded();
}

function formatNumber(num) {
  if (typeof num !== "number" || isNaN(num)) return "0.00";
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// ✅ Automatically calculate when inputs change
document.addEventListener("input", function(e) {
  if (e.target.matches("#price, #taxRate, input[name='included']")) {
    calculateResults();
  }
});

window.addEventListener("load", () => {
  calculateResults();
});