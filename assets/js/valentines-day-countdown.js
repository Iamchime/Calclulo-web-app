let countdownInterval;

function startValentinesDayCountdown() {
  clearInterval(countdownInterval);
  
  countdownInterval = setInterval(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // If today is after Feb 14 this year, countdown to next year's Feb 14
    const valentinesYear =
      now.getMonth() > 1 || (now.getMonth() === 1 && now.getDate() > 14) ?
      currentYear + 1 :
      currentYear;
    
    const valentinesDate = new Date(`February 14, ${valentinesYear} 00:00:00`);
    const diff = valentinesDate - now;
    
    if (diff <= 0) {
      document.getElementById("countdownResult").textContent = "Happy Valentine's Day! ❤️🌹";
      clearInterval(countdownInterval);
      return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    
    document.getElementById("countdownResult").innerHTML =
      `Only...<br><strong>${days} day(s)</strong>,<br>${hours} hour(s),<br>${minutes} minute(s), and<br>${seconds} second(s)<br><strong>...until Valentine's Day! ❤️</strong>`;
  }, 1000);
}

window.addEventListener("DOMContentLoaded", startValentinesDayCountdown);