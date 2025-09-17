window.addEventListener("DOMContentLoaded", () => {
  // inputs & selects
  const timeInput = document.getElementById("TimeYouHaveBeenVegan");
  const timeUnit = document.getElementById("TimeYouHaveBeenVeganUnit");

  const animalInput = document.getElementById("AnimalLives");

  const co2Input = document.getElementById("CO2");
  const co2Unit = document.getElementById("CO2Unit");

  const forestsInput = document.getElementById("Forests");
  const forestsUnit = document.getElementById("ForestsUnit");

  const grainInput = document.getElementById("Grain");
  const grainUnit = document.getElementById("GrainUnit");

  const waterInput = document.getElementById("water");
  const waterUnit = document.getElementById("WaterUnit");

  // multipliers per 1 vegan day (base units: animals=1, CO2=kg, forests=m², grain=kg, water=liters)
  const factors = {
    animals: 1,
    co2: 9.07,      // kg per day
    forests: 2.785, // m² per day
    grain: 18.14,   // kg per day
    water: 4175     // liters per day
  };

  // programmatic write guard to avoid event loops
  let programmaticWrite = false;

  // initialize previous-unit tracking so we can convert when a select changes
  [co2Unit, forestsUnit, grainUnit, waterUnit].forEach(sel => sel.dataset.prev = sel.value);

  // -------------------------
  // Parsing / formatting
  // -------------------------
  function parseNumber(val) {
    if (val === null || val === undefined) return 0;
    // remove commas, spaces, non-numeric except dot and minus
    const cleaned = String(val).replace(/[, ]+/g, "").replace(/[^\d.-]/g, "");
    const num = parseFloat(cleaned);
    return Number.isFinite(num) ? num : 0;
  }

  function formatNumberLocalized(num, maxFractionDigits = 2) {
    // If the number is effectively an integer and maxFractionDigits = 0, use no decimals
    return Number.isFinite(num)
      ? num.toLocaleString("en-US", { maximumFractionDigits: maxFractionDigits })
      : "0";
  }

  // -------------------------
  // Time unit conversions
  // -------------------------
  function timeToDays(value, unit) {
    const v = parseNumber(value);
    switch (unit) {
      case "weeks": return v * 7;
      case "months": return v * 30.44;  // average month
      case "years": return v * 365.25;  // average year
      default: return v; // days
    }
  }

  function daysToTime(days, unit) {
    const d = Number(days) || 0;
    switch (unit) {
      case "weeks": return d / 7;
      case "months": return d / 30.44;
      case "years": return d / 365.25;
      default: return d; // days
    }
  }

  // -------------------------
  // Unit conversion helpers (base units: CO2=kg, forests=m², grain=kg, water=liters)
  // -------------------------
  function convertCO2FromKg(kg, toUnit) {
    const m = {
      grams: kg * 1000,
      decagrams: kg * 100,
      kilograms: kg,
      "metric tons": kg / 1000,
      ounces: kg * 35.2739619,
      pounds: kg * 2.20462262
    };
    return m[toUnit] ?? kg;
  }
  function convertCO2ToKg(value, fromUnit) {
    switch (fromUnit) {
      case "grams": return value / 1000;
      case "decagrams": return value / 100;
      case "kilograms": return value;
      case "metric tons": return value * 1000;
      case "ounces": return value / 35.2739619;
      case "pounds": return value / 2.20462262;
      default: return value;
    }
  }

  function convertForestsFromM2(m2, toUnit) {
    const m = {
      ares: m2 / 100,
      acres: m2 / 4046.8564224,
      decares: m2 / 1000,
      hectares: m2 / 10000,
      squarefeet: m2 * 10.763910417,
      "square meters": m2,
      "square miles": m2 / 2.589988110336e+6,
      "square kilometers": m2 / 1e6,
      "square fields": m2 / 7140, // approximate as provided earlier
      "square yards": m2 * 1.1959900463
    };
    return m[toUnit] ?? m2;
  }
  function convertForestsToM2(value, fromUnit) {
    switch (fromUnit) {
      case "ares": return value * 100;
      case "acres": return value * 4046.8564224;
      case "decares": return value * 1000;
      case "hectares": return value * 10000;
      case "squarefeet": return value / 10.763910417;
      case "square meters": return value;
      case "square miles": return value * 2.589988110336e+6;
      case "square kilometers": return value * 1e6;
      case "square fields": return value * 7140;
      case "square yards": return value / 1.1959900463;
      default: return value;
    }
  }

  function convertGrainFromKg(kg, toUnit) {
    const m = {
      grams: kg * 1000,
      decagrams: kg * 100,
      kilograms: kg,
      "metric tons": kg / 1000,
      ounces: kg * 35.2739619,
      pounds: kg * 2.20462262,
      "US short tons": kg / 907.18474,
      "imperial tons": kg / 1016.0469088
    };
    return m[toUnit] ?? kg;
  }
  function convertGrainToKg(value, fromUnit) {
    switch (fromUnit) {
      case "grams": return value / 1000;
      case "decagrams": return value / 100;
      case "kilograms": return value;
      case "metric tons": return value * 1000;
      case "ounces": return value / 35.2739619;
      case "pounds": return value / 2.20462262;
      case "US short tons": return value * 907.18474;
      case "imperial tons": return value * 1016.0469088;
      default: return value;
    }
  }

  function convertWaterFromLiters(liters, toUnit) {
    const m = {
      liters: liters,
      hectoliters: liters / 100,
      "gallons (US)": liters / 3.785411784,
      "gallons(UK)": liters / 4.54609
    };
    return m[toUnit] ?? liters;
  }
  function convertWaterToLiters(value, fromUnit) {
    switch (fromUnit) {
      case "liters": return value;
      case "hectoliters": return value * 100;
      case "gallons (US)": return value * 3.785411784;
      case "gallons(UK)": return value * 4.54609;
      default: return value;
    }
  }

  // -------------------------
  // Utility setResult - applies .result class for programmatic updates
  // -------------------------
  function setResult(el, value, options = {}) {
    // options: { decimals: number | 0 }
    const decimals = ("decimals" in options) ? options.decimals : 2;
    programmaticWrite = true;
    // pick formatting based on decimals
    el.value = formatNumberLocalized(value, decimals);
    // add result class for programmatic updates
    el.classList.add("result");
    // allow input handlers to run after we finish writing
    setTimeout(() => programmaticWrite = false, 0);
  }

  // -------------------------
  // Primary calculation: from days -> all metrics
  // -------------------------
  function calculateFromDays(days) {
    const animals = days * factors.animals;
    const co2Kg = days * factors.co2;
    const forestsM2 = days * factors.forests;
    const grainKg = days * factors.grain;
    const waterLiters = days * factors.water;

    // update each field in its selected unit
    setResult(animalInput, animals, { decimals: 0 });
    setResult(co2Input, convertCO2FromKg(co2Kg, co2Unit.value), { decimals: 2 });
    setResult(forestsInput, convertForestsFromM2(forestsM2, forestsUnit.value), { decimals: 2 });
    setResult(grainInput, convertGrainFromKg(grainKg, grainUnit.value), { decimals: 2 });
    setResult(waterInput, convertWaterFromLiters(waterLiters, waterUnit.value), { decimals: 0 });
  }

  // -------------------------
  // Reverse calculations: when user types into an output field
  // -------------------------
  function updateAllFromDaysAndDisplay(days) {
    // update time display (in selected time unit) with a reasonable number of decimals
    const timeValue = daysToTime(days, timeUnit.value);
    setResult(timeInput, timeValue, { decimals: 2 });
    // now update other fields
    calculateFromDays(days);
  }

  function calcFromAnimalInput() {
    if (programmaticWrite) return;
    const animals = parseNumber(animalInput.value);
    const days = animals / factors.animals;
    updateAllFromDaysAndDisplay(days);
  }

  function calcFromCO2Input() {
    if (programmaticWrite) return;
    const val = parseNumber(co2Input.value);
    const kg = convertCO2ToKg(val, co2Unit.value);
    const days = kg / factors.co2;
    updateAllFromDaysAndDisplay(days);
  }

  function calcFromForestsInput() {
    if (programmaticWrite) return;
    const val = parseNumber(forestsInput.value);
    const m2 = convertForestsToM2(val, forestsUnit.value);
    const days = m2 / factors.forests;
    updateAllFromDaysAndDisplay(days);
  }

  function calcFromGrainInput() {
    if (programmaticWrite) return;
    const val = parseNumber(grainInput.value);
    const kg = convertGrainToKg(val, grainUnit.value);
    const days = kg / factors.grain;
    updateAllFromDaysAndDisplay(days);
  }

  function calcFromWaterInput() {
    if (programmaticWrite) return;
    const val = parseNumber(waterInput.value);
    const liters = convertWaterToLiters(val, waterUnit.value);
    const days = liters / factors.water;
    updateAllFromDaysAndDisplay(days);
  }

  // -------------------------
  // Unit change handlers: convert current displayed value from previous unit -> new unit
  // but DO NOT recalculate days (keeps days stable)
  // -------------------------
  function handleUnitChange(inputEl, prevUnitKey, convertToBaseFn, convertFromBaseFn, selectEl) {
    const prevUnit = selectEl.dataset.prev || prevUnitKey;
    const newUnit = selectEl.value;
    // read displayed value (in previous unit)
    const raw = parseNumber(inputEl.value);
    // convert to base
    const base = convertToBaseFn(raw, prevUnit);
    // convert base to new unit
    const newVal = convertFromBaseFn(base, newUnit);
    // update shown value
    setResult(inputEl, newVal, inputEl === waterInput || inputEl === animalInput ? { decimals: 0 } : { decimals: 2 });
    // update prev marker
    selectEl.dataset.prev = newUnit;
  }

  // -------------------------
  // Event listeners
  // -------------------------
  // Time input or unit -> recalc everything
  timeInput.addEventListener("input", () => {
    if (programmaticWrite) return;
    const days = timeToDays(parseNumber(timeInput.value), timeUnit.value);
    calculateFromDays(days);
  });

  timeUnit.addEventListener("change", () => {
    // when user changes time unit, keep the numeric display the same *in new unit*? 
    // We'll interpret the current number as the value in the new unit, so recalc by converting timeInput as number in new unit.
    if (programmaticWrite) return;
    const days = timeToDays(parseNumber(timeInput.value), timeUnit.value);
    calculateFromDays(days);
  });

  // footprint inputs -> reverse calc
  animalInput.addEventListener("input", calcFromAnimalInput);
  co2Input.addEventListener("input", calcFromCO2Input);
  forestsInput.addEventListener("input", calcFromForestsInput);
  grainInput.addEventListener("input", calcFromGrainInput);
  waterInput.addEventListener("input", calcFromWaterInput);

  // unit selects -> convert the displayed number from old unit to new unit without changing days
  co2Unit.addEventListener("change", () => {
    handleUnitChange(co2Input, co2Unit.value, (v, unit) => convertCO2ToKg(v, unit), (kg, unit) => convertCO2FromKg(kg, unit), co2Unit);
  });
  forestsUnit.addEventListener("change", () => {
    handleUnitChange(forestsInput, forestsUnit.value, (v, unit) => convertForestsToM2(v, unit), (m2, unit) => convertForestsFromM2(m2, unit), forestsUnit);
  });
  grainUnit.addEventListener("change", () => {
    handleUnitChange(grainInput, grainUnit.value, (v, unit) => convertGrainToKg(v, unit), (kg, unit) => convertGrainFromKg(kg, unit), grainUnit);
  });
  waterUnit.addEventListener("change", () => {
    handleUnitChange(waterInput, waterUnit.value, (v, unit) => convertWaterToLiters(v, unit), (liters, unit) => convertWaterFromLiters(liters, unit), waterUnit);
  });

  // Also keep track of unit prev values if user toggles quickly (initialized earlier).
  // -------------------------
  // Initialize with a default run (if there is already a value)
  // -------------------------
  (function init() {
    // If Time input has value, use it; otherwise if any other field has value, prefer animal->time -> else default 0
    const initialTime = parseNumber(timeInput.value);
    if (initialTime) {
      const days = timeToDays(initialTime, timeUnit.value);
      calculateFromDays(days);
    } else if (parseNumber(animalInput.value)) {
      calcFromAnimalInput();
    } else if (parseNumber(co2Input.value)) {
      calcFromCO2Input();
    } else if (parseNumber(forestsInput.value)) {
      calcFromForestsInput();
    } else if (parseNumber(grainInput.value)) {
      calcFromGrainInput();
    } else if (parseNumber(waterInput.value)) {
      calcFromWaterInput();
    } else {
      // default zero
      calculateFromDays(0);
    }
  })();

  // expose functions for debugging (optional)
  // window._veganCalc = { calculateFromDays, calcFromCO2Input, calcFromGrainInput };
});