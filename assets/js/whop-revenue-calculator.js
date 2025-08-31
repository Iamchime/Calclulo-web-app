// Function to calculate revenue automatically
function calculateResults() {
  // Get input values safely, allowing numbers like 15,000
  const views = parseFloat(document.getElementById('whopViews').value.replace(/,/g, '')) || 0;
  const cpm = parseFloat(document.getElementById('cpm').value.replace(/,/g, '')) || 0;
  
  // Calculate revenues
  const dailyRevenue = (views / 1000) * cpm;
  const monthlyRevenue = dailyRevenue * 30;
  const yearlyRevenue = dailyRevenue * 365;
  
  // Display results without currency sign but with proper comma formatting
  document.getElementById('dailyRevenue').value = Number(dailyRevenue.toFixed(2)).toLocaleString();
  document.getElementById('monthlyRevenue').value = Number(monthlyRevenue.toFixed(2)).toLocaleString();
  document.getElementById('yearlyRevenue').value = Number(yearlyRevenue.toFixed(2)).toLocaleString();
}

// Attach auto-calculate on input change
document.getElementById('whopViews').addEventListener('input', calculateResults);
document.getElementById('cpm').addEventListener('input', calculateResults);

// Run calculation on page load (optional)
calculateResults();