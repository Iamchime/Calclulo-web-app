document.addEventListener("DOMContentLoaded", function() {
  const personOneInput = document.getElementById("personOne");
  const personTwoInput = document.getElementById("personTwo");
  const resultContainer = document.getElementById("ageResult");
  const resetBtn = document.getElementById("reset-btn");
  
  // Format numbers properly
  function formatNumber(num) {
    return num.toLocaleString();
  }
  
  // Calculate age difference between two dates
  function calculateAgeDifference(date1, date2) {
    let older = new Date(date1);
    let younger = new Date(date2);
    
    if (older > younger) {
      [older, younger] = [younger, older];
    }
    
    let years = younger.getFullYear() - older.getFullYear();
    let months = younger.getMonth() - older.getMonth();
    let days = younger.getDate() - older.getDate();
    
    if (days < 0) {
      months--;
      const prevMonth = new Date(younger.getFullYear(), younger.getMonth(), 0);
      days += prevMonth.getDate();
    }
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    const diffMilliseconds = younger - older;
    const totalSeconds = Math.floor(diffMilliseconds / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(diffMilliseconds / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    
    return {
      years,
      months,
      days,
      totalWeeks,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds
    };
  }
  
  // Automatically calculate results when dates are selected
  function autoCalculate() {
    resultContainer.innerHTML = "";
    
    const date1 = personOneInput.value;
    const date2 = personTwoInput.value;
    
    clearError(personOneInput);
    clearError(personTwoInput);
    
    // If one date is missing, clear results but don't show error yet
    if (!date1 || !date2) return;
    
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const today = new Date();
    
    // Future date validations
    let valid = true;
    if (d1 > today) {
      showError("Birth date cannot be in the future");
      valid = false;
    }
    if (d2 > today) {
      showError("Birth date cannot be in the future");
      valid = false;
    }
    
    if (!valid) return;
    
    // Get results
    const result = calculateAgeDifference(date1, date2);
    
    resultContainer.innerHTML = `
      
      ${formatNumber(result.years)} years, ${formatNumber(result.months)} months, ${formatNumber(result.days)} days<br>
      or ${formatNumber(result.totalWeeks)} weeks<br>
      or ${formatNumber(result.totalDays)} days<br>
      or ${formatNumber(result.totalHours)} hours<br>
      or ${formatNumber(result.totalMinutes)} minutes<br>
      or ${formatNumber(result.totalSeconds)} seconds
    `;
  }
  
  // Trigger auto-calculation when inputs change
  [personOneInput, personTwoInput].forEach(input =>
    input.addEventListener("input", autoCalculate)
  );
  
  window.addEventListener("load", () => {
 autoCalculate();
});
});