const ingredientDensities = {
  water: 1.0,
  flour: 0.53,
  milk: 1.03,
  sugar: 0.85,
  salt: 1.2,
  honey: 1.42,
  butter: 0.911,
  olive_oil: 0.92,
  rice_raw: 0.85,
  oats: 0.4,
  jam: 1.35,
  nutella: 1.2,
  maple_syrup: 1.33,
  cream_38: 1.01,
  cream_13: 1.0,
  powder_sugar: 0.56,
  flaked_almonds: 0.35,
  cacao: 0.6,
  corn_starch: 0.54,
  rye_flour: 0.59
};

const cupVolumes = {
  "US customary cups (recipes) (US cups)": 236.588,
  "US legal cups (nutrition) (US legal cups)": 240,
  "UK/Australia/Canada/South Africa metric cups (UK/AU/ CA/ZA cups)": 250
};

const massToGrams = {
  ug: 1e-6,
  mg: 1e-3,
  g: 1,
  dag: 10,
  kg: 1000,
  t: 1e6,
  gr: 0.06479891,
  dr: 1.771845195,
  oz: 28.349523125,
  lb: 453.59237,
  st: 6350.29318,
  us_ton: 907184.74,
  long_ton: 1016046.91,
  earths: 5.97237e27,
  me: 9.10938356e-28,
  u: 1.66053906660e-24,
  oz_t: 31.1034768
};

const densityUnitToGperML = {
  t_per_m3: 1000,
  kg_per_m3: 0.001,
  kg_per_dm3: 1,
  kg_per_L: 1,
  g_per_L: 0.001,
  g_per_dL: 0.01,
  g_per_mL: 1,
  g_per_cm3: 1,
  oz_per_cu_in: 0.578036672,
  lb_per_cu_in: 33.905725,
  lb_per_cu_ft: 0.016018463,
  lb_per_cu_yd: 0.000593276,
  lb_per_us_gal: 0.1198264,
  mg_per_L: 0.000001
};

// Show/hide custom density input
document.getElementById("ingredientSelect").addEventListener("change", () => {
  const customDensityGroup = document.querySelector('div.input-group[style*="display: none"]');
  if (document.getElementById("ingredientSelect").value === "custom") {
    customDensityGroup.style.display = "block";
  } else {
    customDensityGroup.style.display = "none";
  }
  calculateResults();
});

function convertMassToGrams(value, unit) {
  return massToGrams[unit] ? value * massToGrams[unit] : NaN;
}

function convertDensityToGperML(value, unit) {
  return densityUnitToGperML[unit] ? value * densityUnitToGperML[unit] : NaN;
}

function calculateResults() {
  const ingredient = document.getElementById("ingredientSelect").value;
  const weight = parseFloat(document.getElementById("weightInput").value.replace(/,/g, ''));
  const massUnit = document.getElementById("massUnits").value;
  const cupType = document.getElementById("cupType").value;
  
  if (!ingredient || isNaN(weight) || weight <= 0) return;
  
  let density;
  if (ingredient === "custom") {
    const densityVal = parseFloat(document.getElementById("DensityNumb").value);
    const densityUnit = document.getElementById("densityUnit").value;
    if (isNaN(densityVal) || densityVal <= 0 || !densityUnit) return;
    density = convertDensityToGperML(densityVal, densityUnit);
    if (isNaN(density)) return;
  } else {
    density = ingredientDensities[ingredient];
    if (!density) return;
  }
  
  const weightInGrams = convertMassToGrams(weight, massUnit);
  if (isNaN(weightInGrams)) return;
  
  const volumeML = weightInGrams / density;
  const cupVolumeML = cupVolumes[cupType];
  if (!cupVolumeML) return;
  
  const cups = volumeML / cupVolumeML;
  document.getElementById("cupsOutput").value = cups.toLocaleString(undefined, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  });
}

// Auto-calculate on input change
["ingredientSelect", "weightInput", "massUnits", "cupType", "DensityNumb", "densityUnit"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener("input", calculateResults);
});