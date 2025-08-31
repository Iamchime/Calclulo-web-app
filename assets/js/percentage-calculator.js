function calculateResults() {
  calculatePercentageOf();
  calculateWhatPercentOf();
  calculateIncreaseOrDecrease();
}

// Utility: remove commas before parsing
function parseNumber(value) {
  if (!value) return NaN;
  return parseFloat(value.toString().replace(/,/g, ''));
}

// Section 1: What is X% of Y
function calculatePercentageOf() {
  const percent = parseNumber(document.getElementById("percentof").value);
  const num = parseNumber(document.getElementById("numb").value);
  const resultField = document.getElementById("percentageSecOneResult");
  
  if (isNaN(percent) || isNaN(num)) {
    resultField.value = '';
    return;
  }
  
  const result = (percent / 100) * num;
  resultField.value = result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
}

// Section 2: X is what percent of Y
function calculateWhatPercentOf() {
  const part = parseNumber(document.getElementById("numberiswhatpercentof").value);
  const whole = parseNumber(document.getElementById("numbtwo").value);
  const resultField = document.getElementById("percentageSecTwoResult");
  
  if (isNaN(part) || isNaN(whole) || whole === 0) {
    resultField.value = '';
    return;
  }
  
  const result = (part / whole) * 100;
  resultField.value = result.toFixed(2) + '%';
}

// Section 3: Percentage increase or decrease
function calculateIncreaseOrDecrease() {
  const from = parseNumber(document.getElementById("increaseorDecreaseInputOne").value);
  const to = parseNumber(document.getElementById("increaseorDecreaseInputTwo").value);
  const resultField = document.getElementById("percentageSecThreeResult");
  
  if (isNaN(from) || isNaN(to) || from === 0) {
    resultField.value = '';
    return;
  }
  
  const change = ((to - from) / Math.abs(from)) * 100;
  const direction = change > 0 ? "increase" : change < 0 ? "decrease" : "no change";
  resultField.value = `${Math.abs(change).toFixed(2)}% ${direction}`;
}

// Auto-calculate listeners
document.querySelectorAll("#percentof, #numb").forEach(input =>
  input.addEventListener("input", calculatePercentageOf)
);

document.querySelectorAll("#numberiswhatpercentof, #numbtwo").forEach(input =>
  input.addEventListener("input", calculateWhatPercentOf)
);

document.querySelectorAll("#increaseorDecreaseInputOne, #increaseorDecreaseInputTwo").forEach(input =>
  input.addEventListener("input", calculateIncreaseOrDecrease)
);