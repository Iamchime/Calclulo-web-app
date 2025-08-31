let countdownInterval;

function calculateEaster(year) {
  // Meeus/Jones/Butcher Gregorian algorithm
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3=March, 4=April
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  
  // Month is 1-based; JS Date months are 0-based
  return new Date(year, month - 1, day);
}

function startEasterCountdown() {
  clearInterval(countdownInterval);
  
  countdownInterval = setInterval(() => {
    const now = new Date();
    
    // Determine this year's Easter date
    let easterDate = calculateEaster(now.getFullYear());
    
    // If Easter already passed this year, get next year's Easter
    if (now > easterDate) {
      easterDate = calculateEaster(now.getFullYear() + 1);
    }
    
    const diff = easterDate - now;
    
    if (diff <= 0) {
      document.getElementById("countdownResult").textContent = "Happy Easter! 🐣🌸";
      clearInterval(countdownInterval);
      return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    
    document.getElementById("countdownResult").innerHTML =
      `Only...<br><strong>${days} day(s)</strong>,<br>${hours} hour(s),<br>${minutes} minute(s), and<br>${seconds} second(s)<br><strong>...until Easter! 🐰🌷</strong>`;
  }, 1000);
}

window.addEventListener("DOMContentLoaded", startEasterCountdown);