document.addEventListener("DOMContentLoaded", () => {
  const inputs = [
    "fileSize",
    "fileUnit",
    "downloadSpeed",
    "speedUnit",
    "timeUnit"
  ];

  // Attach automatic calculation on all relevant fields
  inputs.forEach(id => {
    document.getElementById(id).addEventListener("input", calculateResults);
    document.getElementById(id).addEventListener("change", calculateResults);
  });
});

function calculateResults() {
  const fileSize = parseFloat(document.getElementById("fileSize").value.replace(/,/g, "")) || 0;
  const fileUnit = document.getElementById("fileUnit").value;
  const speed = parseFloat(document.getElementById("downloadSpeed").value.replace(/,/g, "")) || 0;
  const speedUnit = document.getElementById("speedUnit").value;
  const timeUnit = document.getElementById("timeUnit").value;

  // Reset result when invalid input
  if (fileSize <= 0 || speed <= 0) {
    document.getElementById("downloadTime").value = "";
    return;
  }

  // File size in bits
  const fileSizeInBits = fileSize * fileSizeUnitToBits(fileUnit);

  // Download speed in bits per second
  const speedInBps = speedUnitToBps(speed, speedUnit, timeUnit);

  // Calculate total download time in seconds
  const totalSeconds = fileSizeInBits / speedInBps;

  // Convert into hours, minutes, and seconds
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = (totalSeconds % 60).toFixed(2);

  // Show result
 // const result = `${hours} hrs ${minutes} min ${seconds} sec`;
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
  let bps;

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