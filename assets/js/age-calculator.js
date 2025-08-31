document.addEventListener("DOMContentLoaded", function() {
  const dayInput = document.getElementById("day");
  const monthInput = document.getElementById("month");
  const yearInput = document.getElementById("year");
  const resultContainer = document.getElementById("ageResult");
  const clearBtn = document.querySelector(".clear-inputs-btn");
  
  // Format numbers for display
  function formatNumber(num) {
    return num.toLocaleString();
  }
  
  function calculateAge(day, month, year) {
    const birthDate = new Date(year, month - 1, day);
    const now = new Date();
    
    if (birthDate > now) return null;
    
    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    let days = now.getDate() - birthDate.getDate();
    
    if (days < 0) {
      months -= 1;
      const lastMonthDays = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      days += lastMonthDays;
    }
    
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    
    const totalMonths = years * 12 + months;
    const totalDays = Math.floor((now - birthDate) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;
    
    return { years, months, days, totalMonths, totalDays, totalWeeks, totalHours, totalMinutes, totalSeconds };
  }
  
  function autoCalculate() {
    resultContainer.innerHTML = "";
    
    const dayVal = dayInput.value.replace(/,/g, "");
    const monthVal = monthInput.value.replace(/,/g, "");
    const yearVal = yearInput.value.replace(/,/g, "");
    
    const day = parseInt(dayVal, 10);
    const month = parseInt(monthVal, 10);
    const year = parseInt(yearVal, 10);
    
    [dayInput, monthInput, yearInput].forEach(clearError);
    
    let valid = true;
    
    // Gentle validation
    if (dayVal && (isNaN(day) || day < 1 || day > 31)) {
      //showError("");
      showMessage("Enter a valid day (1-31)","error")
      valid = false;
    }
    if (monthVal && (isNaN(month) || month < 1 || month > 12)) {
      showError("Enter a valid month (1-12)");
      valid = false;
    }
    if (yearVal && isNaN(year)) {
      showError("Enter a valid year");
      valid = false;
    }
    
    if (!valid || !dayVal || !monthVal || !yearVal) return;
    
    // Check for future date
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    if (birthDate > today) {
      showError("Birth date is in the future");
      return;
    }
    
    const ageData = calculateAge(day, month, year);
    
    // Display formatted results
    resultContainer.innerHTML = `
      Age: ${formatNumber(ageData.years)} years ${formatNumber(ageData.months)} months ${formatNumber(ageData.days)} days <br>
      or ${formatNumber(ageData.totalMonths)} months ${formatNumber(ageData.days)} days <br>
      or ${formatNumber(ageData.totalWeeks)} weeks ${formatNumber(ageData.totalDays % 7)} days <br>
      or ${formatNumber(ageData.totalDays)} days <br>
      or ${formatNumber(ageData.totalHours)} hours <br>
      or ${formatNumber(ageData.totalMinutes)} minutes <br>
      or ${formatNumber(ageData.totalSeconds)} seconds
    `;
  }
  
  [dayInput, monthInput, yearInput].forEach(input => input.addEventListener("input", autoCalculate));
  
});