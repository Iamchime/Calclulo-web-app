function calculateResults() {
  const priceUSD = parseFloat(document.getElementById("carPriceUSD").value.replace(/,/g, ''));
  const exchangeRate = parseFloat(document.getElementById("exchangeRate").value.replace(/,/g, ''));
  
  // Validate inputs
  if (isNaN(priceUSD) || isNaN(exchangeRate) || priceUSD <= 0 || exchangeRate <= 0) {
    clearResults();
    return;
  }
  
  // Vehicle value in NGN
  const vehicleValueNGN = priceUSD * exchangeRate;
  
  // Calculate customs charges
  const importDuty = vehicleValueNGN * 0.20;
  const levy = vehicleValueNGN * 0.15;
  const surcharge = importDuty * 0.07;
  const etl = vehicleValueNGN * 0.005;
  const vat = vehicleValueNGN * 0.075;
  
  // Totals
  const totalCustomsCharges = importDuty + levy + surcharge + etl + vat;
  const totalVehicleCost = vehicleValueNGN + totalCustomsCharges;
  
  // Display results
  document.getElementById("vehicleValueNGN").value = vehicleValueNGN.toLocaleString();
  document.getElementById("importDuty").value = importDuty.toLocaleString();
  document.getElementById("levy").value = levy.toLocaleString();
  document.getElementById("surcharge").value = surcharge.toLocaleString();
  document.getElementById("etl").value = etl.toLocaleString();
  document.getElementById("vat").value =  vat.toLocaleString();
  document.getElementById("totalCustomsCharges").value =  totalCustomsCharges.toLocaleString();
  document.getElementById("totalVehicleCost").value = totalVehicleCost.toLocaleString();
}

// Clear result fields when inputs are invalid
function clearResults() {
  const fields = [
    "vehicleValueNGN",
    "importDuty",
    "levy",
    "surcharge",
    "etl",
    "vat",
    "totalCustomsCharges",
    "totalVehicleCost"
  ];
  fields.forEach(id => {
    document.getElementById(id).value = "";
  });
}

// Attach automatic calculation on input
document.getElementById("carPriceUSD").addEventListener("input", calculateResults);
document.getElementById("exchangeRate").addEventListener("input", calculateResults);

window.addEventListener("load", () => {
  calculateResults();
});