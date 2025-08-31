  let countdownInterval;

  function startChristmasCountdown() {
    clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
      const now = new Date();

      const christmasYear =
        now.getMonth() === 11 && now.getDate() > 25
          ? now.getFullYear() + 1
          : now.getFullYear();

      const christmasDate = new Date(`December 25, ${christmasYear} 00:00:00`);
      const diff = christmasDate - now;

      if (diff <= 0) {
        document.getElementById("countdownResult").textContent = "It's Christmas! 🎄";
        clearInterval(countdownInterval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      document.getElementById("countdownResult").innerHTML =
        `Only...<br><strong>${days} day(s)</strong>,<br>${hours} hour(s),<br>${minutes} minute(s), and<br>${seconds} second(s)<br><strong>...until Christmas! 🎄</strong>`;
    }, 1000);
  }
function createSnowflake() {
  const snowflake = document.createElement('div');
  snowflake.classList.add('snowflake');
  snowflake.textContent = '❄️';
  
  // Random left position across the screen
  snowflake.style.left = Math.random() * window.innerWidth + 'px';
  
  // Random size & opacity
  const size = (Math.random() * 10 + 10) + 'px';
  snowflake.style.fontSize = size;
  snowflake.style.opacity = Math.random();
  
  // Random fall duration
  const duration = (Math.random() * 5 + 5) + 's';
  snowflake.style.animationDuration = duration;
  
  document.body.appendChild(snowflake);
  
  // Remove after animation
  setTimeout(() => {
    snowflake.remove();
  }, parseFloat(duration) * 1000);
}

// Create snowflakes at intervals
setInterval(createSnowflake, 200);
  window.addEventListener("DOMContentLoaded", startChristmasCountdown);
