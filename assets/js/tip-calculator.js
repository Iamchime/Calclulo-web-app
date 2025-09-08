// Get all input elements
const billInput = document.getElementById("bill-price");
const tipPercentInput = document.getElementById("tip-percent-tip-calculator");
const tipAmountInput = document.getElementById("tipAmount");
const totalBillInput = document.getElementById("total-tip-calculator");

const numberOfPeopleInput = document.getElementById("number-of-people");
const tipPerPersonInput = document.getElementById("tip-per-person");
const totalPerPersonInput = document.getElementById("total-per-person");

// Attach event listeners to all relevant inputs
document.querySelectorAll("#bill-price, #tip-percent-tip-calculator, #number-of-people")
  .forEach(input => {
    input.addEventListener("input", calculateTip);
    input.addEventListener("keyup", calculateTip);
  });

function parseNumber(value) {
  // Remove commas and extra spaces, then convert to float
  if (!value) return 0;
  return parseFloat(value.toString().replace(/,/g, "")) || 0;
}

function formatNumber(num) {
  // Format number with commas and max 2 decimals
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function calculateTip() {
  // Get values from inputs
  const bill = parseNumber(billInput.value);
  const tipPercent = parseNumber(tipPercentInput.value);
  const numberOfPeople = parseNumber(numberOfPeopleInput.value);
  
  // If no bill or invalid inputs, clear outputs
  if (bill <= 0 || tipPercent < 0) {
    tipAmountInput.value = "";
    totalBillInput.value = "";
    tipPerPersonInput.value = "";
    totalPerPersonInput.value = "";
    return;
  }
  
  // Calculate tip amount & total bill
  const tipAmount = (bill * tipPercent) / 100;
  const totalBill = bill + tipAmount;
  
  // Update tip amount & total bill
  tipAmountInput.value = formatNumber(tipAmount);
  totalBillInput.value = formatNumber(totalBill);
  
  // If splitting bill between people
  if (numberOfPeople > 0) {
    const tipPerPerson = tipAmount / numberOfPeople;
    const totalPerPerson = totalBill / numberOfPeople;
    
    tipPerPersonInput.value = formatNumber(tipPerPerson);
    totalPerPersonInput.value = formatNumber(totalPerPerson);
  } else {
    // Clear per-person fields if empty or invalid
    tipPerPersonInput.value = "";
    totalPerPersonInput.value = "";
  }
}

// Auto-run when the page loads if values are already filled
window.addEventListener("DOMContentLoaded", calculateTip);