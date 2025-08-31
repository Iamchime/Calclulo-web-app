let countdownInterval;

function startWorldEnvironmentDayCountdown() {
  clearInterval(countdownInterval);
  
  countdownInterval = setInterval(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // If today is after June 5, target next year's World Environment Day
    const targetYear =
      now.getMonth() > 5 || (now.getMonth() === 5 && now.getDate() > 5) ?
      currentYear + 1 :
      currentYear;
    
    const environmentDay = new Date(`June 5, ${targetYear} 00:00:00`);
    const diff = environmentDay - now;
    
    if (diff <= 0) {
      document.getElementById("countdownResult").textContent = "Happy World Environment Day! 🌍🌿";
      clearInterval(countdownInterval);
      return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    
    document.getElementById("countdownResult").innerHTML =
      `Only...<br><strong>${days} day(s)</strong>,<br>${hours} hour(s),<br>${minutes} minute(s), and<br>${seconds} second(s)<br><strong>...until World Environment Day! 🌱</strong>`;
  }, 1000);
}

window.addEventListener("DOMContentLoaded", startWorldEnvironmentDayCountdown);