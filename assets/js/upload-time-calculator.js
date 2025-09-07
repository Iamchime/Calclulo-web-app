document.addEventListener("DOMContentLoaded", function () {
  const fileSizeInput = document.getElementById("fileSize");
  const fileUnitInput = document.getElementById("fileUnit");
  const speedInput = document.getElementById("uploadSpeed");
  const speedUnitInput = document.getElementById("speedUnit");
  const timeUnitInput = document.getElementById("timeUnit");
  ;

  function calculateResults() {
    const fileSize = parseFloat(fileSizeInput.value);
    const fileUnit = fileUnitInput.value;
    const speed = parseFloat(speedInput.value);
    const speedUnit = speedUnitInput.value;
    const timeUnit = timeUnitInput.value;

    // Only calculate if all required fields are valid
    if (isNaN(fileSize) || fileSize <= 0 || isNaN(speed) || speed <= 0) {
     // uploadTimeOutput.value = ""; // clear result until inputs are valid
     document.getElementById("hoursResult").value = "";
  document.getElementById("minutesResult").value = "";
  document.getElementById("secondsResult").value = "";
      return;
    }

    const fileSizeInBits = fileSize * fileSizeUnitToBits(fileUnit);
    const speedInBps = speedUnitToBps(speed, speedUnit, timeUnit);
    const totalSeconds = fileSizeInBits / speedInBps;

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = (totalSeconds % 60).toFixed(2);

    //uploadTimeOutput.value = `${hours} hrs ${minutes} min ${seconds} sec`;
    document.getElementById("hoursResult").value = hours.toLocaleString(undefined, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});
document.getElementById("minutesResult").value = minutes.toLocaleString(undefined, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});
document.getElementById("secondsResult").value = seconds.toLocaleString(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});
  }

  function fileSizeUnitToBits(unit) {
    switch (unit) {
      case "B": return 8;
      case "KB": return 8 * 1000;
      case "MB": return 8 * 1000 * 1000;
      case "GB": return 8 * 1000 * 1000 * 1000;
      case "TB": return 8 * 1000 * 1000 * 1000 * 1000;
      case "KiB": return 8 * 1024;
      case "MiB": return 8 * 1024 * 1024;
      case "GiB": return 8 * 1024 * 1024 * 1024;
      case "TiB": return 8 * 1024 * 1024 * 1024 * 1024;
      default: return 8;
    }
  }

  function speedUnitToBps(speed, unit, timeUnit) {
    let bps = 0;

    switch (unit) {
      case "bps": bps = speed; break;
      case "Kbps": bps = speed * 1000; break;
      case "Mbps": bps = speed * 1000 * 1000; break;
      case "Gbps": bps = speed * 1000 * 1000 * 1000; break;
      case "Kibps": bps = speed * 1024; break;
      case "Mibps": bps = speed * 1024 * 1024; break;
      case "Gibps": bps = speed * 1024 * 1024 * 1024; break;
      default: bps = speed;
    }

    switch (timeUnit) {
      case "min": bps /= 60; break;
      case "hr": bps /= 3600; break;
    }

    return bps;
  }

  // Auto-calculate on any input change
  [fileSizeInput, fileUnitInput, speedInput, speedUnitInput, timeUnitInput].forEach(el => {
    el.addEventListener("input", calculateResults);
    el.addEventListener("change", calculateResults); // for dropdowns
  });
  window.addEventListener("load", () => {
  calculateResults();
});
});