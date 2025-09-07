const maxInputs = 50;
const container = document.getElementById('calculator');
const meanResultDiv = container.querySelector('.mean-result');
const typeOfMeanSelect = document.getElementById('typeOfMean');

function getAllNumberInputs() {
  return Array.from(container.querySelectorAll('input.value-input'));
}

function addInput() {
  const inputs = getAllNumberInputs();
  if (inputs.length >= maxInputs) return;
  
  const newIndex = inputs.length + 1;
  const inputGroup = document.createElement('div');
  inputGroup.classList.add('input-group');
  
  const label = document.createElement('label');
  label.textContent = `#${newIndex}`;
  
  const input = document.createElement('input');
  input.type = 'number';
  input.classList.add('value-input');
  input.id = `value${newIndex}`;
  
  inputGroup.appendChild(label);
  inputGroup.appendChild(input);
  
  const typeMeanGroup = container.querySelector('select#typeOfMean').parentElement;
  container.insertBefore(inputGroup, typeMeanGroup);
  
  input.addEventListener('input', onInputChange);
}

function onInputChange(e) {
  const inputs = getAllNumberInputs();
  const lastInput = inputs[inputs.length - 1];
  
  if (e.target === lastInput && e.target.value.trim() !== '') {
    addInput();
  }
  calculateResults();
}

function calculateResults() {
  clearError();
  
  const inputs = getAllNumberInputs();
  
  const numbers = inputs
    .map(i => parseFloat(i.value))
    .filter(n => !isNaN(n));
  
  if (numbers.length === 0) {
    meanResultDiv.innerHTML = '';
    showError('Please enter at least one number.');
    return;
  }
  
  const type = typeOfMeanSelect.value;
  const n = numbers.length;
  
  meanResultDiv.innerHTML = '';
  
  // Create and append the label with count
  const countLabel = document.createElement('label');
  countLabel.textContent = `For the ${n} number(s) you entered:`;
  meanResultDiv.appendChild(countLabel);
  
  // Create a container div for mean results
  const div = document.createElement('div');
  
  let errors = [];
  
  if (type === 'Arithmetic' || type === 'All') {
    const arithmeticMean = numbers.reduce((a, b) => a + b, 0) / n;
    const p = document.createElement('p');
    p.innerHTML = `The arithmetic mean is <strong>${arithmeticMean.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>.`;
    div.appendChild(p);
  }
  
  if (type === 'Geometric' || type === 'All') {
    if (numbers.some(num => num <= 0)) {
      errors.push('Geometric mean requires all numbers to be positive.');
    } else {
      const product = numbers.reduce((a, b) => a * b, 1);
      const geometricMean = Math.pow(product, 1 / n);
      const p = document.createElement('p');
      p.innerHTML = `The geometric mean is <strong>${geometricMean.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>.`;
      div.appendChild(p);
    }
  }
  
  if (type === 'Harmonic' || type === 'All') {
    if (numbers.some(num => num <= 0)) {
      errors.push('Harmonic mean requires all numbers to be positive and non-zero.');
    } else {
      const harmonicMean = n / numbers.reduce((acc, num) => acc + 1 / num, 0);
      const p = document.createElement('p');
      p.innerHTML = `The harmonic mean is <strong>${harmonicMean.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>.`;
      div.appendChild(p);
    }
  }
  
  meanResultDiv.appendChild(div);
  
  if (errors.length > 0) {
    showError(errors.join(' '));
  } else {
    clearError();
  }
}

function resetFields() {
  const inputs = getAllNumberInputs();
  for (let i = inputs.length - 1; i >= 4; i--) {
    inputs[i].parentElement.remove();
  }
  for (let i = 0; i < 4; i++) {
    inputs[i].value = '';
  }
  meanResultDiv.innerHTML = '';
  clearError();
}

function init() {
  const inputs = getAllNumberInputs();
  inputs.forEach(input => input.addEventListener('input', onInputChange));
  typeOfMeanSelect.addEventListener('change', calculateResults);
}

init();

window.addEventListener("load", () => {
  calculateResults();
});