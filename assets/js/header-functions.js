const hamburger = document.querySelector("#hamburger-menu");
const nav = document.querySelector(".side-nav");
const closeBtn = document.querySelector(".close-nav-btn");
const searchBtn = document.querySelector("#search-btn");
const searchGlobalInput = document.querySelector("#search-global-input");

let overlay = null;
let isNavOpen = false;
let isAnimating = false;

function openNav() {
  if (isNavOpen || isAnimating) return; // Prevent if already open or animating

  isAnimating = true;
  nav.classList.add("active");
  document.body.classList.add("no-scroll");

  if (!overlay) {
    overlay = document.createElement("div");
    overlay.classList.add("overlay");
    document.body.appendChild(overlay);

    // Click outside closes nav
    overlay.addEventListener("click", closeNav);
  }

  // Use requestAnimationFrame for fade-in
  requestAnimationFrame(() => {
    overlay.classList.add("visible");
  });

  isNavOpen = true;

  // Wait for fade-in transition to complete before allowing another toggle
  overlay.addEventListener(
    "transitionend",
    () => {
      isAnimating = false;
    },
    { once: true }
  );
}

function closeNav() {
  if (!isNavOpen || isAnimating) return; // Prevent if already closed or animating

  isAnimating = true;
  nav.classList.remove("active");
  document.body.classList.remove("no-scroll");

  if (overlay) {
    overlay.classList.remove("visible");

    // Remove overlay after fade-out transition
    overlay.addEventListener(
      "transitionend",
      () => {
        overlay?.remove();
        overlay = null;
        isAnimating = false;
      },
      { once: true }
    );
  } else {
    isAnimating = false;
  }
  
  isNavOpen = false;
  searchGlobalInput.value = "";
}

searchBtn.addEventListener("click", () => {
  openNav();
  searchGlobalInput.focus();
});
hamburger.addEventListener("click", openNav);
closeBtn.addEventListener("click", closeNav);