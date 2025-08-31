let countdownInterval;

function startWorldHealthDayCountdown() {
  clearInterval(countdownInterval);
  
  countdownInterval = setInterval(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // If today is after April 7, countdown to next year's World Health Day
    const targetYear =
      now.getMonth() > 3 || (now.getMonth() === 3 && now.getDate() > 7) ?
      currentYear + 1 :
      currentYear;
    
    const healthDay = new Date(`April 7, ${targetYear} 00:00:00`);
    const diff = healthDay - now;
    
    if (diff <= 0) {
      document.getElementById("countdownResult").textContent = "Happy World Health Day! 🩺🌍";
      clearInterval(countdownInterval);
      return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    
    document.getElementById("countdownResult").innerHTML =
      `Only...<br><strong>${days} day(s)</strong>,<br>${hours} hour(s),<br>${minutes} minute(s), and<br>${seconds} second(s)<br><strong>...until World Health Day! 🩺</strong>`;
  }, 1000);
}

window.addEventListener("DOMContentLoaded", startWorldHealthDayCountdown);