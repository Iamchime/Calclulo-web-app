// Select checkbox and result display
const flipCheckbox = document.getElementById("flip-coin");
const resultDiv = document.getElementById("resultDiv");

// Listen for check/uncheck event
flipCheckbox.addEventListener("change", () => {
  // Randomize coin flip
  const flip = Math.random() < 0.5 ? "Heads" : "Tails";
  
  // Show result
  resultDiv.innerHTML = `<h3>${flip}</h3>`;
  
});