let countdownInterval;

function startLabourDayCountdown() {
  clearInterval(countdownInterval);
  
  countdownInterval = setInterval(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // If today's date is after May 1, countdown to next year's Labour Day
    const labourYear =
      now.getMonth() > 4 || (now.getMonth() === 4 && now.getDate() > 1) ?
      currentYear + 1 :
      currentYear;
    
    const labourDate = new Date(`May 1, ${labourYear} 00:00:00`);
    const diff = labourDate - now;
    
    if (diff <= 0) {
      document.getElementById("countdownResult").textContent = "Happy Labour Day! 🛠️🎉";
      clearInterval(countdownInterval);
      return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    
    document.getElementById("countdownResult").innerHTML =
      `Only...<br><strong>${days} day(s)</strong>,<br>${hours} hour(s),<br>${minutes} minute(s), and<br>${seconds} second(s)<br><strong>...until Labour Day! 🛠️</strong>`;
  }, 1000);
}

window.addEventListener("DOMContentLoaded", startLabourDayCountdown);