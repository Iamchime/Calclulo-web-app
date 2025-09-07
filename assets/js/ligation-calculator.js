document.addEventListener("DOMContentLoaded", () => {
  const inputs = [
    'vectorAmount', 'vectorLength', 'insertAmount', 'insertLength', 'molarRatio', 'reactionVolume'
  ];
  const selects = [
    'vectorAmountUnit', 'vectorLengthUnit', 'insertAmountUnit', 'insertLengthUnit', 'reactionVolumeUnit'
  ];

  // Trigger calculation on typing or unit change
  [...inputs, ...selects].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', calculateResults);
  });
});

function calculateResults() {
  // Get input values
  const vectorAmount = parseFloat(document.getElementById('vectorAmount').value);
  const vectorAmountUnit = document.getElementById('vectorAmountUnit').value;

  const vectorLength = parseFloat(document.getElementById('vectorLength').value);
  const vectorLengthUnit = document.getElementById('vectorLengthUnit').value;

  const insertAmount = parseFloat(document.getElementById('insertAmount').value);
  const insertAmountUnit = document.getElementById('insertAmountUnit').value;

  const insertLength = parseFloat(document.getElementById('insertLength').value);
  const insertLengthUnit = document.getElementById('insertLengthUnit').value;

  const molarRatio = parseFloat(document.getElementById('molarRatio').value);

  const reactionVolume = parseFloat(document.getElementById('reactionVolume').value);
  const reactionVolumeUnit = document.getElementById('reactionVolumeUnit').value;

  // Validate required inputs
  if (
    isNaN(vectorAmount) || vectorAmount <= 0 ||
    isNaN(vectorLength) || vectorLength <= 0 ||
    isNaN(insertLength) || insertLength <= 0 ||
    isNaN(molarRatio) || molarRatio <= 0 ||
    isNaN(reactionVolume) || reactionVolume <= 0
  ) {
    document.getElementById('volumeOfInsertDNAToAdd').value = '';
    return;
  }

  // Convert vector amount to ng
  const vectorAmountNg = convertMassToNg(vectorAmount, vectorAmountUnit);

  // Convert lengths to bp
  const vectorLengthBp = convertLengthToBp(vectorLength, vectorLengthUnit);
  const insertLengthBp = convertLengthToBp(insertLength, insertLengthUnit);

  // Convert reaction volume to µL
  const reactionVolumeUl = convertVolumeToUl(reactionVolume, reactionVolumeUnit);

  // Calculate moles of vector DNA
  const vectorMoles = (vectorAmountNg * 1e-9) / (vectorLengthBp * 650);

  // Desired insert moles = vector moles * molar ratio
  const insertMoles = vectorMoles * molarRatio;

  // Calculate insert mass (ng)
  const insertMassNg = insertMoles * insertLengthBp * 650 * 1e9;

  // Vector concentration (ng/µL)
  const vectorConc = vectorAmountNg / reactionVolumeUl;

  if (vectorConc === 0) {
    document.getElementById('volumeOfInsertDNAToAdd').value = '';
    return;
  }

  const insertVolumeUl = insertMassNg / vectorConc;

  // Display result
  document.getElementById('volumeOfInsertDNAToAdd').value = insertVolumeUl.toLocaleString(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});
}

// Mass units to nanograms conversion factors
function convertMassToNg(amount, unit) {
  switch (unit) {
    case 'fg': return amount * 1e-6;
    case 'pg': return amount * 1e-3;
    case 'ng': return amount;
    case 'µg': return amount * 1e3;
    case 'mg': return amount * 1e6;
    case 'g': return amount * 1e9;
    default: return amount;
  }
}

// Length units to base pairs conversion
function convertLengthToBp(length, unit) {
  switch (unit) {
    case 'bp': return length;
    case 'kb': return length * 1000;
    default: return length;
  }
}

// Volume units to microliters conversion
function convertVolumeToUl(volume, unit) {
  switch (unit) {
    case 'nL': return volume * 0.001;
    case 'µL': return volume;
    case 'mL': return volume * 1000;
    case 'L': return volume * 1e6;
    default: return volume;
  }
}

window.addEventListener("load", () => {
  calculateResults();
});