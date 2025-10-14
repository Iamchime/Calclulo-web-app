(function() {
  const FAVS_KEY = "calculatorFavourites";
  
  function loadFavourites() {
    return JSON.parse(localStorage.getItem(FAVS_KEY)) || [];
  }
  
  function saveFavourites(favs) {
    localStorage.setItem(FAVS_KEY, JSON.stringify(favs));
  }
  
  function renderFavourites(sorted = false) {
    const list = document.getElementById("favs-list");
    list.innerHTML = "";
    
    let favs = loadFavourites();
    if (sorted) {
      favs.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    }
    
    if (favs.length === 0) {
      list.innerHTML = `<p id="nocalcfound">No favourites yet.</p>`;
      return;
    }
    
    favs.forEach(fav => {
      const li = document.createElement("li");
      li.className = "fav-item-li";
      li.innerHTML = `
        <a href="${fav.link}" class="fav-link"><strong>${fav.name}</strong></a>
        <div class="fav-btn-group">
          <button class="del-btn"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button>
          <button class="share-btn"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M440-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h320v80H320Zm200 160v-80h160q50 0 85-35t35-85q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H520Z"/></svg></button>
        </div>
        
      `;
      
      const delBtn = li.querySelector(".del-btn");
      delBtn.addEventListener("click", () => removeFavourite(fav.id));
      
      const shareBtn = li.querySelector(".share-btn");
      shareBtn.addEventListener("click", () => shareFavourite(fav.id));
      
      list.appendChild(li);
    });
  }
  
  function removeFavourite(id) {
    let favs = loadFavourites();
    favs = favs.filter(fav => fav.id !== id);
    saveFavourites(favs);
    renderFavourites();
  }
  
  function shareFavourite(id) {
    const favs = loadFavourites();
    const fav = favs.find(f => f.id === id);
    if (fav && fav.link) {
      const fullUrl = window.location.origin + fav.link;
      navigator.clipboard.writeText(fullUrl).then(() => {
      });
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    renderFavourites();
    
    const filterBtn = document.getElementById("filter-btn");
    if (filterBtn) {
      filterBtn.addEventListener("click", () => renderFavourites(true));
    }
  });
})();

/****** closing side bar when links are clicked *************/

document.querySelectorAll(".side-nav a").forEach((link) => {
  link.addEventListener("click", (e) => {
    closeNav();
  });
});

document.addEventListener("click", (e) => {
  if (e.target.closest(".search-results-a")) {
    closeNav();
  }
});

/*********** header functions **************/
const hamburger = document.querySelector("#hamburger-menu");
const nav = document.querySelector(".side-nav");
const closeBtn = document.querySelector(".close-nav-btn");
const searchBtn = document.querySelector("#search-btn");
const searchGlobalInput = document.querySelector("#search-global-input");

let overlay = null;
let isNavOpen = false;
let isAnimating = false;

function openNav() {
  if (isNavOpen || isAnimating) return;

  isAnimating = true;
  nav.classList.add("active");
  document.body.classList.add("no-scroll");

  if (!overlay) {
    overlay = document.createElement("div");
    overlay.classList.add("overlay");
    document.body.appendChild(overlay);

    overlay.addEventListener("click", closeNav);
  }

  requestAnimationFrame(() => {
    overlay.classList.add("visible");
  });

  isNavOpen = true;

  overlay.addEventListener(
    "transitionend",
    () => {
      isAnimating = false;
    },
    { once: true }
  );
}

function closeNav() {
  if (!isNavOpen || isAnimating) return;

  isAnimating = true;
  nav.classList.remove("active");
  document.body.classList.remove("no-scroll");

  if (overlay) {
    overlay.classList.remove("visible");

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
/*******************************/

/***************** PWA helper ******************/
document.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style");
  style.textContent = `
  body{
    user-select: none;
  }
    a, img {
      -webkit-touch-callout: none !important;
      user-select: none !important;
    }

    html, body {
      overscroll-behavior-y: contain !important;
    }
  `;
  document.head.appendChild(style);
  
  document.addEventListener("contextmenu", e => e.preventDefault());
  
  let lastTouchY = 0;
  const preventPullToRefresh = (e) => {
    const currentY = e.touches[0].clientY;
    const scrollY = window.scrollY;
    
    if (currentY > lastTouchY && scrollY === 0) {
      e.preventDefault();
    }
    
    lastTouchY = currentY;
  };
  
  document.addEventListener("touchstart", e => { lastTouchY = e.touches[0].clientY; }, { passive: false });
  document.addEventListener("touchmove", preventPullToRefresh, { passive: false });
  
  const homeLink = document.querySelector(".home-link");
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
  
  const updateHomeLink = () => {
    if (!homeLink) return;
    if (isStandalone) {
      homeLink.setAttribute("href", "/pwa-start-page");
    } else {
      homeLink.setAttribute("href", "/index");
    }
  };
  
  updateHomeLink();
  
  if (isStandalone && window.location.pathname === "/index") {
    window.location.replace("/pwa-start-page");
  }
  
  window.addEventListener("resize", updateHomeLink);
});
/****************************************/

