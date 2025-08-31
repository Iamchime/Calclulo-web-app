function calculateResults() {
  const dpi = parseFloat(document.getElementById('dpi').value) || 0;
  const sensitivity = parseFloat(document.getElementById('sensitivity').value) || 0;
  
  const sensitivityTypeElement = document.querySelector('input[name="sensitivityType"]:checked');
  const sensitivityType = sensitivityTypeElement ? sensitivityTypeElement.value : 'decimal';
  
  let edpi = 0;
  
  if (sensitivityType === 'decimal') {
    edpi = dpi * sensitivity;
  } else if (sensitivityType === 'percent') {
    edpi = dpi * (sensitivity / 100);
  }
  
  document.getElementById('edpiResult').value = edpi.toLocaleString(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});
}

// Attach auto-calculate event listeners
document.getElementById('dpi').addEventListener('input', calculateResults);
document.getElementById('sensitivity').addEventListener('input', calculateResults);
document.querySelectorAll('input[name="sensitivityType"]').forEach(radio => {
  radio.addEventListener('change', calculateResults);
});

// Calculate once on page load (optional)
calculateResults();