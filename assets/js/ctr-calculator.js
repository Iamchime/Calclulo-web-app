// Attach event listeners for automatic calculation
document.getElementById('clicks').addEventListener('input', calculateResults);
document.getElementById('impressions').addEventListener('input', calculateResults);

function calculateResults() {
  const clicks = parseFloat(document.getElementById('clicks').value.replace(/,/g, "")) || 0;
  const impressions = parseFloat(document.getElementById('impressions').value.replace(/,/g, "")) || 0;
  const output = document.getElementById('ctrOutput');
  
  if (impressions === 0 || clicks < 0 || impressions < 0) {
    output.value = "";
    return;
  }
  
  const ctr = (clicks / impressions) * 100;
  output.value = ctr.toLocaleString(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});
}