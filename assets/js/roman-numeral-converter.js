const inputField = document.getElementById("NumberOrRomanNumeral");
const resultDiv = document.getElementById("resultdiv");

// Roman numeral mappings including overlines
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

// Convert number → Roman numeral
function numberToRoman(num) {
  if (num < 1 || num > 3999999) {
    showMessage("Please enter a number between 1 and 3,999,999.", "error");
    return null;
  }
  
  let result = "";
  let steps = [];
  
  romanMap.forEach(({ value, numeral }) => {
    let count = Math.floor(num / value);
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        result += numeral;
        steps.push(`${numeral} = ${value}`);
      }
      num -= value * count;
    }
  });
  
  return { roman: result, steps };
}

// Convert Roman numeral → number
function romanToNumber(roman) {
  roman = roman.toUpperCase();
  let index = 0;
  let result = 0;
  let steps = [];
  
  for (let { value, numeral } of romanMap) {
    while (roman.startsWith(numeral, index)) {
      result += value;
      steps.push(`${numeral} = ${value}`);
      index += numeral.length;
    }
  }
  
  // Validate correctness
  const checkRoman = numberToRoman(result)?.roman || "";
  if (checkRoman !== roman) {
    showMessage("Hmm… that doesn't seem like a valid Roman numeral.", "error");
    return null;
  }
  
  return { number: result, steps };
}

// Display detailed results
function displayResult(input) {
  resultDiv.innerHTML = ""; // Clear previous results
  if (!input) return;
  
  if (/^\d+$/.test(input)) {
    // Input is a number
    const num = parseInt(input);
    const conversion = numberToRoman(num);
    if (!conversion) return;
    
    const { roman, steps } = conversion;
    
    resultDiv.innerHTML = `
      <div>
        <h3 style="margin-bottom:8px;">Conversion Result</h3>
        <p><strong>Number:</strong> ${num}</p>
        <p><strong>Roman Numeral:</strong> ${roman}</p>
        <hr>
        <h4>How we got this result:</h4>
        <div style="font-family:monospace;background:#f9f9f9;padding:8px;border-radius:4px;">
          ${steps.map(step => `<div>➜ ${step}</div>`).join("")}
        </div>
        <p style="margin-top:10px;color:#666;font-size:0.9em;">
          Each Roman numeral above represents a specific value, and we add them together to reach the final result.
        </p>
      </div>
    `;
  } else {
    // Input is a Roman numeral
    const conversion = romanToNumber(input);
    if (!conversion) return;
    
    const { number, steps } = conversion;
    
    resultDiv.innerHTML = `
      <div>
        <h3 style="margin-bottom:8px;">Conversion Result:</h3>
        <p><strong>Roman Numeral:</strong> ${input.toUpperCase()}</p>
        <p><strong>Number:</strong> ${number}</p>
        <hr>
        <h4>How we got this result:</h4>
        <div style="background:#f9f9f9;padding:10px;border-radius:8px;">
          ${steps.map(step => `<div>➜ ${step}</div>`).join("")}
        </div>
        <p style="margin-top:10px;color:#666;font-size: .9em;">
          We added up the individual Roman numeral values step by step to get the final number.
        </p>
      </div>
    `;
  }
}

// Auto-calculate on input
inputField.addEventListener("input", (e) => {
  const value = e.target.value.trim();
  displayResult(value);
});