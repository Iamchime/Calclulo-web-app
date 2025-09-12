
document.addEventListener("DOMContentLoaded", function () {
  const minutesEl = document.getElementById("Minutes");
  const hoursEl = document.getElementById("Hours");
  const secondsEl = document.getElementById("Seconds");

  const hoursResult = document.getElementById("hoursResult");
  const minutesResult = document.getElementById("minutesResult");
  const secondsResult = document.getElementById("secondsResult");

  // Clean numbers (strip commas)
  function cleanNumber(value) {
    return parseFloat(value.replace(/,/g, "")) || 0;
  }

  // Format with commas + fraction control
  function formatNumber(num, minFraction = 0, maxFraction = 4) {
    return Number(num).toLocaleString("en-US", {
      minimumFractionDigits: minFraction,
      maximumFractionDigits: maxFraction
    });
  }

  // Remove .result before recalculation
  function resetResultClasses() {
    [hoursResult, minutesResult, secondsResult, hoursEl, minutesEl, secondsEl].forEach(el => {
      el.classList.remove("result");
    });
  }

  // From Minutes
  function fromMinutes() {
    const minutes = cleanNumber(minutesEl.value);
    const hours = minutes / 60;
    const hrs = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);

    resetResultClasses();

    // update Hours field with 2 decimals
    hoursEl.value = formatNumber(hours, 2, 2);
    hoursEl.classList.add("result");

    // update Results
    hoursResult.value = formatNumber(hrs);
    minutesResult.value = formatNumber(mins);
    secondsResult.value = "0";

    hoursResult.classList.add("result");
    minutesResult.classList.add("result");
    secondsResult.classList.add("result");
  }

  // From Hours
  function fromHours() {
    const hours = cleanNumber(hoursEl.value);
    const minutes = hours * 60;
    const hrs = Math.floor(hours);
    const mins = Math.floor((hours * 60) % 60);

    resetResultClasses();

    minutesEl.value = formatNumber(minutes, 2, 2);
    minutesEl.classList.add("result");

    hoursResult.value = formatNumber(hrs);
    minutesResult.value = formatNumber(mins);
    secondsResult.value = "0";

    hoursResult.classList.add("result");
    minutesResult.classList.add("result");
    secondsResult.classList.add("result");
  }

  // From Seconds
  function fromSeconds() {
    const totalSeconds = cleanNumber(secondsEl.value);
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = Math.floor(totalSeconds % 60);
    const minutes = totalSeconds / 60;
    const hours = totalSeconds / 3600;

    resetResultClasses();

    minutesEl.value = formatNumber(minutes, 2, 2);
    hoursEl.value = formatNumber(hours, 2, 2);

    minutesEl.classList.add("result");
    hoursEl.classList.add("result");

    hoursResult.value = formatNumber(hrs);
    minutesResult.value = formatNumber(mins);
    secondsResult.value = formatNumber(secs);

    hoursResult.classList.add("result");
    minutesResult.classList.add("result");
    secondsResult.classList.add("result");
  }

  // Auto listeners
  minutesEl.addEventListener("input", fromMinutes);
  hoursEl.addEventListener("input", fromHours);
  secondsEl.addEventListener("input", fromSeconds);
});