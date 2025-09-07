// Get input elements
const yearInput = document.getElementById("NumberOrRomanNumeralYear");
const monthInput = document.getElementById("NumberOrRomanNumeralMonth");
const dayInput = document.getElementById("NumberOrRomanNumeralDay");
const resultDiv = document.getElementById("resultdiv");

// Extended Roman numeral map (supports numbers up to 3,999,999)
const romanMap = [
  { value: 1000000, numeral: "M̄" },
  { value: 900000, numeral: "C̄M̄" },
  { value: 500000, numeral: "D̄" },
  { value: 400000, numeral: "C̄D̄" },
  { value: 100000, numeral: "C̄" },
  { value: 90000, numeral: "X̄C̄" },
  { value: 50000, numeral: "L̄" },
  { value: 40000, numeral: "X̄L̄" },
  { value: 10000, numeral: "X̄" },
  { value: 9000, numeral: "ĪX̄" },
  { value: 5000, numeral: "V̄" },
  { value: 4000, numeral: "ĪV̄" },
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
  { value: 1, numeral: "I" }
];

// Convert number to Roman numeral
function numberToRoman(num) {
  if (num <= 0 || num > 3999999) {
    showMessage("Number out of range. Enter a value between 1 and 3,999,999.", "error");
    return null;
  }
  let result = "";
  for (let { value, numeral } of romanMap) {
    while (num >= value) {
      result += numeral;
      num -= value;
    }
  }
  return result;
}

// Convert Roman numeral to number (supports overline)
function romanToNumber(roman) {
  const map = {
    "M̄": 1000000, "D̄": 500000, "C̄": 100000, "L̄": 50000, "X̄": 10000, "V̄": 5000,
    "M": 1000, "D": 500, "C": 100, "L": 50, "X": 10, "V": 5, "I": 1
  };

  let i = 0, num = 0;

  while (i < roman.length) {
    let twoChars = roman.substring(i, i + 2);
    if (map[twoChars]) {
      num += map[twoChars];
      i += 2;
    } else if (map[roman[i]]) {
      num += map[roman[i]];
      i++;
    } else {
      showMessage("Invalid Roman numeral entered.", "error");
      return null;
    }
  }
  if (num > 3999999) {
    showMessage("Roman numeral exceeds maximum value of 3,999,999.", "error");
    return null;
  }
  return num;
}

// Clean numeric input (remove commas and whitespace)
function cleanNumberInput(value) {
  return value.replace(/,/g, "").trim();
}

// Check if string is numeric
function isNumeric(value) {
  return /^\d+$/.test(value);
}

// Update results dynamically
function updateResult() {
  const yearValRaw = yearInput.value;
  const monthValRaw = monthInput.value;
  const dayValRaw = dayInput.value;

  const yearVal = cleanNumberInput(yearValRaw);
  const monthVal = cleanNumberInput(monthValRaw);
  const dayVal = cleanNumberInput(dayValRaw);

  if (!yearVal && !monthVal && !dayVal) {
    resultDiv.innerHTML = "";
    return;
  }

  let yearRoman = yearVal ? (isNumeric(yearVal) ? numberToRoman(parseInt(yearVal)) : romanToNumber(yearVal)) : "";
  let monthRoman = monthVal ? (isNumeric(monthVal) ? numberToRoman(parseInt(monthVal)) : romanToNumber(monthVal)) : "";
  let dayRoman = dayVal ? (isNumeric(dayVal) ? numberToRoman(parseInt(dayVal)) : romanToNumber(dayVal)) : "";

  if (yearRoman === null || monthRoman === null || dayRoman === null) {
    resultDiv.innerHTML = "";
    return;
  }

  let fullDate = `${yearVal|| "???"}/${monthVal || "???"}/${dayVal || "???"}`;
  let fullRoman = `${yearRoman || "???"}/${monthRoman || "???"}/${dayRoman || "???"}`;

  resultDiv.innerHTML = `
    <div>
      <h3>Result:</h3><br>
      ${fullDate} = ${fullRoman}
      <hr>
      <h3>Breakdown:</h3><br>
      Year: ${yearVal || "-"} = ${yearRoman || "-"}<br>
      Month: ${monthVal || "-"} = ${monthRoman || "-"}<br>
      Day: ${dayVal || "-"} = ${dayRoman || "-"}
    </div>
  `;
}

// Listen for input changes
[yearInput, monthInput, dayInput].forEach(input => {
  input.addEventListener("input", updateResult);
});

// Auto-calculate on page load if there's already a value
window.addEventListener("DOMContentLoaded", () => {
  if (yearInput.value.trim() !== "" || monthInput.value.trim() !== "" || dayInput.value.trim() !== "") {
    updateResult();
  }
});