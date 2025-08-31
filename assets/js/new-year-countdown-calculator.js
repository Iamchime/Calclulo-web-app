  let countdownInterval;

  function startNewYearCountdown() {
    clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
      const now = new Date();

      const newYear = now.getMonth() === 0 && now.getDate() === 1
        ? now.getFullYear() + 1
        : now.getFullYear() + 1;

      const newYearDate = new Date(`January 1, ${newYear} 00:00:00`);
      const diff = newYearDate - now;

      if (diff <= 0) {
        document.getElementById("countdownResult").textContent = "Happy New Year! 🎆";
        clearInterval(countdownInterval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      document.getElementById("countdownResult").innerHTML =
        `Only...<br><strong>${days} day(s)</strong>,<br>${hours} hour(s),<br>${minutes} minute(s), and<br>${seconds} second(s)<br><strong>...until New Year! 🎆</strong>`;
    }, 1000);
  }

  function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    snowflake.textContent = "❄️";

    snowflake.style.left = Math.random() * window.innerWidth + 'px';
    const size = (Math.random() * 10 + 10) + 'px';
    snowflake.style.fontSize = size;
    snowflake.style.opacity = Math.random();
    const duration = (Math.random() * 5 + 5) + 's';
    snowflake.style.animationDuration = duration;

    document.body.appendChild(snowflake);
    setTimeout(() => snowflake.remove(), parseFloat(duration) * 1000);
  }

  // Optional snowflake rain (ignored if not needed)
  setInterval(createSnowflake, 200);

  // Start New Year countdown on page load
  window.addEventListener("DOMContentLoaded", startNewYearCountdown);
