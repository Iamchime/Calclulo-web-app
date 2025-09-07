document.addEventListener("DOMContentLoaded", function() {
  
  function getTotalSeconds(days, hours, minutes, seconds) {
    return (
      (parseInt(days) || 0) * 86400 +
      (parseInt(hours) || 0) * 3600 +
      (parseInt(minutes) || 0) * 60 +
      (parseInt(seconds) || 0)
    );
  }
  
  function convertSecondsToDHMS(totalSeconds) {
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { days, hours, minutes, seconds };
  }
  
  function formatWithCommas(number) {
    return number.toLocaleString(undefined, { maximumFractionDigits: 5 });
  }
  
  function formatCompactDHMS(resultSeconds) {
    const isNegative = resultSeconds < 0;
    const abs = convertSecondsToDHMS(Math.abs(resultSeconds));
    return `${isNegative ? "-" : ""}${abs.days}d ${abs.hours}h ${abs.minutes}m ${abs.seconds}s.`;
  }
  
  function calculateResults() {
    const day1 = document.getElementById("dayOne").value;
    const hour1 = document.getElementById("hourOne").value;
    const minute1 = document.getElementById("minuteOne").value;
    const second1 = document.getElementById("secondOne").value;
    
    const day2 = document.getElementById("dayTwo").value;
    const hour2 = document.getElementById("hourTwo").value;
    const minute2 = document.getElementById("minuteTwo").value;
    const second2 = document.getElementById("secondTwo").value;
    
    const operation = document.querySelector('input[name="operationType"]:checked').value;
    
    const total1 = getTotalSeconds(day1, hour1, minute1, second1);
    const total2 = getTotalSeconds(day2, hour2, minute2, second2);
    
    let resultSeconds = operation === "add" ? total1 + total2 : total1 - total2;
    
    const isNegative = resultSeconds < 0;
    const absResult = convertSecondsToDHMS(Math.abs(resultSeconds));
    
    // Update result fields instantly
    document.getElementById("dayResult").value = isNegative ? -absResult.days : absResult.days;
    document.getElementById("hourResult").value = isNegative ? -absResult.hours : absResult.hours;
    document.getElementById("minuteResult").value = isNegative ? -absResult.minutes : absResult.minutes;
    document.getElementById("secondResult").value = isNegative ? -absResult.seconds : absResult.seconds;
    
    // Expanded output
    const totalInDays = resultSeconds / 86400;
    const totalInHours = resultSeconds / 3600;
    const totalInMinutes = resultSeconds / 60;
    
    const expanded = document.querySelector(".expanded-results");
    expanded.innerHTML = `
      <div>
        ${parseInt(day1) || 0} days ${parseInt(hour1) || 0} hours ${parseInt(minute1) || 0} minutes ${parseInt(second1) || 0} seconds<br>
        ${operation === "add" ? "+" : "-"} ${parseInt(day2) || 0} days ${parseInt(hour2) || 0} hours ${parseInt(minute2) || 0} minutes ${parseInt(second2) || 0} seconds<br>
        = ${isNegative ? "-" : ""}${absResult.days} days ${absResult.hours} hours ${absResult.minutes} minutes ${absResult.seconds} seconds<br>
        = ${formatWithCommas(totalInDays)} days<br>
        = ${formatWithCommas(totalInHours)} hours<br>
        = ${formatWithCommas(totalInMinutes)} minutes<br>
        = ${formatWithCommas(resultSeconds)} seconds<br>
        = ${formatCompactDHMS(resultSeconds)}
      </div>
    `;
  }
  
  function resetFields() {
    const fields = [
      "dayOne", "hourOne", "minuteOne", "secondOne",
      "dayTwo", "hourTwo", "minuteTwo", "secondTwo",
      "dayResult", "hourResult", "minuteResult", "secondResult"
    ];
    fields.forEach(id => document.getElementById(id).value = "");
    document.querySelector(".expanded-results").innerHTML = "";
    document.getElementById("add").checked = true;
    calculateResults(); // Recalculate instantly after reset
  }
  
  // Attach event listeners to auto-calculate on any input or operation change
  const allInputs = document.querySelectorAll(
    "#dayOne, #hourOne, #minuteOne, #secondOne, " +
    "#dayTwo, #hourTwo, #minuteTwo, #secondTwo"
  );
  allInputs.forEach(input => {
    input.addEventListener("input", calculateResults);
  });
  
  // Recalculate whenever the add/subtract radio buttons change
  const operationRadios = document.querySelectorAll('input[name="operationType"]');
  operationRadios.forEach(radio => {
    radio.addEventListener("change", calculateResults);
  });
  
  // Reset button listener
  document.getElementById("reset-btn").addEventListener("click", resetFields);
  
window.addEventListener("load", () => {
  calculateResults();
});
});