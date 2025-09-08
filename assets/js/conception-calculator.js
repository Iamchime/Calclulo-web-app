const dueDateInput = document.getElementById("duedate");
const lastPeriodInput = document.getElementById("FirstDayofYourLastPeriod");
const cycleInput = document.getElementById("averagecycleduration");
const conceptionDateInput = document.getElementById("conceptiondate");

let activeInput = null;

// Utility to parse numbers safely (handles commas)
const parseNumber = (value, fallback = 28) => {
  const num = parseFloat(String(value).replace(/,/g, ""));
  return isNaN(num) ? fallback : num;
};

// Utility to add days to a date
const addDays = (date, days) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

// Utility to format date YYYY-MM-DD
const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};

// Main calculation function
function calculateFrom(source) {
  const cycleLength = parseNumber(cycleInput.value, 28);
  
  // When user types manually, remove `.result` class from that field
  if (source) {
    source.classList.remove("result");
    activeInput = source;
  }
  
  // First day of last period selected
  if (source === lastPeriodInput) {
    if (lastPeriodInput.value) {
      const lmpDate = new Date(lastPeriodInput.value);
      const dueDate = addDays(lmpDate, cycleLength + 252 - cycleLength); // Naegele's rule = LMP + 280 days
      const conceptionDate = addDays(lmpDate, cycleLength - 14); // Conception ≈ LMP + (cycleLength - 14)
      
      dueDateInput.value = formatDate(dueDate);
      conceptionDateInput.value = formatDate(conceptionDate);
      
      dueDateInput.classList.add("result");
      conceptionDateInput.classList.add("result");
    }
  }
  
  // Due date selected
  else if (source === dueDateInput) {
    if (dueDateInput.value) {
      const dueDate = new Date(dueDateInput.value);
      const lmpDate = addDays(dueDate, -280); // LMP ≈ Due date - 280 days
      const conceptionDate = addDays(lmpDate, cycleLength - 14);
      
      lastPeriodInput.value = formatDate(lmpDate);
      conceptionDateInput.value = formatDate(conceptionDate);
      
      lastPeriodInput.classList.add("result");
      conceptionDateInput.classList.add("result");
    }
  }
  
  // Conception date selected
  else if (source === conceptionDateInput) {
    if (conceptionDateInput.value) {
      const conceptionDate = new Date(conceptionDateInput.value);
      const lmpDate = addDays(conceptionDate, -(cycleLength - 14)); // LMP ≈ Conception - (cycleLength - 14)
      const dueDate = addDays(lmpDate, 280);
      
      lastPeriodInput.value = formatDate(lmpDate);
      dueDateInput.value = formatDate(dueDate);
      
      lastPeriodInput.classList.add("result");
      dueDateInput.classList.add("result");
    }
  }
  
  // Average cycle duration updated manually
  else if (source === cycleInput) {
    if (lastPeriodInput.value) {
      calculateFrom(lastPeriodInput);
    } else if (dueDateInput.value) {
      calculateFrom(dueDateInput);
    } else if (conceptionDateInput.value) {
      calculateFrom(conceptionDateInput);
    }
  }
  
  activeInput = null;
}

// Add listeners
[lastPeriodInput, dueDateInput, conceptionDateInput, cycleInput].forEach((input) => {
  input.addEventListener("input", () => calculateFrom(input));
  input.addEventListener("change", () => calculateFrom(input));
});

// Auto-calculate on load if values exist
window.addEventListener("DOMContentLoaded", () => {
  if (lastPeriodInput.value) {
    calculateFrom(lastPeriodInput);
  } else if (dueDateInput.value) {
    calculateFrom(dueDateInput);
  } else if (conceptionDateInput.value) {
    calculateFrom(conceptionDateInput);
  }
});