// Get all elements
const totalInput = document.getElementById("total-classes");
const presentInput = document.getElementById("presentClasses");
const plannedInput = document.getElementById("plannedHolidays");
const remainingInput = document.getElementById("remainingClasses");
const requiredAttendanceInput = document.getElementById("requiredAttendanceOutput");
const resultDiv = document.querySelector(".resultdiv");

// Function to clean numbers (removes commas and spaces)
const cleanNumber = (value) => {
  if (!value) return 0;
  return parseFloat(value.toString().replace(/,/g, "").trim()) || 0;
};

// Main calculation function
function calculateAttendance() {
  // Get all values
  const totalClasses = cleanNumber(totalInput.value);
  const presentClasses = cleanNumber(presentInput.value);
  const plannedHolidays = cleanNumber(plannedInput.value);
  const remainingClasses = cleanNumber(remainingInput.value);
  const requiredPercentage = cleanNumber(requiredAttendanceInput.value);
  
  // If no total classes, don't calculate
  if (totalClasses <= 0 || presentClasses < 0 || presentClasses > totalClasses || requiredPercentage <= 0 || requiredPercentage > 100) {
    resultDiv.innerHTML = `<p id="error-txt">Please enter valid values.</p>`;
    return;
  }
  
  // Current attendance percentage
  const currentPercentage = (presentClasses / totalClasses) * 100;
  
  // Safe bunkable classes
  let safeBunks = Math.floor((100 * presentClasses - requiredPercentage * totalClasses) / requiredPercentage);
  if (safeBunks < 0) safeBunks = 0;
  
  // Classes needed to recover if attendance < required %
  let classesNeeded = 0;
  if (currentPercentage < requiredPercentage) {
    classesNeeded = Math.ceil(
      (requiredPercentage * totalClasses - 100 * presentClasses) /
      (100 - requiredPercentage)
    );
  }
  
  // Future attendance forecast after planned holidays
  const futureTotal = totalClasses + plannedHolidays;
  const futurePercentage = futureTotal > 0 ? (presentClasses / futureTotal) * 100 : 0;
  
  // Final attendance if all remaining classes are attended
  const projectedFinal = (presentClasses + remainingClasses) / (totalClasses + remainingClasses) * 100;
  
  // Build result output
  let resultHTML = `
    <p><strong>Current Attendance:</strong> ${presentClasses}/${totalClasses} 👉 ${currentPercentage.toFixed(2)}%</p>
    <p><strong>Required Attendance:</strong> ${requiredPercentage}%</p>
    <p><strong>Safe Bunkable Classes:</strong> ${safeBunks} </p>
  `;
  
  if (currentPercentage < requiredPercentage) {
    resultHTML += `<p><strong>Classes Needed to Recover:</strong> ${classesNeeded} </p>`;
  } else {
    resultHTML += `<p><strong>You’re Safe ✅</strong> You can bunk up to ${safeBunks} classes.</p>`;
  }
  
  resultHTML += `
    <p><strong>Future Attendance (after planned holidays):</strong> ${futurePercentage.toFixed(2)}%</p>
    <p><strong>Projected Attendance (if you attend all <span id="remainingClassesspan">${remainingClasses}</span> remaining classes):</strong> ${projectedFinal.toFixed(2)}%</p>
  `;
  
  // Display results
  resultDiv.innerHTML = resultHTML;
}

// Auto-calculate on input
document.querySelectorAll("#total-classes, #presentClasses, #plannedHolidays, #remainingClasses, #requiredAttendanceOutput")
  .forEach(input => {
    input.addEventListener("input", calculateAttendance);
  });

// Calculate once on page load
window.addEventListener("DOMContentLoaded", calculateAttendance);