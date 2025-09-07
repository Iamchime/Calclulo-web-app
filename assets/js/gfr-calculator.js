document.querySelectorAll(
  "#Serumcreatinine, #fileUnit, #age, #female, #male, #black, #notBlack"
).forEach(input => {
  input.addEventListener("input", calculateResults);
  input.addEventListener("change", calculateResults);
});

function calculateResults() {
  const scrInput = parseFloat(document.getElementById('Serumcreatinine').value.replace(/,/g, ""));
  const scrUnit = document.getElementById('fileUnit').value;
  const age = parseInt(document.getElementById('age').value.replace(/,/g, ""));
  const gender = document.getElementById('female').checked ? 'female' : 'male';
  const race = document.getElementById('black').checked ? 'black' : 'notBlack';
  
  const resultBox = getOrCreateResultBox();
  removeErrorBox();
  resultBox.innerHTML = ""; // Clear previous results
  
  // Validate inputs
  if (isNaN(scrInput) || isNaN(age) || scrInput <= 0 || age <= 0) {
    resultBox.innerHTML = "";
    showErrorGFR("Please enter valid Serum Creatinine and Age.");
    return;
  }
  
  if (age < 18) {
    resultBox.innerHTML = "";
    showErrorGFR("This calculator is for adults. Use the pediatric version instead.");
    return;
  }
  
  // Convert Serum Creatinine to mg/dL if entered in µmol/L
  const scr = (scrUnit === 'micromole/L') ? scrInput / 88.4 : scrInput;
  
  // CKD-EPI Formula
  const k = (gender === 'female') ? 0.7 : 0.9;
  const alpha = (scr > k) ? -1.209 : (gender === 'female' ? -0.329 : -0.411);
  const sexFactor = (gender === 'female') ? 1.018 : 1;
  const raceFactor = (race === 'black') ? 1.159 : 1;
  
  const ckdepi = 141 * Math.pow(Math.min(scr / k, 1), alpha) *
    Math.pow(Math.max(scr / k, 1), -1.209) *
    Math.pow(0.993, age) *
    sexFactor *
    raceFactor;
  
  // MDRD Formula
  let mdrd = 175 * Math.pow(scr, -1.154) * Math.pow(age, -0.203);
  if (gender === 'female') mdrd *= 0.742;
  if (race === 'black') mdrd *= 1.212;
  
  // Mayo Quadratic Formula
  let mayo = (scr < 0.8) ?
    107.3 / (scr / 0.7) :
    107.3 / Math.pow(scr / 0.7, 1.5);
  mayo *= Math.pow(0.996, age);
  if (gender === 'female') mayo *= 0.762;
  
  // Display results
  resultBox.innerHTML = `
  <label>Gfr Calculation Results</label>
    <div class="resultLine">
      <strong>MDRD 4-Variable Equation:</strong> ${mdrd.toFixed(1)} mL/min/1.73 m²
    </div>
    <div class="resultLine">
      <strong>CKD-EPI Formula:</strong> ${ckdepi.toFixed(1)} mL/min/1.73 m²
    </div>
    <div class="resultLine">
      <strong>Mayo Quadratic Formula:</strong> ${mayo.toFixed(1)} mL/min/1.73 m²
    </div>
  `;
}
function showErrorGFR(message) {
  removeErrorBox();
  const error = document.createElement("div");
  error.id = "error-txt";
  error.style.color = "red";
  error.textContent = message;
  document.querySelector(".container").appendChild(error);
}

function removeErrorBox() {
  const existing = document.getElementById("error-txt");
  if (existing) existing.remove();
}

function getOrCreateResultBox() {
  let box = document.querySelector(".gfr-result-box");
  if (!box) {
    box = document.createElement("div");
    box.className = "gfr-result-box";
    document.querySelector(".container").appendChild(box);
  }
  return box;
}

window.addEventListener("load", () => {
  calculateResults();
});