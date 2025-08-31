// Set today's date as the default
function setTodayAsDefaultDate() {
  const today = new Date().toISOString().split("T")[0];
  const lastPeriodInput = document.getElementById("lastPeriod");
  lastPeriodInput.value = today;
}

// Main calculation function
function calculateResults() {
  const cycleDuration = parseInt(document.getElementById("cycleDuration").value, 10);
  const lastPeriodValue = document.getElementById("lastPeriod").value;
  const lastPeriod = new Date(lastPeriodValue);
  
  // Validation check
  if (isNaN(cycleDuration) || isNaN(lastPeriod.getTime())) {
    return; // Do nothing if inputs are invalid
  }
  
  // Helper function to add days
  function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split("T")[0];
  }
  
  // Auto-calculate for 3 cycles
  for (let i = 0; i < 3; i++) {
    const offset = i * cycleDuration;
    const ovulationDay = addDays(lastPeriod, offset + (cycleDuration - 14));
    const fertileStart = addDays(lastPeriod, offset + (cycleDuration - 14) - 5);
    const fertileEnd = addDays(lastPeriod, offset + (cycleDuration - 14) + 1);
    const dueDate = addDays(new Date(ovulationDay), 266);
    
    // Update results
    document.getElementById(`ovulationDay${["One", "Two", "Three"][i]}`).value = ovulationDay;
    document.getElementById(`firstDayofFertilityWindow${["One", "Two", "Three"][i]}`).value = fertileStart;
    document.getElementById(`lastDayofFertilityWindow${["One", "Two", "Three"][i]}`).value = fertileEnd;
    document.getElementById(`duedate${["One", "Two", "Three"][i]}`).value = dueDate;
  }
}

// Attach auto-calculation on input change
document.addEventListener("DOMContentLoaded", function() {
  setTodayAsDefaultDate();
  
  const cycleInput = document.getElementById("cycleDuration");
  const lastPeriodInput = document.getElementById("lastPeriod");
  
  // Trigger calculation on input change
  cycleInput.addEventListener("input", calculateResults);
  lastPeriodInput.addEventListener("input", calculateResults);
  
  // First calculation on load
  calculateResults();
});