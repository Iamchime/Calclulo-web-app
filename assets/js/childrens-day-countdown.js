let countdownInterval;

function startChildrensDayCountdown() {
  clearInterval(countdownInterval);
  
  countdownInterval = setInterval(() => {
    const now = new Date();
    
    const childrensYear =
      now.getMonth() > 4 || (now.getMonth() === 4 && now.getDate() > 27) ?
      now.getFullYear() + 1 :
      now.getFullYear();
    
    const childrensDate = new Date(`May 27, ${childrensYear} 00:00:00`);
    const diff = childrensDate - now;
    
    if (diff <= 0) {
      document.getElementById("countdownResult").textContent = "It's Children's Day! 🎉👧👦";
      clearInterval(countdownInterval);
      return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    
    document.getElementById("countdownResult").innerHTML =
      `Only...<br><strong>${days} day(s)</strong>,<br>${hours} hour(s),<br>${minutes} minute(s), and<br>${seconds} second(s)<br><strong>...until Children's Day! 🎉</strong>`;
  }, 1000);
}

window.addEventListener("DOMContentLoaded", startChildrensDayCountdown);