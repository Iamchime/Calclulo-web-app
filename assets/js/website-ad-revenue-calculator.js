function calculateResults() {
  // Remove commas before parsing
  const visits = parseFloat(document.getElementById('visits').value.replace(/,/g, '')) || 0;
  const pageViewsPerVisit = parseFloat(document.getElementById('pageViewsPerVisit').value.replace(/,/g, '')) || 0;
  const adsPerPage = parseFloat(document.getElementById('adsPerPage').value.replace(/,/g, '')) || 0;
  const pageRPM = parseFloat(document.getElementById('pageRPM').value.replace(/,/g, '')) || 0;
  
  const totalPageViews = visits * pageViewsPerVisit;
  const totalAdImpressions = totalPageViews * adsPerPage;
  const revenue = (totalAdImpressions / 1000) * pageRPM;
  
  // Output without currency symbol
  document.querySelector('#estimatedRevenue').value = Number(revenue.toFixed(2)).toLocaleString();
}

// Auto-calculate on input change
document.querySelectorAll('#visits, #pageViewsPerVisit, #adsPerPage, #pageRPM')
  .forEach(input => input.addEventListener('input', calculateResults));