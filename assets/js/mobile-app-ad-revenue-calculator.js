function toNumber(value) {
  if (value == null) return NaN;
  const cleaned = String(value).replace(/[^0-9.\-]/g, "");
  return cleaned === "" ? NaN : parseFloat(cleaned);
}

function calculateResults() {
  const visits            = toNumber(document.getElementById('visits').value) || 0;
  const pageViewsPerVisit = toNumber(document.getElementById('pageViewsPerVisit').value) || 0;
  const adsPerPage        = toNumber(document.getElementById('adsPerPage').value) || 0;
  const pageRPM           = toNumber(document.getElementById('pageRPM').value) || 0;

  const totalPageViews     = visits * pageViewsPerVisit;
  const totalAdImpressions = totalPageViews * adsPerPage;
  const revenue            = (totalAdImpressions / 1000) * pageRPM;

  // No currency symbol; nicely formatted with thousand separators
  const out = isFinite(revenue) ? revenue.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) : "";

  document.getElementById('estimatedRevenue').value = out;
}

document.addEventListener('DOMContentLoaded', () => {
  ['visits','pageViewsPerVisit','adsPerPage','pageRPM']
    .forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('input', calculateResults);
      el.addEventListener('change', calculateResults);
    });
  calculateResults();
});

window.addEventListener("load", () => {
  calculateResults();
});