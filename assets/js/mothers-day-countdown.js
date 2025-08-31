let countdownInterval;

function startMothersDayCountdown() {
  clearInterval(countdownInterval);
  
  countdownInterval = setInterval(() => {
    const now = new Date();
    
    // Mother's Day is the 2nd Sunday of May
    const currentYear = now.getFullYear();
    
    function getMothersDayDate(year) {
      const mayFirst = new Date(year, 4, 1); // May is month 4
      const firstSunday = (7 - mayFirst.getDay()) % 7;
      const secondSundayDate = 1 + firstSunday + 7;
      return new Date(year, 4, secondSundayDate, 0, 0, 0); // May X, 00:00:00
    }
    
    let mothersDay = getMothersDayDate(currentYear);
    
    if (now > mothersDay) {
      mothersDay = getMothersDayDate(currentYear + 1); // Next year's Mother's Day
    }
    
    const diff = mothersDay - now;
    
    if (diff <= 0) {
      document.getElementById("countdownResult").textContent = "It's Mother's Day! 💐❤️";
      clearInterval(countdownInterval);
      return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    
    document.getElementById("countdownResult").innerHTML =
      `Only...<br><strong>${days} day(s)</strong>,<br>${hours} hour(s),<br>${minutes} minute(s), and<br>${seconds} second(s)<br><strong>...until Mother's Day! 💐</strong>`;
  }, 1000);
}

window.addEventListener("DOMContentLoaded", startMothersDayCountdown);