let countdownInterval;

function startHalloweenCountdown() {
  clearInterval(countdownInterval);
  
  countdownInterval = setInterval(() => {
    const now = new Date();
    
    const halloweenYear =
      now.getMonth() === 9 && now.getDate() > 31 ?
      now.getFullYear() + 1 :
      now.getFullYear();
    
    const halloweenDate = new Date(`October 31, ${halloweenYear} 00:00:00`);
    const diff = halloweenDate - now;
    
    if (diff <= 0) {
      document.getElementById("countdownResult").textContent = "It's Halloween! 🎃👻";
      clearInterval(countdownInterval);
      return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    
    document.getElementById("countdownResult").innerHTML =
      `Only...<br><strong>${days} day(s)</strong>,<br>${hours} hour(s),<br>${minutes} minute(s), and<br>${seconds} second(s)<br><strong>...until Halloween! 🎃</strong>`;
  }, 1000);
}


window.addEventListener("DOMContentLoaded", startHalloweenCountdown);