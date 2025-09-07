document.addEventListener("DOMContentLoaded", () => {
  const inputs = ["cost", "views"];
  
  // Attach automatic calculation on input/change
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", calculateResults);
      el.addEventListener("change", calculateResults);
    }
  });
});

function calculateResults() {
  const cost = parseFloat(document.querySelector('#cost').value.replace(/,/g, "")) || 0;
  const views = parseFloat(document.querySelector('#views').value.replace(/,/g, "")) || 0;
  const cpmOutput = document.querySelector('#cpmOutput');
  
  // Reset output if invalid input
  if (cost <= 0 || views <= 0) {
    cpmOutput.value = "";
    return;
  }
  
  const cpm = (cost / views) * 1000;
  cpmOutput.value = cpm.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

window.addEventListener("load", () => {
  calculateResults();
});