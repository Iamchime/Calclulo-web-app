
document.addEventListener("DOMContentLoaded", function () {
  const hoursInput = document.getElementById("Hours");
  const weeksInput = document.getElementById("weeks");
  const hoursResult = document.getElementById("hoursResult");
  const minutesResult = document.getElementById("minutesResult");
  const secondsResult = document.getElementById("secondsResult");

  // Helper: clean number input (remove commas, parse float)
  function cleanNumber(value) {
    return parseFloat(value.replace(/,/g, "")) || 0;
  }

  // Helper: format number with commas
  function formatNumber(value) {
    return value.toLocaleString("en-US");
  }

  // Convert Hours → Weeks
  function convertFromHours() {
    const hours = cleanNumber(hoursInput.value);
    const weeks = hours / 168; // 1 week = 168 hours

    weeksInput.value = formatNumber(weeks);

    updateBreakdown(hours);
    markAsResult([weeksInput, hoursResult, minutesResult, secondsResult]);
  }

  // Convert Weeks → Hours
  function convertFromWeeks() {
    const weeks = cleanNumber(weeksInput.value);
    const hours = weeks * 168;

    hoursInput.value = formatNumber(hours);

    updateBreakdown(hours);
    markAsResult([hoursInput, hoursResult, minutesResult, secondsResult]);
  }

  // Breakdown hours into hrs, min, sec
  function updateBreakdown(hours) {
    const wholeHours = Math.floor(hours);
    const minutes = Math.floor((hours - wholeHours) * 60);
    const seconds = Math.round((((hours - wholeHours) * 60) - minutes) * 60);

    hoursResult.value = formatNumber(wholeHours);
    minutesResult.value = formatNumber(minutes);
    secondsResult.value = formatNumber(seconds);
  }

  // Add .result class to changed programmatic fields
  function markAsResult(elements) {
    elements.forEach(el => {
      el.classList.add("result");
    });
  }

  // Event listeners
  hoursInput.addEventListener("input", function () {
    if (this.value.trim() === "") {
      weeksInput.value = "";
      hoursResult.value = "";
      minutesResult.value = "";
      secondsResult.value = "";
      return;
    }
    convertFromHours();
  });

  weeksInput.addEventListener("input", function () {
    if (this.value.trim() === "") {
      hoursInput.value = "";
      hoursResult.value = "";
      minutesResult.value = "";
      secondsResult.value = "";
      return;
    }
    convertFromWeeks();
  });
});