
function calculateResults() {
  const dosageInput = document.getElementById('dosage');
  const waterVolumeInput = document.getElementById('waterVolume');
  const sprayerCapacityInput = document.getElementById('sprayerCapacity');
  const resultInput = document.getElementById('volumeOfHerbicide');

  const dosageVal = dosageInput.value.trim();
  const waterVolumeVal = waterVolumeInput.value.trim();
  const sprayerCapacityVal = sprayerCapacityInput.value.trim();

  // Don't calculate or show errors until all inputs are filled
  if (!dosageVal || !waterVolumeVal || !sprayerCapacityVal) {
    resultInput.value = '';
    return;
  }

  const dosage = parseFloat(dosageVal);
  const waterVolume = parseFloat(waterVolumeVal);
  const sprayerCapacity = parseFloat(sprayerCapacityVal);

  let hasError = false;

  if (isNaN(dosage)) {
    showError("Please enter a valid dosage.");
    hasError = true;
  }

  if (isNaN(waterVolume) || waterVolume === 0) {
    showError("Water volume must be a number and not zero.");
    hasError = true;
  }

  if (isNaN(sprayerCapacity)) {
    showError("Please enter a valid sprayer capacity.");
    hasError = true;
  }

  if (hasError) {
    resultInput.value = '';
    return;
  }

  // Perform the calculation
  const dosagePerSquareMeter = (dosage * 1000) / 10000;
  const areaCovered = (sprayerCapacity * 100) / waterVolume;
  const totalHerbicide = dosagePerSquareMeter * areaCovered;

  resultInput.value = `${totalHerbicide.toLocaleString(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})}` ;
}

// Reset all inputs and errors



// Attach real-time input listener
['dosage', 'waterVolume', 'sprayerCapacity'].forEach(id => {
  const input = document.getElementById(id);
  input.addEventListener('input', () => {
    calculateResults();
    removeError(input);
  });
});