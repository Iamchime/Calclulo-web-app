document.addEventListener("DOMContentLoaded", () => {
  const inputs = [
    "targetHours",
    "avgMinutes",
    "avgSeconds",
    "currentHours",
    "retention",
    "videoLength"
  ];
  
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", calculateResults);
      el.addEventListener("change", calculateResults);
    }
  });
});

function calculateResults() {
  const targetHours = parseFloat(document.getElementById('targetHours').value.replace(/,/g, "")) || 0;
  const avgMinutes = parseFloat(document.getElementById('avgMinutes').value.replace(/,/g, "")) || 0;
  const avgSeconds = parseFloat(document.getElementById('avgSeconds').value.replace(/,/g, "")) || 0;
  const currentHours = parseFloat(document.getElementById('currentHours')?.value.replace(/,/g, "")) || 0;
  const retention = parseFloat(document.getElementById('retention')?.value.replace(/,/g, "")) || 100;
  const videoLength = parseFloat(document.getElementById('videoLength')?.value.replace(/,/g, "")) || 0;
  
  if (targetHours <= 0 || (avgMinutes + avgSeconds) <= 0) {
    document.getElementById('RequiredViews').value = '';
    return;
  }
  
  const totalSecondsPerView = (avgMinutes * 60) + avgSeconds;
  let effectiveSecondsPerView = totalSecondsPerView;
  
  if (videoLength > 0 && retention > 0) {
    effectiveSecondsPerView = (videoLength * 60) * (retention / 100);
  }
  
  const remainingWatchSeconds = Math.max(0, (targetHours - currentHours) * 3600);
  const requiredViews = remainingWatchSeconds / effectiveSecondsPerView;
  
  document.getElementById('RequiredViews').value = formatViews(requiredViews);
}

function resetFields() {
  ['targetHours', 'avgMinutes', 'avgSeconds', 'currentHours', 'retention', 'videoLength', 'RequiredViews'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

function formatViews(number) {
  if (number >= 1_000_000_000) return (number / 1_000_000_000).toFixed(1) + 'b';
  if (number >= 1_000_000) return (number / 1_000_000).toFixed(1) + 'm';
  if (number >= 1_000) return (number / 1_000).toFixed(1) + 'k';
  return Math.ceil(number);
}