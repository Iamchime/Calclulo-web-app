document.querySelectorAll("#height, #weight, #age, #activity, input[name='gender']")
  .forEach(input => {
    input.addEventListener("input", calculateResults);
    input.addEventListener("change", calculateResults);
  });

function calculateResults() {
  const genderEl = document.querySelector('input[name="gender"]:checked');
  if (!genderEl) return;
  
  const gender = genderEl.value;
  const height = parseFloat(document.getElementById("height").value.replace(/,/g, ""));
  const weight = parseFloat(document.getElementById("weight").value.replace(/,/g, ""));
  const age = parseFloat(document.getElementById("age").value.replace(/,/g, ""));
  const activity = parseFloat(document.getElementById("activity").value);
  
  // Validate inputs
  if (isNaN(height) || isNaN(weight) || isNaN(age) || isNaN(activity)) {
    document.querySelector("#caloriesResult").value = "";
    document.getElementById("fatResults").innerHTML = "";
    return;
  }
  
  // Use correct BMR formula
  const s = gender === "male" ? 5 : -161;
  const bmr = 10 * weight + 6.25 * height - 5 * age + s;
  const calories = bmr * activity;
  
  // Update calories result
  document.querySelector("#caloriesResult").value = Math.round(calories).toLocaleString();
  
  // Fat intake calculations
  const fatMin = calories * 0.20 / 9;
  const fatMax = calories * 0.35 / 9;
  const satFatMax = calories * 0.10 / 9;
  
  const fatMinKcal = calories * 0.20;
  const fatMaxKcal = calories * 0.35;
  const satFatKcal = calories * 0.10;
  
  // Display formatted results
  document.getElementById("fatResults").innerHTML = `
        <label>Recommended Fat Intake</label>
        Total fat intake: 20 – 35% energy:<br>
        <strong>${Math.round(fatMin).toLocaleString()} – ${Math.round(fatMax).toLocaleString()} grams</strong>
        (${Math.round(fatMinKcal).toLocaleString()} – ${Math.round(fatMaxKcal).toLocaleString()} kcal)<br><br>
        Saturated fats — max 10% energy:<br>
        <strong>Less than ${Math.round(satFatMax).toLocaleString()} grams</strong>
        (${Math.round(satFatKcal).toLocaleString()} kcal) – the less the better!
    `;
}

window.addEventListener("load", () => {
  calculateResults();
});