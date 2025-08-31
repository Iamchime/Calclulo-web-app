let countdownInterval;

function startFathersDayCountdown() {
  clearInterval(countdownInterval);
  
  countdownInterval = setInterval(() => {
    const now = new Date();
    
    // Father's Day is the 3rd Sunday of June
    const currentYear = now.getFullYear();
    
    function getFathersDayDate(year) {
      const juneFirst = new Date(year, 5, 1); // June is month 5
      const firstSunday = (7 - juneFirst.getDay()) % 7;
      const thirdSundayDate = 1 + firstSunday + 14;
      return new Date(year, 5, thirdSundayDate, 0, 0, 0); // June X, 00:00:00
    }
    
    let fathersDay = getFathersDayDate(currentYear);
    
    if (now > fathersDay) {
      fathersDay = getFathersDayDate(currentYear + 1); // Move to next year
    }
    
    const diff = fathersDay - now;
    
    if (diff <= 0) {
      document.getElementById("countdownResult").textContent = "It's Father's Day! 👨‍👧‍👦❤️";
      clearInterval(countdownInterval);
      return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    
    document.getElementById("countdownResult").innerHTML =
      `Only...<br><strong>${days} day(s)</strong>,<br>${hours} hour(s),<br>${minutes} minute(s), and<br>${seconds} second(s)<br><strong>...until Father's Day! 👨‍👧‍👦</strong>`;
  }, 1000);
}

window.addEventListener("DOMContentLoaded", startFathersDayCountdown);