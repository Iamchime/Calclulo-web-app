(function () {
  // Elements
  const primerInput = document.getElementById("PrimerMeltingTemperature");
  const primerUnit = document.getElementById("PrimerMeltingtemperatureUnit");

  const targetInput = document.getElementById("TargetMeltingTemperature");
  const targetUnit = document.getElementById("TargetMeltingTemperatureUnit");

  const annealInput = document.getElementById("Annealingtemperature");
  const annealUnit = document.getElementById("AnnealingtemperatureUnit");

  // Prevent handlers from reacting to programmatic changes
  let programmatic = false;

  // --- Utilities ---
  function parseNumber(str) {
    if (str === null || str === undefined) return null;
    const s = String(str).replace(/[,\s]/g, "").trim();
    if (s === "" || /[A-Za-z]/.test(s)) return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  }

  function formatNumber(num) {
    if (num === null || num === undefined || Number.isNaN(num)) return "";
    const rounded = Math.round((Number(num) + Number.EPSILON) * 100) / 100;
    if (Number.isInteger(rounded)) return rounded.toLocaleString();
    return rounded.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }

  function toCelsius(value, unit) {
    if (value === null) return null;
    switch (unit) {
      case "Fahrenheit": return (value - 32) * 5 / 9;
      case "kelvins": return value - 273.15;
      default: return value;
    }
  }

  function fromCelsius(valueC, unit) {
    if (valueC === null) return null;
    switch (unit) {
      case "Fahrenheit": return (valueC * 9 / 5) + 32;
      case "kelvins": return valueC + 273.15;
      default: return valueC;
    }
  }

  function safeSetValue(inputEl, numericValue) {
    programmatic = true;
    inputEl.value = numericValue === null ? "" : formatNumber(numericValue);
    programmatic = false;
  }

  // Convert visible numeric content when the unit select changes
  function convertFieldValue(inputEl, prevUnit, newUnit) {
    const n = parseNumber(inputEl.value);
    if (n === null) return;
    const asC = toCelsius(n, prevUnit);
    const converted = fromCelsius(asC, newUnit);
    safeSetValue(inputEl, converted);
  }

  // --- Main calculation ---
  // Ta = 0.3 * Tm_primer + 0.7 * Tm_target - 14.9  (perform in Celsius)
  function calculateAnnealingTemperature() {
    const primerRaw = parseNumber(primerInput.value);
    const targetRaw = parseNumber(targetInput.value);

    if (primerRaw === null || targetRaw === null) {
      annealInput.value = "";
      return;
    }

    const primerC = toCelsius(primerRaw, primerUnit.value);
    const targetC = toCelsius(targetRaw, targetUnit.value);

    if (primerC === null || targetC === null) {
      annealInput.value = "";
      return;
    }

    const annealC = 0.3 * primerC + 0.7 * targetC - 14.9;
    const annealOut = fromCelsius(annealC, annealUnit.value);

    // Set displayed annealing temperature (formatted)
    programmatic = true;
    annealInput.value = formatNumber(annealOut);
    programmatic = false;
  }

  // --- Backsolve when Annealing is edited ---
  // If primer exists -> solve for target
  // Else if target exists -> solve for primer
  function backsolveFromAnneal() {
    const annealRaw = parseNumber(annealInput.value);
    if (annealRaw === null) return; // nothing to backsolve

    // anneal in Celsius
    const annealC = toCelsius(annealRaw, annealUnit.value);
    if (annealC === null || Number.isNaN(annealC)) return;

    const primerRaw = parseNumber(primerInput.value);
    const targetRaw = parseNumber(targetInput.value);

    // Priority: update target if primer present; else update primer if target present.
    programmatic = true;
    if (primerRaw !== null) {
      // Solve for target: Tm_target = (Ta + 14.9 - 0.3*Tm_primer) / 0.7
      const primerC = toCelsius(primerRaw, primerUnit.value);
      const targetC = (annealC + 14.9 - 0.3 * primerC) / 0.7;
      const targetOut = fromCelsius(targetC, targetUnit.value);
      targetInput.value = formatNumber(targetOut);
    } else if (targetRaw !== null) {
      // Solve for primer: Tm_primer = (Ta + 14.9 - 0.7*Tm_target) / 0.3
      const targetC = toCelsius(targetRaw, targetUnit.value);
      const primerC = (annealC + 14.9 - 0.7 * targetC) / 0.3;
      const primerOut = fromCelsius(primerC, primerUnit.value);
      primerInput.value = formatNumber(primerOut);
    }
    programmatic = false;

    // Recalculate to normalize and ensure values are consistent
    calculateAnnealingTemperature();
  }

  // --- Wiring: track previous units for conversions ---
  [primerUnit, targetUnit, annealUnit].forEach(sel => {
    sel.dataset.prevUnit = sel.value;
    sel.addEventListener("focus", () => { sel.dataset.prevUnit = sel.value; });
    sel.addEventListener("pointerdown", () => { sel.dataset.prevUnit = sel.value; });
  });

  primerUnit.addEventListener("change", () => {
    const prev = primerUnit.dataset.prevUnit || primerUnit.value;
    programmatic = true;
    convertFieldValue(primerInput, prev, primerUnit.value);
    programmatic = false;
    primerUnit.dataset.prevUnit = primerUnit.value;
    calculateAnnealingTemperature();
  });

  targetUnit.addEventListener("change", () => {
    const prev = targetUnit.dataset.prevUnit || targetUnit.value;
    programmatic = true;
    convertFieldValue(targetInput, prev, targetUnit.value);
    programmatic = false;
    targetUnit.dataset.prevUnit = targetUnit.value;
    calculateAnnealingTemperature();
  });

  annealUnit.addEventListener("change", () => {
    const prev = annealUnit.dataset.prevUnit || annealUnit.value;
    // convert display number in anneal field to new unit
    programmatic = true;
    convertFieldValue(annealInput, prev, annealUnit.value);
    programmatic = false;
    annealUnit.dataset.prevUnit = annealUnit.value;
    // backsolve so converted annealing value updates the other fields
    backsolveFromAnneal();
  });

  // Input listeners (ignore events when programmatic)
  ["input", "change", "blur"].forEach(ev => {
    primerInput.addEventListener(ev, () => {
      if (programmatic) return;
      calculateAnnealingTemperature();
    });
    targetInput.addEventListener(ev, () => {
      if (programmatic) return;
      calculateAnnealingTemperature();
    });
  });

  // Annealing input edits -> backsolve
  ["input", "change"].forEach(ev => {
    annealInput.addEventListener(ev, () => {
      if (programmatic) return;
      backsolveFromAnneal();
    });
  });

  // Normalize annealing on blur
  annealInput.addEventListener("blur", () => {
    const n = parseNumber(annealInput.value);
    if (n === null) {
      annealInput.value = "";
    } else {
      // format but don't trigger backsolve (it's programmatic)
      programmatic = true;
      annealInput.value = formatNumber(n);
      programmatic = false;
    }
  });

  document.addEventListener("DOMContentLoaded", calculateAnnealingTemperature);
  calculateAnnealingTemperature();
})();