/************** ripple effect handling ****************/
(function () {
  const applied = new WeakSet();

  function ensureKeyframes() {
    if (document.getElementById('material-ripple-keyframes')) return;
    const rippleStyle = document.createElement('style');
    rippleStyle.id = 'material-ripple-keyframes';
    rippleStyle.textContent = `
      @keyframes ripple-enter {
        0% { transform: scale(0); opacity: 0.1; }
        50% { opacity: 0.35; }
        100% { transform: scale(1); opacity: 0.35; }
      }
      @keyframes ripple-exit {
        from { opacity: 0.35; transform: scale(1); }
        to { opacity: 0; transform: scale(1); }
      }`;
    document.head.appendChild(rippleStyle);
  }

  function addRipple(element, options = {}) {
    if (!element || applied.has(element)) return;
    applied.add(element);
    ensureKeyframes();

    const color = options.color || 'rgba(0,0,0,0.15)';
    const duration = options.duration || 550;
    const fadeDuration = options.fadeDuration || 350;
    const maxRipples = options.maxRipples || 3;

    const activeRipples = [];

    const computed = window.getComputedStyle(element);
   if (computed.position === 'static') element.style.position = 'relative';
    if (computed.overflow !== 'hidden') element.style.overflow = 'hidden';

    function createRipple(x, y) {
      
      if (activeRipples.length >= maxRipples) {
        const oldest = activeRipples.shift();
        if (oldest && oldest.parentNode) oldest.remove();
      }

      const rect = element.getBoundingClientRect();
      const size = Math.sqrt(rect.width * rect.width + rect.height * rect.height) * 2;
      const ripple = document.createElement('span');

      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.position = 'absolute';
      ripple.style.borderRadius = '50%';
      ripple.style.left = `${x - size / 2}px`;
      ripple.style.top = `${y - size / 2}px`;
      ripple.style.backgroundColor = color;
      ripple.style.pointerEvents = 'none';
      ripple.style.opacity = '0.1';
      ripple.style.transform = 'scale(0)';
      ripple.style.zIndex = '0';
      ripple.style.willChange = 'transform, opacity';
      ripple.style.animation = `ripple-enter ${duration}ms cubic-bezier(0.4,0,0.2,1) forwards`;

      element.appendChild(ripple);
      activeRipples.push(ripple);

      setTimeout(() => {
        
        ripple.style.animation = `ripple-exit ${fadeDuration}ms linear forwards`;
        
        ripple.addEventListener(
          'animationend',
          (ev) => {
            if (ev.animationName && ev.animationName.indexOf('ripple-exit') > -1) {
              ripple.remove();
              const idx = activeRipples.indexOf(ripple);
              if (idx > -1) activeRipples.splice(idx, 1);
            }
          },
          { once: true }
        );
      }, duration);
    }

    function onPointerDown(e) {
      
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      const rect = element.getBoundingClientRect();
      const x = (e.clientX ?? (e.touches && e.touches[0] && e.touches[0].clientX)) - rect.left;
      const y = (e.clientY ?? (e.touches && e.touches[0] && e.touches[0].clientY)) - rect.top;
      createRipple(x, y);
    }

    function onKeyDown(e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar' || e.code === 'Space') {

        if (e.key === ' ' || e.code === 'Space') e.preventDefault();
        const rect = element.getBoundingClientRect();
        createRipple(rect.width / 2, rect.height / 2);
      }
    }

    element.addEventListener('pointerdown', onPointerDown);
    element.addEventListener('keydown', onKeyDown);

    element.__destroyRipple = () => {
      element.removeEventListener('pointerdown', onPointerDown);
      element.removeEventListener('keydown', onKeyDown);
      applied.delete(element);
    };
  }

  function observeSelector(selector, options = {}) {
    
    document.querySelectorAll(selector).forEach((el) => addRipple(el, options));

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        
        if (m.addedNodes && m.addedNodes.length) {
          m.addedNodes.forEach((node) => {
            if (node.nodeType !== 1) return; 
            if (node.matches && node.matches(selector)) {
              addRipple(node, options);
            }
            
            const descendants = node.querySelectorAll ? node.querySelectorAll(selector) : null;
            if (descendants && descendants.length) {
              descendants.forEach((el) => addRipple(el, options));
            }
          });
        }

        if (m.type === 'attributes' && m.target && m.target.matches && m.target.matches(selector)) {
          addRipple(m.target, options);
        }
      }
    });

    observer.observe(document.documentElement || document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'id', 'role', 'data-*'],
    });

    return observer;
  }

  const selector =
    '.header-btns-container button, .side-nav a, .close-nav-btn, .quick-actions-btn button, .cookie-wrapper button, .calculator-categories-two a, .search-result-item, .share-btn, .del-btn, #favs-list li';

  const rippleObserver = observeSelector(selector, { color: 'darkgrey', maxRipples: 3 });

  window.__ripple = {
    addRipple,
    observeSelector,
    rippleObserver,
  };
})();