function calculateResults() {
  const vatRate = parseFloat(document.getElementById('vatRate').value.replace(/,/g, '')) || 0;
  const mode = document.querySelector('input[name="mode"]:checked')?.value;
  const price = parseFloat(document.getElementById('price').value.replace(/,/g, '')) || 0;
  
  // Validation
  if (isNaN(vatRate) || vatRate < 0) {
    document.querySelector('vatAmount').value = '';
    document.querySelector('#resultPrice').value = '';
    return;
  }
  
  if (isNaN(price) || price < 0) {
    document.querySelector('#vatAmount').value = '';
    document.querySelector('#resultPrice').value = '';
    return;
  }
  
  let vatAmount, resultPrice;
  
  if (mode === 'add') {
    vatAmount = (price * vatRate) / 100;
    resultPrice = price + vatAmount;
  } else {
    vatAmount = price - price / (1 + vatRate / 100);
    resultPrice = price - vatAmount;
  }
  
  document.querySelector('#vatAmount').value = vatAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  document.querySelector('#resultPrice').value = resultPrice.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Auto calculate when inputs change
document.getElementById('vatRate').addEventListener('input', calculateResults);
document.getElementById('price').addEventListener('input', calculateResults);
document.querySelectorAll('input[name="mode"]').forEach(el => {
  el.addEventListener('change', calculateResults);
});

window.addEventListener("load", () => {
  calculateResults();
});