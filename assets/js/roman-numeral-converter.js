const inputField = document.getElementById("NumberOrRomanNumeral");
const resultDiv = document.getElementById("resultdiv");

// Roman numeral mappings including overlines (keep the same order, highest first)
const romanMap = [
  { value: 1000000, numeral: "M̅" },
  { value: 900000, numeral: "C̅M̅" },
  { value: 500000, numeral: "D̅" },
  { value: 400000, numeral: "C̅D̅" },
  { value: 100000, numeral: "C̅" },
  { value: 90000, numeral: "X̅C̅" },
  { value: 50000, numeral: "L̅" },
  { value: 40000, numeral: "X̅L̅" },
  { value: 10000, numeral: "X̅" },
  { value: 9000, numeral: "I̅X̅" },
  { value: 5000, numeral: "V̅" },
  { value: 4000, numeral: "I̅V̅" },
  { value: 1000, numeral: "M" },
  { value: 900, numeral: "CM" },
  { value: 500, numeral: "D" },
  { value: 400, numeral: "CD" },
  { value: 100, numeral: "C" },
  { value: 90, numeral: "XC" },
  { value: 50, numeral: "L" },
  { value: 40, numeral: "XL" },
  { value: 10, numeral: "X" },
  { value: 9, numeral: "IX" },
  { value: 5, numeral: "V" },
  { value: 4, numeral: "IV" },
  { value: 1, numeral: "I" },
];

// Utility: normalize strings for comparisons (helps with combining overline characters)
function norm(s) {
  return (s || "").normalize("NFC");
}

// Convert number → Roman numeral
function numberToRoman(num) {
  if (!Number.isInteger(num) || num < 1 || num > 3999999) {
    showMessage("Please enter a number between 1 and 3,999,999.", "error");
    return null;
  }
  
  let result = "";
  for (let { value, numeral } of romanMap) {
    let count = Math.floor(num / value);
    if (count > 0) {
      result += numeral.repeat(count);
      num -= value * count;
    }
  }
  return norm(result);
}

// Convert Roman numeral → number
function romanToNumber(romanInput) {
  if (!romanInput || typeof romanInput !== "string") {
    showMessage("Please enter a Roman numeral.", "error");
    return null;
  }
  
  let roman = norm(romanInput).toUpperCase().replace(/\s+/g, "");
  let index = 0;
  let result = 0;
  
  while (index < roman.length) {
    let matched = false;
    
    for (let { value, numeral } of romanMap) {
      const n = norm(numeral).toUpperCase();
      if (roman.startsWith(n, index)) {
        result += value;
        index += n.length;
        matched = true;
        break;
      }
    }
    
    if (!matched) {
      showMessage("Hmm… that doesn't seem like a valid Roman numeral.", "error");
      return null;
    }
  }
  
  const checkRoman = numberToRoman(result) || "";
  if (checkRoman !== roman) {
    showMessage("Hmm… that doesn't seem like a valid Roman numeral.", "error");
    return null;
  }
  
  return result;
}

// Display results only
function displayResult(input) {
  resultDiv.innerHTML = ""; // Clear previous results
  if (!input) return;
  
  const trimmed = String(input).trim();
  const cleanedNumberStr = trimmed.replace(/[,\s]+/g, "");
  
  // If input is a number
  if (/^\d+$/.test(cleanedNumberStr)) {
    const num = parseInt(cleanedNumberStr, 10);
    const roman = numberToRoman(num);
    if (!roman) return;
    
    resultDiv.innerHTML = `
      <div>
        <h3 style="margin-bottom:8px;">Conversion Result</h3>
        <p><strong>Number:</strong> ${num.toLocaleString()}</p>
        <p><strong>Roman Numeral:</strong> ${roman}</p>
      </div>
    `;
    return;
  }
  
  // Otherwise treat as Roman input
  const number = romanToNumber(trimmed);
  if (number === null) return;
  
  resultDiv.innerHTML = `
    <div>
      <h3 style="margin-bottom:8px;">Conversion Result</h3>
      <p><strong>Roman Numeral:</strong> ${norm(trimmed).toUpperCase()}</p>
      <p><strong>Number:</strong> ${number.toLocaleString()}</p>
    </div>
  `;
}

// Auto-calculate on input
inputField.addEventListener("input", (e) => {
  const value = e.target.value;
  displayResult(value);
});

// Auto-calculate on page load if there's already a value
window.addEventListener("DOMContentLoaded", () => {
  if (inputField.value.trim() !== "") {
    displayResult(inputField.value);
  }
});