let countdownInterval;

function startEarthDayCountdown() {
  clearInterval(countdownInterval);
  
  countdownInterval = setInterval(() => {
    const now = new Date();
    
    const currentYear = now.getFullYear();
    const earthDayThisYear = new Date(`April 22, ${currentYear} 00:00:00`);
    const earthDay =
      now > earthDayThisYear ?
      new Date(`April 22, ${currentYear + 1} 00:00:00`) :
      earthDayThisYear;
    
    const diff = earthDay - now;
    
    if (diff <= 0) {
      document.getElementById("countdownResult").textContent = "It's Earth Day! 🌍💚";
      clearInterval(countdownInterval);
      return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    
    document.getElementById("countdownResult").innerHTML =
      `Only...<br><strong>${days} day(s)</strong>,<br>${hours} hour(s),<br>${minutes} minute(s), and<br>${seconds} second(s)<br><strong>...until Earth Day! 🌍</strong>`;
  }, 1000);
}

window.addEventListener("DOMContentLoaded", startEarthDayCountdown);