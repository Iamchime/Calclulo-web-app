// Utility function to clean numbers with commas
function cleanNumber(value) {
  return parseFloat(value.replace(/,/g, '')) || 0;
}

// Conversion factors to meters
const lengthToMeters = {
  'centimetres': 0.01,
  'meters': 1,
  'inches': 0.0254,
  'yards': 0.9144
};

// Conversion factors from square meters to target area unit
const areaFromMeters = {
  'square-centimetres': 10000, // 1 m² = 10,000 cm²
  'square-meters': 1,
  'square-inches': 1550.0031, // 1 m² = 1550.0031 in²
  'square-feets': 10.7639, // 1 m² = 10.7639 ft²
  'square-yards': 1.19599 // 1 m² = 1.19599 yd²
};

// Conversion from unit price to per m²
const priceUnitToMeters = {
  'square-metres': 1,
  'square-foot': 0.092903, // 1 ft² = 0.092903 m²
  'square-yard': 0.836127 // 1 yd² = 0.836127 m²
};

function calculateAreaAndCost() {
  // Read inputs
  let width = cleanNumber(document.getElementById('width').value);
  let length = cleanNumber(document.getElementById('length').value);
  let quantity = cleanNumber(document.getElementById('quantity').value) || 1;
  let widthUnit = document.getElementById('widthUnit').value;
  let lengthUnit = document.getElementById('lengthUnit').value;
  let areaUnit = document.getElementById('AreaUnit').value;
  let unitPrice = cleanNumber(document.getElementById('UnitPrice').value);
  let unitPriceUnit = document.getElementById('unitPriceUnit').value;
  
  // Convert width and length to meters
  let widthMeters = width * (lengthToMeters[widthUnit] || 1);
  let lengthMeters = length * (lengthToMeters[lengthUnit] || 1);
  
  // Area in m²
  let areaMeters = widthMeters * lengthMeters * quantity;
  
  // Convert area to selected area unit
  let convertedArea = areaMeters * (areaFromMeters[areaUnit] || 1);
  document.getElementById('Area').value = convertedArea.toLocaleString(undefined, { maximumFractionDigits: 2 });
  
  // Calculate total cost
  if (unitPrice > 0) {
    // Convert unit price to per m²
    let pricePerM2 = unitPrice / priceUnitToMeters[unitPriceUnit];
    let totalCost = areaMeters * pricePerM2;
    document.getElementById('total-cost').value = totalCost.toLocaleString(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});
  } else {
    document.getElementById('total-cost').value = '';
  }
}

// Attach event listeners
document.querySelectorAll('#width, #length, #quantity, #widthUnit, #lengthUnit, #AreaUnit, #UnitPrice, #unitPriceUnit')
  .forEach(el => el.addEventListener('input', calculateAreaAndCost));