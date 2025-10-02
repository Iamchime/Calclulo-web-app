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
/********** list the total number of calculators in a category *********/

document.addEventListener("DOMContentLoaded", async () => {
  try {
    
    const response = await fetch("/assets/keywords.json");
    const data = await response.json();
    const tools = data.tools || [];
    
    const categoryCount = {};
    tools.forEach(tool => {
      let category = tool.category.trim().toLowerCase();
     
      category = category.replace(/calculators?/gi, "").trim();
      
      if (!categoryCount[category]) {
        categoryCount[category] = 0;
      }
      categoryCount[category]++;
    });
    
    document.querySelectorAll(".description-header-info-calculator-numb").forEach(span => {
      const dataCategory = span.dataset.nameCategory?.trim().toLowerCase() || "";
      
      const normalizedCategory = dataCategory.replace(/calculators?/gi, "").trim();
      
      const count = categoryCount[normalizedCategory] || 0;
      
      span.textContent = `${count} calculator${count !== 1 ? "s" : ""}`;
      
      if(count == 0)
      span.textContent = `no calculator`;
    });
    
  } catch (error) {
    console.error("Error loading calculator counts:", error);
  }
});

/************ PWA helper
 ******/
 document.addEventListener("DOMContentLoaded", () => {
  const homeLink = document.querySelector(".home-link");
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches;
  
  const updateHomeLink = () => {
    if (!homeLink) return;
    if (isStandalone) {
      homeLink.setAttribute("href", "/pwa-start-page");
    } else {
      homeLink.setAttribute("href", "/index");
    }
  };
  
updateHomeLink();
  
  if (
    (isStandalone) &&
    window.location.pathname === "/index"
  ) {
    window.location.replace("/pwa-start-page");
  }

  window.addEventListener("resize", updateHomeLink);
});

/********************************
  Progressive Web App
 *******************************/

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(reg => console.log('Service worker registered:', reg.scope))
      .catch(err => console.error('Service worker registration failed:', err));
  });
}

let deferredPrompt = null;
const installBtn = document.getElementById('installPwaBtn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  installBtn.style.display = 'inline-flex';
});

function InstallPwa() {
  if (!deferredPrompt) {
    console.log("PWA install prompt is not available yet.");
    return;
  }
  
  deferredPrompt.prompt();
  
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the PWA install prompt ✅');
    } else {
      console.log('User dismissed the PWA install prompt ❌');
    }
    deferredPrompt = null;
    
    installBtn.style.display = 'none';
  });
}

window.addEventListener('appinstalled', () => {
  console.log('PWA installed successfully 🎉');
  deferredPrompt = null;
  installBtn.style.display = 'none';
});

/********** share global *************************/
document.querySelector(".global-share-btn").addEventListener("click", () => {
  const overlay = document.createElement("div");
  overlay.className = "share-modal-overlay";
  
  const modal = document.createElement("div");
  modal.className = "global-share-popup";
  
  modal.innerHTML = `
  <div class="share-header">
  <h2>Share Calculator</h2>
  <button class="close-share-modal">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
      </svg>
    </button>
 </div>
 <span>Share link via</span>
    <div class="share-to-social-icon-url">
    <a id="facebook" href="#"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-facebook" viewBox="0 0 16 16">
  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
</svg></a>
    <a id="twitter" href="#"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-twitter-x" viewBox="0 0 16 16">
  <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
</svg></a>
    <a id="linkedin" href="#">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-linkedin" viewBox="0 0 16 16">
  <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
</svg>
    </a>
    <a id="email" href="#"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-440 160-640v400h360v80H160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v280h-80v-200L480-440Zm0-80 320-200H160l320 200ZM760-40l-56-56 63-64H600v-80h167l-64-64 57-56 160 160L760-40ZM160-640v440-240 3-283 80Z"/></svg></a>
    <a id="threads" href="#"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-threads" viewBox="0 0 16 16">
  <path d="M6.321 6.016c-.27-.18-1.166-.802-1.166-.802.756-1.081 1.753-1.502 3.132-1.502.975 0 1.803.327 2.394.948s.928 1.509 1.005 2.644q.492.207.905.484c1.109.745 1.719 1.86 1.719 3.137 0 2.716-2.226 5.075-6.256 5.075C4.594 16 1 13.987 1 7.994 1 2.034 4.482 0 8.044 0 9.69 0 13.55.243 15 5.036l-1.36.353C12.516 1.974 10.163 1.43 8.006 1.43c-3.565 0-5.582 2.171-5.582 6.79 0 4.143 2.254 6.343 5.63 6.343 2.777 0 4.847-1.443 4.847-3.556 0-1.438-1.208-2.127-1.27-2.127-.236 1.234-.868 3.31-3.644 3.31-1.618 0-3.013-1.118-3.013-2.582 0-2.09 1.984-2.847 3.55-2.847.586 0 1.294.04 1.663.114 0-.637-.54-1.728-1.9-1.728-1.25 0-1.566.405-1.967.868ZM8.716 8.19c-2.04 0-2.304.87-2.304 1.416 0 .878 1.043 1.168 1.6 1.168 1.02 0 2.067-.282 2.232-2.423a6.2 6.2 0 0 0-1.528-.161"/>
</svg></a>
    </div>
    <span>Page Direct</span>
     <button class="copy-share-url"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M440-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h320v80H320Zm200 160v-80h160q50 0 85-35t35-85q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H520Z"/></svg>Copy link</button>
  `;
  
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  document.querySelectorAll('.share-to-social-icon-url a').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const platform = this.id;
      const url = encodeURIComponent(window.location.href);
      const message = encodeURIComponent("Guys, I found this free useful tool: " + window.location.href);
      let shareUrl = '';
      
      switch (platform) {
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
          break;
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?text=${message}`;
          break;
        case 'linkedin':
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
          break;
        case 'email':
          shareUrl = `mailto:?subject=Check%20this%20tool&body=${message}`;
          break;
        case 'threads':
          window.open("https://www.threads.com/");
          return;
        default:
          return;
      }
      
      window.open(shareUrl, '_blank');
    });
  });
  //
  const copyBtn = document.querySelector(".copy-share-url");
  copyBtn.onclick = () => {
    navigator.clipboard.writeText(window.location.href);
  }
  
  setTimeout(() => {
    overlay.classList.add("visible");
    modal.classList.add("visible");
    document.body.classList.add("no-scroll");
  }, 10);
  
  function closeModal() {
    overlay.classList.remove("visible");
    modal.classList.remove("visible");
    document.body.classList.remove("no-scroll");
    setTimeout(() => overlay.remove(), 300);
  }
  
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  
  modal.querySelector(".close-share-modal").addEventListener("click", closeModal);
});
/*******************************/

/***************************** cookie management 
**************************/
 document.addEventListener("DOMContentLoaded", () => {
  if (!document.cookie.includes("accepted_cookies=yes")) {
    const cookieBox = document.createElement("div");
    cookieBox.className = "cookie-wrapper";
    cookieBox.innerHTML = `
    <img src="/assets/icons/cookie.svg"/>
      <h2>Cookies Consent</h2> 
      <div class="cookie-data">    
        <p>We use cookies to improve your experience on our website. By using our website, you’re agreeing to the collection of data as described in our <a class="from-cookie-to-tos" href="/privacy">Privacy Policy</a></p>    
      </div>    
      <button id="accept-cookieBtn">I understand</button>
      <button id="decline-cookieBtn">Decline</button>
      
    `;
    document.body.appendChild(cookieBox);
    
    setTimeout(() => {
      requestAnimationFrame(() => {
        cookieBox.classList.add("show");
      });
    }, 3000);
    
    const acceptBtn = cookieBox.querySelector("#accept-cookieBtn");
    acceptBtn.addEventListener("click", () => {
      document.cookie = "accepted_cookies=yes; path=/";
      cookieBox.classList.remove("show");
      cookieBox.addEventListener("transitionend", () => {
        cookieBox.remove();
      }, { once: true });
    });
    const declineBtn = cookieBox.querySelector("#decline-cookieBtn");
    declineBtn.onclick = () => {
      cookieBox.classList.remove("show");
    }
  }
});

/***************************************************************/

document.querySelectorAll('.input-group #input-tip-icon').forEach((icon) => {
  icon.addEventListener('click', () => {
    const group = icon.closest('.input-group');
    const tip = group.querySelector('.input-tips');
    
    if (tip.classList.contains('animating')) return; 
    
    if (tip.classList.contains('open')) {
      collapseTip(tip, icon);
    } else {
      document.querySelectorAll('.input-tips.open').forEach(t => collapseTip(t));
      document.querySelectorAll('.input-group #input-tip-icon.rotate').forEach(i => i.classList.remove('rotate'));
      
      expandTip(tip, icon);
    }
  });
});

function expandTip(tip, icon) {
  tip.classList.add('open', 'animating');
  tip.style.height = '0';
  
  requestAnimationFrame(() => {
    tip.style.height = tip.scrollHeight + 'px';
  });
  
  tip.addEventListener('transitionend', () => {
    tip.style.height = 'auto';
    tip.classList.remove('animating');
  }, { once: true });
  
  if (icon) icon.classList.add('rotate');
  loadSavedCurrency();
}

function collapseTip(tip, icon = null) {
  tip.classList.add('animating');
  tip.style.height = tip.scrollHeight + 'px';
  
  requestAnimationFrame(() => {
    tip.style.height = '0';
  });
  
  tip.addEventListener('transitionend', () => {
    tip.classList.remove('open', 'animating');
    tip.style.height = '0';
  }, { once: true });
  
  if (icon) icon.classList.remove('rotate');
}

 /**************************************
 * Overflowing text handling + programmatic updates + initial
 **************************************/
document.addEventListener('DOMContentLoaded', () => {
  setupSmartInputs({ minFontSize: 10 });
});

function setupSmartInputs(options = {}) {
  const inputs = Array.from(document.querySelectorAll('input[type="text"], input[type="number"]:not([readonly])'));
  const minFontSize = options.minFontSize || 10;

  const tooltip = document.createElement('div');
  tooltip.className = 'input-tooltip-float';
  tooltip.style.display = 'none';
  document.body.appendChild(tooltip);
  
  const mirror = document.createElement('span');
  mirror.style.position = 'absolute';
  mirror.style.whiteSpace = 'pre';
  mirror.style.visibility = 'hidden';
  mirror.style.height = '0';
  mirror.style.overflow = 'hidden';
  document.body.appendChild(mirror);
  
  let activeInput = null;
  let hideTimeout = null;
  
  function showTooltip(text, input) {
    tooltip.textContent = text;
    tooltip.classList.add('visible');
    tooltip.style.display = 'block';
    
    const rect = input.getBoundingClientRect();
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const scrollX = window.scrollX || document.documentElement.scrollLeft;
    
    requestAnimationFrame(() => {
      tooltip.style.left = `${rect.left + scrollX}px`;
      tooltip.style.top = `${rect.top - 8 + scrollY - tooltip.offsetHeight - 8}px`;
    });
  }
  
  function hideTooltip(immediate = false) {
    if (immediate) {
      tooltip.classList.remove('visible');
      tooltip.style.display = 'none';
      return;
    }
    tooltip.classList.remove('visible');
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      if (!tooltip.classList.contains('visible')) {
        tooltip.style.display = 'none';
      }
    }, 160);
  }
  
  const state = new WeakMap();
  
  inputs.forEach(input => {
    const baseFontSize = parseFloat(getComputedStyle(input).fontSize) || 16;
    
    const adjust = () => {
      const style = getComputedStyle(input);
      mirror.style.font = style.font;
      mirror.style.fontSize = baseFontSize + 'px';
      mirror.style.letterSpacing = style.letterSpacing;
      mirror.style.fontWeight = style.fontWeight;
      mirror.style.fontFamily = style.fontFamily;
      
      mirror.textContent = input.value;
      
      let currentFontSize = baseFontSize;
      input.style.fontSize = baseFontSize + 'px';
      
      while (currentFontSize > minFontSize && mirror.offsetWidth > input.clientWidth - 12) {
        currentFontSize -= 1;
        mirror.style.fontSize = currentFontSize + 'px';
        input.style.fontSize = currentFontSize + 'px';
      }
      
      const isOverflowing = input.scrollWidth > input.clientWidth;
      
      if (isOverflowing && currentFontSize <= minFontSize) {
        activeInput = input;
        showTooltip(input.value, input);
      } else if (activeInput === input) {
        hideTooltip();
      }
    };
    
    input.addEventListener('input', adjust);
    input.addEventListener('focus', () => {
      clearTimeout(hideTimeout);
      activeInput = input;
      adjust();
    });
    input.addEventListener('blur', () => {
      if (activeInput === input) {
        hideTooltip();
        activeInput = null;
      }
    });
    
    adjust();
    
    const ro = new ResizeObserver(() => adjust());
    ro.observe(input);
    
    const origSetAttr = input.setAttribute.bind(input);
    input.setAttribute = function(name, val) {
      origSetAttr(name, val);
      if (String(name).toLowerCase() === 'value') {
        adjust();
      }
    };
    
    state.set(input, {
      adjust,
      lastValue: input.value
    });
  });
  
  (function watchValues() {
    for (const input of inputs) {
      const s = state.get(input);
      if (!s) continue;
      const v = input.value;
      if (v !== s.lastValue) {
        s.lastValue = v;
        s.adjust();
      }
    }
    requestAnimationFrame(watchValues);
  })();
}

/*************************** formatting input ***********************/

document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll("input");

  const formatter = new Intl.NumberFormat("en-US");

  inputs.forEach(input => {
    let timeout;
    let isFormatted = false;

    function unformatNumber(val) {
      return val.replace(/,/g, "");
    }

    function formatIfValid(val) {
      const raw = unformatNumber(val);
      return !isNaN(raw) && raw.trim() !== "" ? formatter.format(raw) : val;
    }

    function handleFormat() {
      const formatted = formatIfValid(input.value);
      input.value = formatted;
      isFormatted = true;
    }

    input.addEventListener("input", () => {
      clearTimeout(timeout);
      if (isFormatted) {
        input.value = unformatNumber(input.value);
        isFormatted = false;
      }
      timeout = setTimeout(handleFormat, 500);
    });

    input.addEventListener("focus", () => {
      if (isFormatted) {
        input.value = unformatNumber(input.value);
        isFormatted = false;
      }
    });

    input.addEventListener("blur", handleFormat);
  });
});

/***********************************
 Reset all inputs across containers
***********************************/
function resetCalculator() {
  const containers = document.querySelectorAll(".container");
  
  containers.forEach(container => {

    const inputs = container.querySelectorAll("input:not([readonly]):not([type='radio']):not([type='checkbox'])");
    inputs.forEach(input => {
      input.value = "";
    });
    
    const selects = container.querySelectorAll("select");
    selects.forEach(select => {
      select.selectedIndex = 0;
    });
    
    const checkboxes = container.querySelectorAll("input[type='checkbox']");
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
    
    const radioGroups = {};
    const radios = container.querySelectorAll("input[type='radio']");
    radios.forEach(radio => {
      if (!radioGroups[radio.name]) {
        radioGroups[radio.name] = radio;
      }
    });
    Object.values(radioGroups).forEach(defaultRadio => {
      defaultRadio.checked = true;
    });
    
    const outputs = container.querySelectorAll("input[readonly], .result, .output");
    outputs.forEach(output => {
      if (output.tagName.toLowerCase() === "input") {
        output.value = "";
      } else {
        output.textContent = "";
      }
    });
    
    container.classList.add("flash-overlay", "flash");
    container.onanimationend = () => container.classList.remove("flash", "flash-overlay");
  });
  
  const tiktokCoinsResult = document.querySelector(".tiktokCoinsResult");
  if (tiktokCoinsResult) tiktokCoinsResult.innerHTML = ``;
  const tiktokDiamondsResult = document.querySelector(".tiktokDiamondsResult");
  if (tiktokDiamondsResult) tiktokDiamondsResult.innerHTML = ``;
  const riskResult = document.querySelector(".risk-insights-result");
  if (riskResult) riskResult.innerHTML = ``;
  const coffeeFeedbackResult = document.querySelector(".coffeeFeedback");
  if (coffeeFeedbackResult) coffeeFeedbackResult.innerHTML = ``;
  const fatIntakeResult = document.querySelector("#fatResults");
  if (fatIntakeResult) fatIntakeResult.innerHTML = ``;
  const gfrResult = document.querySelector(".gfr-result-box");
  if (gfrResult) gfrResult.innerHTML = ``;
  const foilResult = document.querySelector(".foil-results");
  if (foilResult) foilResult.innerHTML = ``;
  const resultdiv = document.querySelector("#resultdiv");
  if (resultdiv) resultdiv.innerHTML = ``;
  const roiResult = document.querySelector(".roi-results");
  if (roiResult) roiResult.innerHTML = ``;
  const rentResult = document.querySelector("#rent-output");
  if (rentResult) rentResult.innerHTML = ``;
  const interestRateResult = document.querySelector(".interest-rate-results");
  if (interestRateResult) interestRateResult.innerHTML = ``;
  const ageResult = document.querySelector("#ageResult");
  if (ageResult) ageResult.innerHTML = ``;
  const bondPriceResults = document.querySelector(".bond-price-results");
  if (bondPriceResults) bondPriceResults.innerHTML = ``;
  const seedRateResult = document.querySelector(".seed-rate-results");
  if (seedRateResult) seedRateResult.innerHTML = ``;
  const bagFootPrintResult = document.querySelector(".bag-footprint-result");
  if (bagFootPrintResult) bagFootPrintResult.innerHTML = ``;
  
  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach(msg => msg.remove());
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/********** options box***********/
let activeBox = null;
let activeIcon = null;
let isRemoving = false;
let overlayForExpandedOpt = null;

document.querySelectorAll('#expanded-input-option-svg, .expanded-input-option-svg').forEach(icon => {
  icon.addEventListener('click', function(e) {
    e.stopPropagation();

    if (isRemoving) return;

    if (activeIcon === this) {
      removeBox();
      return;
    }

    if (activeBox) {
      isRemoving = true;
      removeBox(() => {
        showBox(this);
        isRemoving = false;
      });
    } else {
      showBox(this);
    }
  });
});

function showBox(icon) {
  overlayForExpandedOpt = document.createElement('div');
  overlayForExpandedOpt.className = 'overlay-blocker';
  document.body.appendChild(overlayForExpandedOpt);

  const group = icon.closest('.input-group');
  const box = group?.querySelector('.input-options');
  if (!box) return;

  const parent = box.offsetParent || document.body;
  const iconRect = icon.getBoundingClientRect();
  const parentRect = parent.getBoundingClientRect();

  const GAP = 8;

  const top = iconRect.bottom - parentRect.top + GAP;
  let left = iconRect.right - parentRect.left - (box.offsetWidth || 250);

  const parentWidth = (parent === document.body || parent === document.documentElement) ?
    window.innerWidth :
    parent.clientWidth;

  const maxLeft = Math.max(0, parentWidth - (box.offsetWidth || 250) - 8);
  left = Math.min(Math.max(8, left), maxLeft);

  box.style.top = `${Math.round(top)}px`;
  box.style.left = `${Math.round(left)}px`;

  requestAnimationFrame(() => box.classList.add('show'));
  icon.classList.add('rotated');

  activeBox = box;
  activeIcon = icon;

  overlayForExpandedOpt.addEventListener('click', removeBox);
}

function removeBox(callback) {
  if (overlayForExpandedOpt) {
    overlayForExpandedOpt.removeEventListener('click', removeBox);
    overlayForExpandedOpt.remove();
    overlayForExpandedOpt = null;
  }

  if (activeBox) {
    activeBox.classList.remove('show');
    if (activeIcon) activeIcon.classList.remove('rotated');

    setTimeout(() => {
      activeBox = null;
      activeIcon = null;
      if (typeof callback === 'function') callback();
    }, 300);
  } else if (typeof callback === 'function') {
    callback();
  }
}

document.addEventListener('click', function(e) {
  if (
    activeBox &&
    !activeBox.contains(e.target) &&
    (!activeIcon || !activeIcon.contains(e.target)) &&
    e.target !== overlayForExpandedOpt
  ) {
    removeBox();
  }
});

/******** options features ********/  
  
document.addEventListener("DOMContentLoaded", () => {  
  document.querySelectorAll(".input-group").forEach(group => {  
    const inputId    = group.dataset.inputId;  
    const saveToggle = group.querySelector('input[data-role="save-toggle"]');  
    const optionsBox = group.querySelector(".input-options");  
    const expandBtn  = group.querySelector(".expanded-input-option-svg");  
  
    function getMainLabel(g) {  
      const labels = g.querySelectorAll("label");  
      for (const lb of labels) if (lb.querySelector(".expanded-input-option-svg")) return lb;  
      return labels[0] || null;  
    }  
    const mainLabel = getMainLabel(group);  
    if (!saveToggle || !mainLabel) return;  
  
    const indicatorSVG = `<svg class="indicate-save-inputs-svg" xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#1f1f1f" style="margin-left:6px; vertical-align:middle;"><path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z"/></svg>`;  
  
    function updateLabelIndicator() {  
      const existing = mainLabel.querySelector(".indicate-save-inputs-svg");  
      if (existing) existing.remove();  
      if (saveToggle.checked) mainLabel.insertAdjacentHTML("beforeend", indicatorSVG);  
    }  
  
    function getLabelText() {  
      const txt = Array.from(mainLabel.childNodes).find(n => n.nodeType === Node.TEXT_NODE);  
      return (txt ? txt.textContent : mainLabel.textContent).trim();  
    }  
    function setLabelText(str) {  
      let txt = Array.from(mainLabel.childNodes).find(n => n.nodeType === Node.TEXT_NODE);  
      if (!txt) {  
        txt = document.createTextNode("");  
        mainLabel.insertBefore(txt, mainLabel.firstChild);  
      }  
      txt.textContent = (str || "").trim() + " ";  
    }  
  
    const inputs = Array.from(group.querySelectorAll("input, textarea, select"))  
      .filter(el => el !== saveToggle && !el.closest(".input-options"));  
  
    function keyFor(el, index) {  
      return el.dataset.persistKey || el.name || el.id || `${el.tagName.toLowerCase()}:${el.type || ""}#${index}`;  
    }  
  
    function readValue(el) {  
      if (el.type === "checkbox") return { t: "cb", v: el.checked };  
      if (el.type === "radio")    return { t: "radio", name: el.name, v: el.checked ? el.value : null };  
      if (el.tagName === "SELECT" && el.multiple) {  
        return { t: "select-multi", v: Array.from(el.selectedOptions).map(o => o.value) };  
      }  
      return { t: "val", v: el.value };  
    }  
  
    function applyValue(el, rec, allValues) {  
      if (!rec) return;  
      switch (rec.t) {  
        case "cb":  
          el.checked = !!rec.v;  
          break;  
        case "radio":  
          if (!rec.name) break;  
          {  
            const radios = group.querySelectorAll(`input[type="radio"][name="${CSS.escape(rec.name)}"]`);  
            radios.forEach(r => { r.checked = (r.value === rec.v); });  
          }  
          break;  
        case "select-multi":  
          if (!Array.isArray(rec.v)) break;  
          Array.from(el.options).forEach(opt => { opt.selected = rec.v.includes(opt.value); });  
          break;  
        default:  
          el.value = rec.v ?? "";  
      }  
    }  
  
    function persistAllInputs() {  
      if (!saveToggle.checked) return;  
      const payload = { fields: {}, radios: {} };  
  
      inputs.forEach((el, i) => {  
        if (el.type === "radio") {  
          if (!el.name) return;  
          if (!(el.name in payload.radios)) {  
            const checked = group.querySelector(`input[type="radio"][name="${CSS.escape(el.name)}"]:checked`);  
            payload.radios[el.name] = checked ? checked.value : null;  
          }  
        } else {  
          payload.fields[keyFor(el, i)] = readValue(el);  
        }  
      });  
  
      payload.fields["radios"] = { t: "radios", v: payload.radios };  
      localStorage.setItem(`value-${inputId}`, JSON.stringify(payload));  
    }  
  
    function restoreAllInputs() {  
      if (!saveToggle.checked) return;  
      const raw = localStorage.getItem(`value-${inputId}`);  
      if (!raw) return;  
      try {  
        const payload = JSON.parse(raw) || {};  
        const fields = payload.fields || {};  
        const radios = (fields["radios"] && fields["radios"].v) || {};  
  
        inputs.forEach((el, i) => {  
          if (el.type === "radio") {  
            if (!el.name) return;  
            const want = radios[el.name];  
            el.checked = (el.value === want);  
          } else {  
            applyValue(el, fields[keyFor(el, i)], fields);  
          }  
        });  
  
      } catch (e) {  
        console.warn("restoreAllInputs failed", e);  
      }  
    }  
  
    const savedToggle = localStorage.getItem(`save-${inputId}`);  
    if (savedToggle === "1") saveToggle.checked = true;  
    else if (savedToggle === "0") saveToggle.checked = false;  
  
    const savedLabel = localStorage.getItem(`label-${inputId}`);  
    if (savedLabel) setLabelText(savedLabel);  
  
    restoreAllInputs();  
    updateLabelIndicator();  
  
    saveToggle.addEventListener("change", () => {  
      localStorage.setItem(`save-${inputId}`, saveToggle.checked ? "1" : "0");  
      if (!saveToggle.checked) {  
        localStorage.removeItem(`value-${inputId}`);  
      } else {  
        persistAllInputs();  
      }  
      updateLabelIndicator();  
    });  
  
    inputs.forEach(el => {  
      ["input","change","blur","keyup","paste","cut","drop"].forEach(ev =>  
        el.addEventListener(ev, persistAllInputs)  
      );  
    });  
  
    inputs.forEach(el => {  
      const proto = Object.getPrototypeOf(el);  
      const vDesc = proto && Object.getOwnPropertyDescriptor(proto, "value");  
      if (vDesc && vDesc.configurable && typeof vDesc.set === "function") {  
        Object.defineProperty(el, "value", {  
          configurable: true,  
          enumerable: vDesc.enumerable,  
          get() { return vDesc.get.call(this); },  
          set(v) { vDesc.set.call(this, v); Promise.resolve().then(persistAllInputs); }  
        });  
      }  
  
      if (el.type === "checkbox" || el.type === "radio") {  
        const cDesc = proto && Object.getOwnPropertyDescriptor(proto, "checked");  
        if (cDesc && cDesc.configurable && typeof cDesc.set === "function") {  
          Object.defineProperty(el, "checked", {  
            configurable: true,  
            enumerable: cDesc.enumerable,  
            get() { return cDesc.get.call(this); },  
            set(v) { cDesc.set.call(this, v); Promise.resolve().then(persistAllInputs); }  
          });  
        }  
      }  
  
      const origSetAttr = el.setAttribute.bind(el);  
      el.setAttribute = function(name, val) {  
        origSetAttr(name, val);  
        const n = String(name).toLowerCase();  
        if (n === "value" || n === "checked" || n === "selected") {  
          Promise.resolve().then(persistAllInputs);  
        }  
      };  
  
      const mo = new MutationObserver(() => persistAllInputs());  
      mo.observe(el, { attributes: true, attributeFilter: ["value","checked","selected","aria-checked"] });  
    });  
  
    group.querySelectorAll(".input-options-item").forEach(option => {  
      option.addEventListener("click", async () => {  
        const action = option.dataset.action;  
        if (!action) return;  
  
        switch (action) {  
          case "reset":  
            inputs.forEach(el => {  
              if (el.type === "text" || el.type === "number") {  
                el.value = "";  
              } else {  
                return;  
              }  
            });  
  
            localStorage.removeItem(`value-${inputId}`);  
            saveToggle.checked = false;  
            localStorage.setItem(`save-${inputId}`, "0");  
            updateLabelIndicator();  
            break;  
  
          case "rename":  
            const current = getLabelText();  
            const newName = prompt("Enter new label name:", current);  
            if (newName && newName.trim()) {  
              setLabelText(newName.trim());  
              localStorage.setItem(`label-${inputId}`, newName.trim());  
            }  
            break;  
  
          case "copy":  
            const firstTextInput = group.querySelector('input[type="text"]');  
            if (firstTextInput) {  
              try {  
                await navigator.clipboard.writeText(firstTextInput.value || "");  
              } catch (e) {  
                console.warn("Clipboard copy failed:", e);  
              }  
            }  
            break;  
  
          case "paste":  
            const pasteTarget = group.querySelector('input[type="text"]');  
  
            if (pasteTarget) {  
              try {  
                const clipText = await navigator.clipboard.readText();  
                pasteTarget.value = clipText;  
                pasteTarget.dispatchEvent(new Event("input", { bubbles: true }));  
              } catch (e) {  
                console.warn("Clipboard read failed:", e);  
              }  
            }  
            break;  
        }  
  
        if (optionsBox) optionsBox.classList.remove("show");  
        if (expandBtn)  expandBtn.classList.remove("rotated");  
      });  
    });  
  
  });  
});

/********* flash results  ******/
(function() {
  const timers = new WeakMap();
  const formattingInProgress = new WeakSet();

  // How long after script start to ignore programmatic "result" flashes (ms)
  const IGNORE_MS_AFTER_SCRIPT = 800;

  // Timestamp until which programmatic changes should NOT trigger markResult/flash.
  // This is set at script start and slightly extended on window 'load'.
  let ignoreProgrammaticUntil = (typeof performance !== 'undefined' ? performance.now() : Date.now()) + IGNORE_MS_AFTER_SCRIPT;

  // When the page fully loads, also extend ignore window slightly to cover load-time mutations.
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      // Give a tiny grace after load handlers (50ms) so load-time programmatic changes are ignored.
      const now = (typeof performance !== 'undefined' ? performance.now() : Date.now());
      ignoreProgrammaticUntil = Math.max(ignoreProgrammaticUntil, now + 50);
    }, { passive: true });
  }

  function isInInitialIgnoreWindow() {
    const now = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    return now < ignoreProgrammaticUntil;
  }

  function clearFlash(el) {
    if (timers.has(el)) {
      clearTimeout(timers.get(el));
      timers.delete(el);
    }
    el.classList.remove('flashResult');
  }

  function flash(el) {
    if (timers.has(el)) clearTimeout(timers.get(el));
    el.classList.add('flashResult');
    timers.set(el, setTimeout(() => {
      el.classList.remove('flashResult');
      timers.delete(el);
    }, 400));
  }

  function markResult(el) {
    el.classList.add('result');
    flash(el);
  }

  function formatWithCommas(v) {
    if (v == null) return '';
    const s = String(v).replace(/,/g, '').trim();
    if (s === '') return '';

    if (s === '.') return '.';
    const parts = s.split('.');
    const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if (parts.length > 1) return intPart + '.' + parts.slice(1).join('.');
    return intPart;
  }

  function underlyingEqual(a, b) {
    const sa = (a == null) ? '' : String(a).replace(/,/g, '').trim();
    const sb = (b == null) ? '' : String(b).replace(/,/g, '').trim();

    const na = parseFloat(sa);
    const nb = parseFloat(sb);
    if (!isNaN(na) && !isNaN(nb)) return na === nb;

    return sa === sb;
  }

  if (!window.__valueSetterPatched) {
    window.__valueSetterPatched = true;
    const patch = (Ctor) => {
      if (!Ctor) return;
      const d = Object.getOwnPropertyDescriptor(Ctor.prototype, 'value');
      if (!d || !d.configurable) return;
      Object.defineProperty(Ctor.prototype, 'value', {
        get: d.get,
        set: function(v) {
          const old = d.get.call(this);
          d.set.call(this, v);
          if (old !== v) {
            this.dispatchEvent(new CustomEvent('value-set', {
              bubbles: true,
              detail: { old, value: v }
            }));
          }
        }
      });
    };
    patch(HTMLInputElement);
    patch(HTMLTextAreaElement);
    patch(HTMLSelectElement);
  }

  function wire(el) {
    if (el.dataset.flashWired) return;
    el.dataset.flashWired = '1';

    if (el.matches('input, textarea, select')) {

      el.addEventListener('value-set', (ev) => {
  
  if (formattingInProgress.has(el)) {
    // This value-set came from our own formatting; consume and ignore.
    formattingInProgress.delete(el);
    return;
  }
  
  // Prefer the element's actual reported value for "new".
  const oldRaw = (ev && ev.detail && typeof ev.detail.old === 'string') ? ev.detail.old : '';
  const newRaw = el.value; // element is the source of truth
  
  const underlyingChanged = !underlyingEqual(oldRaw, newRaw);
  
  // If this is a date/time/month/week/datetime-local input, DO NOT run number formatting.
  const isDateLike = ['date', 'time', 'month', 'week', 'datetime-local'].includes(el.type);
  
  if (!isDateLike) {
    // Always run formatting if needed (we want consistent display even during initial ignore).
    const formatted = formatWithCommas(newRaw);
    if (formatted !== newRaw) {
      formattingInProgress.add(el);
      el.value = formatted;
    }
  }
  
  // Only mark/flashing results if we're NOT inside the initial ignore window.
  if (underlyingChanged && !isInInitialIgnoreWindow()) {
    markResult(el);
  }
});

      el.addEventListener('focus', () => {
        el.classList.remove('result');
        clearFlash(el);
      }, { passive: true });

    } else {

      const mo = new MutationObserver(() => {
        // Ignore mutation flashes during initial load-time window.
        if (isInInitialIgnoreWindow()) return;
        markResult(el);
      });
      mo.observe(el, { childList: true, characterData: true, subtree: true });
    }
  }

  document.querySelectorAll('input, textarea, select, [data-flash-target]').forEach(wire);

  const addObserver = new MutationObserver(() => {
    document.querySelectorAll('input:not([data-flash-wired]), textarea:not([data-flash-wired]), select:not([data-flash-wired]), [data-flash-target]:not([data-flash-wired])')
      .forEach(wire);
  });
  addObserver.observe(document.documentElement, { childList: true, subtree: true });
})();




/*************************************** long press to copy  tooltip *******************************/
 
 document.addEventListener("DOMContentLoaded", () => {
  enableLongPressCopy(".input-tooltip-float", 600);
});

function enableLongPressCopy(selector, holdTime = 600) {
  const tooltips = document.querySelectorAll(selector);
  let pressTimer;
  
  tooltips.forEach(tooltip => {
    tooltip.addEventListener("mousedown", startPress);
    tooltip.addEventListener("touchstart", startPress);
    
    tooltip.addEventListener("mouseup", cancelPress);
    tooltip.addEventListener("mouseleave", cancelPress);
    tooltip.addEventListener("touchend", cancelPress);
    tooltip.addEventListener("touchcancel", cancelPress);
    
    function startPress(e) {
      e.preventDefault();
      pressTimer = setTimeout(() => copyTooltipValue(tooltip), holdTime);
    }
    
    function cancelPress() {
      clearTimeout(pressTimer);
    }
  });
}

function copyTooltipValue(tooltip) {
  const textToCopy = tooltip.innerText || tooltip.textContent || tooltip.value;
  navigator.clipboard.writeText(textToCopy).catch(() => {
    console.error("Failed to copy tooltip value");
  });
}


/****************************

message handling
***************************/
function showMessage(message, state = "error") {
  // Remove existing message if any
  const existing = document.querySelector('.message-toast');
  if (existing) existing.remove();
  
  
  // Create message container
  const toast = document.createElement('div');
  toast.classList.add('message-toast', state);
  
  // Message text
  const text = document.createElement('span');
  text.textContent = message;
  
  // Close button (SVG)
  const closeBtn = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  closeBtn.setAttribute("viewBox", "0 0 24 24");
  closeBtn.id = "closetoast";
  closeBtn.innerHTML = '<path d="M18 6 L6 18 M6 6 L18 18" stroke="white" stroke-width="2" stroke-linecap="round"/>';
  closeBtn.addEventListener('click', () => fadeOut(toast));
  
  toast.appendChild(text);
  toast.appendChild(closeBtn);
  document.body.appendChild(toast);
  
  // Fade in
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });
  
  // Timing logic
  let duration = 4000; // total ms
  let startTime = Date.now();
  let remaining = duration;
  let autoFade = setTimeout(() => fadeOut(toast), remaining);
  
  // Pause function
  function pauseTimer() {
    clearTimeout(autoFade);
    remaining -= Date.now() - startTime;
  }
  
  // Resume function
  function resumeTimer() {
    startTime = Date.now();
    autoFade = setTimeout(() => fadeOut(toast), remaining);
  }
  
  // Listen for hold/click pause & resume
  toast.addEventListener("mousedown", pauseTimer);
  toast.addEventListener("touchstart", pauseTimer);
  
  toast.addEventListener("mouseup", resumeTimer);
  toast.addEventListener("mouseleave", resumeTimer);
  toast.addEventListener("touchend", resumeTimer);
  
  function fadeOut(element) {
    element.classList.remove('show');
    element.addEventListener('transitionend', () => element.remove(), { once: true });
  }
}

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

/*************** handle sources and references section       *****************/

(function () {
  const btn = document.querySelector(".calculation-sources");
  const arrow = document.getElementById("open-sources-svg");
  const listWrap = document.querySelector(".sources-list-wrap");
  const list = document.querySelector(".sources-list");
  const numberNode = document.querySelector(".number-of-source");

  if (!btn || !listWrap || !list || !numberNode) return;

  // initialize: hidden by default
  listWrap.hidden = true;
  listWrap.classList.remove('open');
  btn.setAttribute('aria-expanded', 'false');

  // update source count text
  function updateNumber() {
    const count = list.querySelectorAll("li").length;
    numberNode.textContent = count === 1 ? "1 source" : `${count} sources`;
  }
  updateNumber();

  // open with smooth animation (use explicit height to animate)
  function openList() {
    if (!listWrap.hidden) return;
    listWrap.hidden = false;
    // set explicit small height first so transition has a start
    listWrap.style.maxHeight = '0px';
    // Allow browser to paint
    requestAnimationFrame(() => {
      const full = list.scrollHeight + 24; // add small padding so content not clipped
      listWrap.style.transition = 'max-height 320ms ease, opacity 220ms ease';
      listWrap.style.maxHeight = full + 'px';
      listWrap.style.opacity = '1';
      listWrap.classList.add('open');
      arrow.style.transform = 'rotate(-180deg)';
      btn.setAttribute('aria-expanded', 'true');
    });

    // cleanup after transition to allow responsive height
    listWrap.addEventListener('transitionend', function handler(e) {
      if (e.propertyName === 'max-height') {
        listWrap.style.maxHeight = 'none'; // allow natural height
        listWrap.style.transition = '';
        listWrap.removeEventListener('transitionend', handler);
      }
    });
  }

  // close with smooth animation
  function closeList() {
    if (listWrap.hidden) return;
    // from 'auto' height -> need to set explicit pixel height first
    const cur = listWrap.scrollHeight + 24;
    listWrap.style.maxHeight = cur + 'px';
    // force reflow
    // eslint-disable-next-line no-unused-expressions
    listWrap.offsetHeight;

    requestAnimationFrame(() => {
      listWrap.style.transition = 'max-height 260ms ease, opacity 180ms ease';
      listWrap.style.maxHeight = '0px';
      listWrap.style.opacity = '0';
      listWrap.classList.remove('open');
      arrow.style.transform = 'rotate(0deg)';
      btn.setAttribute('aria-expanded', 'false');
    });

    listWrap.addEventListener('transitionend', function handler(e) {
      if (e.propertyName === 'max-height') {
        listWrap.hidden = true;
        listWrap.style.transition = '';
        listWrap.style.maxHeight = '';
        listWrap.removeEventListener('transitionend', handler);
      }
    });
  }

  function toggleList() {
    if (listWrap.hidden) openList(); else closeList();
  }

  // click handler
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    toggleList();
  });

  // keyboard: Enter/Space toggles, Escape closes
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleList();
    } else if (e.key === 'Escape') {
      closeList();
      btn.focus();
    }
  });

  // click outside to close
  document.addEventListener('click', (e) => {
    if (!listWrap.hidden && !btn.contains(e.target) && !listWrap.contains(e.target)) {
      closeList();
    }
  });

  // expose update function in case you want to change items dynamically
  window.updateSourcesList = function(items) {
    if (!Array.isArray(items)) return;
    const html = items.map(it => `<li>${it}</li>`).join('');
    list.innerHTML = html;
    updateNumber();
    // close when updated to avoid awkward open heights
    closeList();
  };
})();

/***************************************/

/******************* read more or less ******************/

 (function() {
   if(document.getElementById('categoryText')){
   const text = document.getElementById('categoryText');
   const btn = document.getElementById('toggleBtn');
   const btnText = document.getElementById('btnText');
   const storageKey = 'categoryTextExpanded_v1';
   
   function updateButton(expanded) {
     btn.setAttribute('aria-expanded', expanded);
     btnText.textContent = expanded ? 'Read less' : 'Read more';
   }
   
   function setExpanded(expanded, save = true) {
     if (expanded) text.classList.add('expanded');
     else text.classList.remove('expanded');
     updateButton(expanded);
     if (save) localStorage.setItem(storageKey, expanded ? '1' : '0');
   }
   
   function needsToggle() {

     const clone = text.cloneNode(true);
     clone.style.position = 'absolute';
     clone.style.visibility = 'hidden';
     clone.style.display = 'block';
     clone.classList.remove('clamped');
     clone.classList.remove('expanded');
     document.body.appendChild(clone);
     const fullH = clone.getBoundingClientRect().height;
     document.body.removeChild(clone);
     const visibleH = text.getBoundingClientRect().height;
     return fullH > (visibleH + 1);
   }
   
   btn.addEventListener('click', () => {
     setExpanded(!text.classList.contains('expanded'));
   });
   
   window.addEventListener('DOMContentLoaded', () => {
     try {
       if (!needsToggle()) {
         btn.classList.add('hidden');
         return;
       }
       const saved = localStorage.getItem(storageKey);
       if (saved === '1') setExpanded(true, false);
     } catch (e) {
       console.warn('Read more measurement failed', e);
     }
   });
}else return })();

/************* pwa install drawer ******************/

(function () {

  const STORAGE_KEY = 'pwa_install_dont_show_again_v1';
  const DRAWER_BASE = 'calcluloPwaDrawer';
  let deferredInstallPrompt = null;
  let isDrawerOpen = false;
  let activeContainer = null; 
  let dragState = null; 
  let savedScrollY = 0; 

  const savedBodyStyles = { position: '', top: '', left: '', right: '', width: '' };
  const savedHtmlOverflow = '';

  function isRunningAsPWA() {
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) return true;
    if (window.navigator.standalone === true) return true;
    if (document.referrer && document.referrer.startsWith('android-app://')) return true;
    return false;
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    maybeShowDrawer();
  });

  document.addEventListener('click', (e) => {
    if (!isDrawerOpen || !activeContainer) return;
    const drawer = activeContainer.querySelector('.calclulo-pwa-drawer');
    const backdrop = activeContainer.querySelector('.calclulo-pwa-backdrop');
    const path = (e.composedPath && e.composedPath()) || (e.path || []);
    if (path.indexOf(drawer) === -1 && path.indexOf(backdrop) === -1) {
      startCloseFlow();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!isDrawerOpen) return;
    if (e.key === 'Escape' || e.key === 'Esc') startCloseFlow();
  });

  window.addEventListener('appinstalled', () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    startCloseFlow();
  });

  function injectStyles() {
    if (document.getElementById(DRAWER_BASE + 'Styles')) return;
    const css = `
      .calclulo-pwa-container {
      user-select: none;
      display: none; }
      .calclulo-pwa-backdrop {
        position: fixed; inset: 0;
        background: rgba(0,0,0,0.45);
        opacity: 0; transition: opacity 260ms ease; z-index: 9998; pointer-events: none;
        -webkit-tap-highlight-color: transparent;
      }
      .calclulo-pwa-backdrop.visible { opacity: 1; pointer-events: auto; }
      .calclulo-pwa-drawer {
        position: fixed; left: 0; right: 0; bottom: 0;
        transform: translateY(110%);
        transition: transform 360ms cubic-bezier(.2,.9,.2,1);
        z-index: 9999; will-change: transform; max-width: 720px; margin: 0 auto;
        border-top-left-radius: 12px; border-top-right-radius: 12px;
        box-shadow: 0 -12px 30px rgba(2,6,23,0.35);
        background: linear-gradient(180deg, #ffffff, #fbfbfb);
        padding: 18px; box-sizing: border-box;
        touch-action: none;
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;
      }
      .calclulo-pwa-drawer.visible { transform: translateY(0); }
      .calclulo-pwa-handle { width: 36px; height: 4px; background: rgba(0,0,0,0.2); border-radius: 4px; margin: 0 auto 12px; }
      .calclulo-pwa-content { display: flex; gap: 12px; align-items: center; }
      .calclulo-pwa-info { flex: 1 1 auto; }
      .calclulo-pwa-title { font-weight: 700; font-size: 1.05rem; margin: 0 0 6px;
      font-family: lexend;}
      .calclulo-pwa-desc { margin: 0; font-size: 0.95rem; color: #42445AED;
      margin-top: 10px;
      margin-bottom: 10px;
      line-height: 1.7;
      }
      .calclulo-pwa-actions { display: flex; gap: 10px; margin-top: 14px; justify-content: flex-end; }
      .calclulo-btn { min-width: 120px; padding: 10px 14px; border-radius: 10px; font-weight: 400; border: none; font-size: 0.95rem;
      font-family: young;
        transition: .2s;
      }
      .calclulo-btn.primary { background: #464BFF; color: white; box-shadow: 0 6px 18px rgba(29,123,237,0.24); }
      .calclulo-btn.primary:hover{
        background: #2F32B5;
      }
      .calclulo-btn.primary:active {
        
      }
      
      .calclulo-btn.ghost { background: transparent; color: #333; }
      .calclulo-btn.ghost:active { background: #42445A26 }
      @media (min-width: 640px) {
        .calclulo-pwa-drawer { left: auto; right: auto; bottom: 20px; width: calc(100% - 40px); max-width: 640px; }
      }
    `;
    const s = document.createElement('style');
    s.id = DRAWER_BASE + 'Styles';
    s.appendChild(document.createTextNode(css));
    document.head.appendChild(s);
  }

  function buildDrawer() {
    const container = document.createElement('div');
    container.id = DRAWER_BASE + '-container';
    container.className = 'calclulo-pwa-container';

    const backdrop = document.createElement('div');
    backdrop.className = 'calclulo-pwa-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');

    const drawer = document.createElement('div');
    drawer.id = DRAWER_BASE;
    drawer.className = 'calclulo-pwa-drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-label', 'Install app');

    const handle = document.createElement('div'); handle.className = 'calclulo-pwa-handle';
    const content = document.createElement('div'); content.className = 'calclulo-pwa-content';
    const info = document.createElement('div'); info.className = 'calclulo-pwa-info';
    const title = document.createElement('h3'); title.className = 'calclulo-pwa-title'; title.textContent = 'Install our app';
    const desc = document.createElement('p'); desc.className = 'calclulo-pwa-desc'; desc.textContent = 'Add this app to your home screen for a native experience';
    info.appendChild(title); info.appendChild(desc); content.appendChild(info);

    const actions = document.createElement('div'); actions.className = 'calclulo-pwa-actions';
    const dontShowBtn = document.createElement('button'); dontShowBtn.className = 'calclulo-btn ghost';
    dontShowBtn.type = 'button'; dontShowBtn.textContent = "Don't show this again";
    dontShowBtn.addEventListener('click', () => {
      localStorage.setItem(STORAGE_KEY, 'true');
      startCloseFlow();
    });

    const installBtn = document.createElement('button'); installBtn.className = 'calclulo-btn primary';
    installBtn.id ="pwaInstallButton";
    installBtn.type = 'button'; installBtn.textContent = 'Install';
    installBtn.addEventListener('click', async () => {
      if (deferredInstallPrompt) {
        try {
          deferredInstallPrompt.prompt();
          await deferredInstallPrompt.userChoice;
          startCloseFlow();
          deferredInstallPrompt = null;
          return;
        } catch (err) {
          console.warn('install prompt failed', err);
        }
      }
      startCloseFlow();
      showIosInstallHelp();
    });

    actions.appendChild(dontShowBtn);
    actions.appendChild(installBtn);

    drawer.appendChild(handle);
    drawer.appendChild(content);
    drawer.appendChild(actions);
    container.appendChild(backdrop);
    container.appendChild(drawer);

    let drawerHeight = 0;
    function ensureDrawerHeight() { drawerHeight = drawer.getBoundingClientRect().height; }

    function onPointerDown(e) {
      if (e.button && e.button !== 0) return;
      ensureDrawerHeight();
      dragState = {
        startY: e.clientY,
        currentY: e.clientY,
        startedAt: performance.now(),
        pointerId: e.pointerId || null
      };
      drawer.style.transition = 'none';
      try { drawer.setPointerCapture && drawer.setPointerCapture(e.pointerId); } catch (_) {}
    }

    function onPointerMove(e) {
      if (!dragState) return;
      if (dragState.pointerId != null && e.pointerId !== dragState.pointerId) return;
      dragState.currentY = e.clientY;
      const dy = Math.max(0, dragState.currentY - dragState.startY);
      drawer.style.transform = `translateY(${dy}px)`;
      const p = Math.min(1, dy / (drawerHeight || 300));
      backdrop.style.opacity = String(1 - p * 0.95);
    }

    function onPointerUp(e) {
      if (!dragState) return;
      if (dragState.pointerId != null && e.pointerId !== dragState.pointerId) {
        dragState = null; return;
      }
      const dy = Math.max(0, dragState.currentY - dragState.startY);
      const dt = Math.max(1, performance.now() - dragState.startedAt);
      const velocity = (dragState.currentY - dragState.startY) / dt;
      const shouldClose = (dy > (drawerHeight * 0.35 || 120)) || (velocity > 0.5);

      drawer.style.transition = '';
      backdrop.style.transition = '';

      if (shouldClose) {

        drawer.style.transform = `translateY(110%)`;
        backdrop.style.opacity = '0';

        restorePageScrollImmediately();

        setTimeout(() => startCloseFlow(), 20);
      } else {

        drawer.style.transform = '';
        backdrop.style.opacity = '';
      }

      try { drawer.releasePointerCapture && drawer.releasePointerCapture(e.pointerId); } catch (_) {}
      dragState = null;
    }

    drawer.addEventListener('pointerdown', onPointerDown);
    drawer.addEventListener('pointermove', onPointerMove);
    drawer.addEventListener('pointerup', onPointerUp);
    drawer.addEventListener('pointercancel', onPointerUp);
    drawer.addEventListener('lostpointercapture', () => { dragState = null; });

    backdrop.addEventListener('click', () => startCloseFlow());

    return container;
  }

  function openDrawer() {
    setTimeout(() => {
    if (window.innerWidth >= 768 || document.querySelector(".cookie-wrapper")?.classList.contains("show") || document.querySelector(".calclulo-trustpilot-drawer")?.classList.contains("visible")) return;
    
    setTimeout(() => {
    if (isDrawerOpen) return;
    injectStyles();
    activeContainer = buildDrawer();
    document.body.appendChild(activeContainer);

    const container = activeContainer;
    const backdrop = container.querySelector('.calclulo-pwa-backdrop');
    const drawer = container.querySelector('.calclulo-pwa-drawer');

    container.style.display = 'block';

    savedScrollY = window.scrollY || window.pageYOffset || 0;
    savedBodyStyles.position = document.body.style.position || '';
    savedBodyStyles.top = document.body.style.top || '';
    savedBodyStyles.left = document.body.style.left || '';
    savedBodyStyles.right = document.body.style.right || '';
    savedBodyStyles.width = document.body.style.width || '';
    const prevHtmlOverflow = document.documentElement.style.overflow || '';

    document.body.style.position = 'fixed';
    document.body.style.top = `-${savedScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.documentElement.style.overflow = 'hidden';

    drawer.style.transform = 'translateY(110%)';
    drawer.classList.remove('visible');
    backdrop.style.opacity = '0';
    backdrop.classList.remove('visible');

    container.offsetHeight;
    
    requestAnimationFrame(() => {
      backdrop.classList.add('visible');
      drawer.classList.add('visible');

      setTimeout(() => {
        drawer.style.transform = '';
        backdrop.style.opacity = '';
      }, 10);
    });

    isDrawerOpen = true;
    },15000);
  },5000);
  }

  function startCloseFlow() {
    if (!activeContainer) return;
    if (!isDrawerOpen) {

      restorePageScrollImmediately();
      removeContainerIfExists();
      return;
    }
    const container = activeContainer;
    const backdrop = container.querySelector('.calclulo-pwa-backdrop');
    const drawer = container.querySelector('.calclulo-pwa-drawer');

    backdrop.classList.remove('visible');
    drawer.classList.remove('visible');

    restorePageScrollImmediately();

    const onEnd = (ev) => {
      if (ev && ev.target !== drawer) return;
      drawer.removeEventListener('transitionend', onEnd);
      removeContainerIfExists();
    };
    drawer.addEventListener('transitionend', onEnd);
    setTimeout(() => {
      if (document.body.contains(container)) removeContainerIfExists();
    }, 700);
  }

  function restorePageScrollImmediately() {
    try {
      document.body.style.position = savedBodyStyles.position || '';
      document.body.style.top = savedBodyStyles.top || '';
      document.body.style.left = savedBodyStyles.left || '';
      document.body.style.right = savedBodyStyles.right || '';
      document.body.style.width = savedBodyStyles.width || '';
      
      document.documentElement.style.overflow = '';

      window.scrollTo(0, savedScrollY || 0);
    } catch (err) {
      
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.documentElement.style.overflow = '';
    }
  }


  function removeContainerIfExists() {
    if (!activeContainer) return;
    try {
      if (activeContainer.parentNode) activeContainer.parentNode.removeChild(activeContainer);
    } catch (err) {
      console.warn('Error removing drawer container', err);
    } finally {
      activeContainer = null;
      isDrawerOpen = false;
      dragState = null;
    }
  }

  function showIosInstallHelp() {
    if (/iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase())) {
      setTimeout(() => {
        alert('To install this app on iOS: tap the Share button then choose Add to Home Screen.');
      }, 200);
    } else {
      setTimeout(() => {
        alert('Your browser does not support the automated install prompt. If you want to install, look for "Add to home screen" in your browser menu.');
      }, 200);
    }
  }

  function shouldShowDrawer() {
    if (isRunningAsPWA()) return false;
    if (localStorage.getItem(STORAGE_KEY) === 'true') return false;
    return true;
  }

  function maybeShowDrawer() {
    if (!shouldShowDrawer()) return;
    injectStyles();
    setTimeout(openDrawer, 520);
  }

  window.CalcluloPwaDrawer = {
    open: () => { if (shouldShowDrawer()) maybeShowDrawer(); },
    close: () => { startCloseFlow(); },
    resetDontShow: () => { localStorage.removeItem(STORAGE_KEY); }
  };

  document.addEventListener('DOMContentLoaded', () => {
    if (isRunningAsPWA()) return;
    if (localStorage.getItem(STORAGE_KEY) === 'true') return;
    injectStyles();
    maybeShowDrawer();
  });
})();


/*********** Adsterra ads ********/
function injectAdsterra() {
  try {
    // ---- helper: create top-level script ad (body anchors) ----
    function createScriptAd(className, key, width, height) {
      const wrapper = document.createElement('div');
      wrapper.className = className;
      
      const configScript = document.createElement('script');
      configScript.type = 'text/javascript';
      configScript.text =
        "var atOptions = { 'key': '" + key + "', 'format': 'iframe', 'height': " + height + ", 'width': " + width + ", 'params': {} };";
      
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = "//www.highperformanceformat.com/" + key + "/invoke.js";
      invokeScript.async = false;
      
      wrapper.appendChild(configScript);
      wrapper.appendChild(invokeScript);
      return wrapper;
    }
    
    // ---- helper: create isolated iframe ad (for multiple inline ads) ----
    function createIframeAd(className, key, width, height) {
      const wrapper = document.createElement('div');
      wrapper.className = className;
      
      const iframe = document.createElement('iframe');
      iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
      iframe.style.border = '0';
      iframe.style.display = 'block';
      iframe.style.width = (width ? width + 'px' : '100%');
      iframe.style.height = (height ? height + 'px' : 'auto');
      iframe.scrolling = 'no';
      
      iframe.addEventListener('load', function() {
        try {
          const doc = iframe.contentDocument || iframe.contentWindow.document;
          doc.open();
          doc.write(
            '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>' +
            '<body style="margin:0;padding:0;">' +
            "<script>var atOptions = { 'key': '" + key + "', 'format': 'iframe', 'height': " + height + ", 'width': " + width + ", 'params': {} };</script>" +
            "<script src='//www.highperformanceformat.com/" + key + "/invoke.js'></script>" +
            '</body></html>'
          );
          doc.close();
        } catch (err) {
          console.error('iframe ad write error', err);
        }
      });
      
      iframe.src = 'about:blank';
      wrapper.appendChild(iframe);
      return wrapper;
    }
    
    // ---- Insert global/body ads (only if not already present) ----
    if (!document.body.querySelector('.adsterra-anchor')) {
      const anchorAd = createScriptAd('adsterra-anchor', '7bb9e23e1f2a3af8def78984ec27c5b7', 320, 50);
      document.body.appendChild(anchorAd);
    }
    
    if (!document.body.querySelector('.adsterra-anchor-fixed')) {
      const fixedAd = createScriptAd('adsterra-anchor-fixed', '7bb9e23e1f2a3af8def78984ec27c5b7', 320, 50);
      document.body.appendChild(fixedAd);
    }
    
    // ---- Inline ads inside .description-txt ----
    const container = document.querySelector('.description-txt');
    if (!container) return;
    
    // prevent re-running on same container
    if (container.dataset.adsInjected === '1') return;
    
    // Take a static snapshot of child elements and exclude any existing ad elements
    const children = Array.from(container.children).filter(el => {
      return !el.classList.contains('adsterra-inline') &&
        !el.classList.contains('adsterra-anchor') &&
        !el.classList.contains('adsterra-anchor-fixed');
    });
    
    // if not enough elements, skip
    const elementsCountStep = Math.floor(Math.random() * 2) + 4; // random 2..4
    if (children.length < elementsCountStep) {
      container.dataset.adsInjected = '1';
      return;
    }
    
    // Walk the static list and insert inline iframe ads after every random step (2..4)
    let pos = 0;
    while (true) {
      
      pos += elementsCountStep;
      if (pos >= children.length) break;
      
      const target = children[pos - 1]; // insert after the (pos)th element
      if (!target) break;
      
      const adInline = createIframeAd('adsterra-inline', 'f81dbf09c683afc118e38803230f52e9', 300, 250);
      // only tiny vertical margin as requested
      adInline.style.margin = '12px 0';
      adInline.classList = "adInLine";
      target.insertAdjacentElement('afterend', adInline);
    }
    
    // mark as injected
    container.dataset.adsInjected = '1';
    
  } catch (err) {
    console.error('injectAdsterra error:', err);
  }
}

// Run after full load
window.addEventListener('load', injectAdsterra);
/************* end Adsterra ads ***************/

/*********************************************
 currency handling 
****************************/


const currencies = [
  // --- North America ---
  { code: "USD", name: "United States Dollar", symbol: "$", sign: "US$" },
  { code: "CAD", name: "Canadian Dollar", symbol: "$", sign: "C$" },
  { code: "MXN", name: "Mexican Peso", symbol: "$", sign: "Mex$" },
  { code: "BBD", name: "Barbados Dollar", symbol: "$", sign: "Bds$" },
  { code: "BSD", name: "Bahamian Dollar", symbol: "$", sign: "B$" },
  { code: "BZD", name: "Belize Dollar", symbol: "$", sign: "BZ$" },
  { code: "BMD", name: "Bermudian Dollar", symbol: "$", sign: "BD$" },
  { code: "GTQ", name: "Guatemalan Quetzal", symbol: "Q", sign: "Q" },
  { code: "HNL", name: "Honduran Lempira", symbol: "L", sign: "L" },
  { code: "NIO", name: "Nicaraguan Córdoba", symbol: "C$", sign: "C$" },
  { code: "CRC", name: "Costa Rican Colón", symbol: "₡", sign: "₡" },
  { code: "PAB", name: "Panamanian Balboa", symbol: "B/.", sign: "B/." },
  { code: "JMD", name: "Jamaican Dollar", symbol: "$", sign: "J$" },
  { code: "TTD", name: "Trinidad and Tobago Dollar", symbol: "$", sign: "TT$" },
  { code: "DOP", name: "Dominican Peso", symbol: "$", sign: "RD$" },
  { code: "CUP", name: "Cuban Peso", symbol: "$", sign: "CUP$" },
  { code: "HTG", name: "Haitian Gourde", symbol: "G", sign: "G" },
  { code: "KYD", name: "Cayman Islands Dollar", symbol: "$", sign: "CI$" },
  
  // --- South America ---
  { code: "BRL", name: "Brazilian Real", symbol: "R$", sign: "R$" },
  { code: "ARS", name: "Argentine Peso", symbol: "$", sign: "AR$" },
  { code: "CLP", name: "Chilean Peso", symbol: "$", sign: "CL$" },
  { code: "COP", name: "Colombian Peso", symbol: "$", sign: "COL$" },
  { code: "PEN", name: "Peruvian Sol", symbol: "S/", sign: "S/." },
  { code: "UYU", name: "Uruguayan Peso", symbol: "$", sign: "UYU$" },
  { code: "PYG", name: "Paraguayan Guaraní", symbol: "₲", sign: "₲" },
  { code: "BOB", name: "Boliviano", symbol: "Bs.", sign: "Bs." },
  { code: "GYD", name: "Guyanese Dollar", symbol: "$", sign: "G$" },
  { code: "SRD", name: "Surinamese Dollar", symbol: "$", sign: "SRD$" },
  
  // --- Europe ---
  { code: "EUR", name: "Euro", symbol: "€", sign: "€" },
  { code: "GBP", name: "Pound Sterling", symbol: "£", sign: "£" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr", sign: "CHF" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr", sign: "NOK" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", sign: "SEK" },
  { code: "DKK", name: "Danish Krone", symbol: "kr", sign: "DKK" },
  { code: "ISK", name: "Icelandic Króna", symbol: "kr", sign: "ISK" },
  { code: "CZK", name: "Czech Koruna", symbol: "Kč", sign: "Kč" },
  { code: "PLN", name: "Polish Złoty", symbol: "zł", sign: "zł" },
  { code: "HUF", name: "Hungarian Forint", symbol: "Ft", sign: "Ft" },
  { code: "RON", name: "Romanian Leu", symbol: "lei", sign: "lei" },
  { code: "BGN", name: "Bulgarian Lev", symbol: "лв", sign: "лв" },
  { code: "RSD", name: "Serbian Dinar", symbol: "дин.", sign: "RSD" },
  { code: "MKD", name: "Macedonian Denar", symbol: "ден", sign: "ден" },
  { code: "ALL", name: "Albanian Lek", symbol: "L", sign: "L" },
  { code: "BAM", name: "Bosnia and Herzegovina Convertible Mark", symbol: "KM", sign: "KM" },
  { code: "MDL", name: "Moldovan Leu", symbol: "L", sign: "MDL" },
  { code: "UAH", name: "Ukrainian Hryvnia", symbol: "₴", sign: "₴" },
  { code: "BYN", name: "Belarusian Ruble", symbol: "Br", sign: "Br" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽", sign: "₽" },
  { code: "GIP", name: "Gibraltar Pound", symbol: "£", sign: "£" },
  
  // --- Middle East & Asia ---
  { code: "TRY", name: "Turkish Lira", symbol: "₺", sign: "₺" },
  { code: "IRR", name: "Iranian Rial", symbol: "﷼", sign: "IRR" },
  { code: "IQD", name: "Iraqi Dinar", symbol: "ع.د", sign: "IQD" },
  { code: "SYP", name: "Syrian Pound", symbol: "£S", sign: "£S" },
  { code: "JOD", name: "Jordanian Dinar", symbol: "د.ا", sign: "JOD" },
  { code: "LBP", name: "Lebanese Pound", symbol: "ل.ل", sign: "LBP" },
  { code: "ILS", name: "Israeli New Shekel", symbol: "₪", sign: "ILS" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼", sign: "SAR" },
  { code: "QAR", name: "Qatari Riyal", symbol: "﷼", sign: "QAR" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", sign: "AED" },
  { code: "KWD", name: "Kuwaiti Dinar", symbol: "د.ك", sign: "KWD" },
  { code: "BHD", name: "Bahraini Dinar", symbol: "ب.د", sign: "BHD" },
  { code: "OMR", name: "Omani Rial", symbol: "ر.ع.", sign: "OMR" },
  
  // --- Asia & Pacific ---
  { code: "INR", name: "Indian Rupee", symbol: "₹", sign: "₹" },
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨", sign: "₨" },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳", sign: "৳" },
  { code: "LKR", name: "Sri Lankan Rupee", symbol: "Rs", sign: "Rs" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", sign: "CN¥" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", sign: "¥" },
  { code: "KRW", name: "South Korean Won", symbol: "₩", sign: "₩" },
  { code: "THB", name: "Thai Baht", symbol: "฿", sign: "฿" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", sign: "RM" },
  { code: "SGD", name: "Singapore Dollar", symbol: "$", sign: "S$" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", sign: "Rp" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱", sign: "₱" },
  { code: "VND", name: "Vietnamese Đồng", symbol: "₫", sign: "₫" },
  { code: "AUD", name: "Australian Dollar", symbol: "$", sign: "A$" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "$", sign: "NZ$" },
  { code: "FJD", name: "Fijian Dollar", symbol: "$", sign: "FJ$" },
  
  // --- Africa ---
  { code: "NGN", name: "Nigerian Naira", symbol: "₦", sign: "₦" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "₵", sign: "GH₵" },
  { code: "ZAR", name: "South African Rand", symbol: "R", sign: "R" },
  { code: "KES", name: "Kenyan Shilling", symbol: "Sh", sign: "KSh" },
  { code: "TZS", name: "Tanzanian Shilling", symbol: "Sh", sign: "TSh" },
  { code: "UGX", name: "Ugandan Shilling", symbol: "Sh", sign: "USh" },
  { code: "MUR", name: "Mauritian Rupee", symbol: "₨", sign: "Rs" },
  { code: "MAD", name: "Moroccan Dirham", symbol: "د.م.", sign: "MAD" },
  { code: "EGP", name: "Egyptian Pound", symbol: "£", sign: "E£" },
  
/****** crypto currencies *******/
{ code: "BTC", name: "Bitcoin", symbol: "₿", sign: "₿" },
  { code: "ETH", name: "Ethereum", symbol: "Ξ", sign: "ETH" },
  { code: "USDT", name: "Tether", symbol: "₮", sign: "USDT" },
  { code: "XRP", name: "XRP", symbol: "XRP", sign: "XRP" },
  { code: "BNB", name: "BNB", symbol: "BNB", sign: "BNB" },
  { code: "SOL", name: "Solana", symbol: "SOL", sign: "SOL" },
  { code: "USDC", name: "USD Coin", symbol: "$", sign: "USDC" },
  { code: "DOGE", name: "Dogecoin", symbol: "Ð", sign: "DOGE" },
  { code: "ADA", name: "Cardano", symbol: "₳", sign: "ADA" },
  { code: "TRX", name: "TRON", symbol: "TRX", sign: "TRX" },
  { code: "DOT", name: "Polkadot", symbol: "DOT", sign: "DOT" },
  { code: "LTC", name: "Litecoin", symbol: "Ł", sign: "Ł" },
  { code: "BCH", name: "Bitcoin Cash", symbol: "Ƀ", sign: "BCH" },
  { code: "XLM", name: "Stellar", symbol: "★", sign: "XLM" },
  { code: "UNI", name: "Uniswap", symbol: "UNI", sign: "UNI" },
  { code: "LINK", name: "Chainlink", symbol: "LINK", sign: "LINK" },
  { code: "MNT", name: "Mantle", symbol: "MNT", sign: "MNT" },
];

/* ---------- Popup and UI creation (kept your original structure) ---------- */

function createCurrencyPopup() {
  if (document.getElementById("currencyPopup")) return;
  
  const popup = document.createElement("div");
  popup.id = "currencyPopup";
  popup.innerHTML = `
    <div class="currency-popup-overlay"></div>
    <div class="currency-popup">
      <div class="currency-popup-header">
        <input type="text" id="currencySearch" placeholder="Search currency...">
        <button id="currencyCloseBtn"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
      </svg></button>
      </div>
      <ul id="currencyList"></ul>
    </div>
  `;
  document.body.appendChild(popup);
  
  const list = document.getElementById("currencyList");
  currencies.forEach(c => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="symbol">${c.symbol}</span> <span class="name">${c.name}</span>`;
    // <- patched click handler: triggers atomic conversion + apply
    li.addEventListener("click", async () => {
      try {
        await selectCurrencyWithAtomicConversion(c);
      } catch (err) {
        console.error("[Currency select/convert error]:", err);
      }
    });
    list.appendChild(li);
  });
  
  document.getElementById("currencyCloseBtn").addEventListener("click", closeCurrencyPopup);
  document.querySelector(".currency-popup-overlay").addEventListener("click", closeCurrencyPopup);
  
  document.getElementById("currencySearch").addEventListener("input", function() {
    const term = this.value.toLowerCase();
    Array.from(list.children).forEach(li => {
      li.style.display = li.textContent.toLowerCase().includes(term) ? "flex" : "none";
    });
  });
}

function openCurrencyPopup() {
  createCurrencyPopup();
  const popup = document.getElementById("currencyPopup");
  
  void popup.offsetWidth;
  
  popup.classList.add("active");
  
  document.body.style.overflow = "hidden";
}

function closeCurrencyPopup() {
  const popup = document.getElementById("currencyPopup");
  if (popup) {
    popup.classList.remove("active");
    
    popup.ontransitionend = () => {
      popup.remove();
      document.body.style.overflow = "";
    }
  }
}

/* ---------- Helper: apply currency to UI (updates text + data attributes) ---------- */
function applyCurrencyToUI(currency) {
  if (!currency || !currency.code) return;

  const symbol = currency.symbol || currency.sign || currency.code;

  document.querySelectorAll(".currency-or-unit-display").forEach(span => {
    span.textContent = symbol;
    span.dataset.currencyCode = currency.code;
  });

  document.querySelectorAll(".naira-to-selected-currency-car-custom-duty").forEach(span => {
    span.textContent = symbol;
    span.dataset.currencyCode = currency.code;
  });

  document.querySelectorAll(".currency-display-for-expanded-results").forEach(span => {
    span.textContent = symbol;
    span.dataset.currencyCode = currency.code;
  });

  document.querySelectorAll(".currency-display-for-tooltip").forEach(span => {
    span.textContent = currency.name || currency.code;
    span.dataset.currencyCode = currency.code;
  });
}

/* ---------- CurrencyBeacon + conversion implementation ---------- */

const CURRENCYBEACON_API_KEY = "9RguthE8FO8RDbBbnOYbH19Icd0U3z6Y";
const CB_BASE = "https://api.currencybeacon.com/v1";
const DEBUG_CB = true; // set to false to silence logs

function _cbLog(...args) { if (DEBUG_CB) console.debug("[CB]", ...args); }

/* Daily cache helpers: cache key includes date so it expires at midnight local time */
function _todayDateString() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function _cacheKeyForBase(base) {
  base = (base || "").toUpperCase();
  return `cb_rates::${base}::${_todayDateString()}`;
}
function _getCachedRates(base) {
  try {
    const k = _cacheKeyForBase(base);
    const raw = localStorage.getItem(k);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.rates) return parsed.rates;
  } catch (e) {
    console.warn("Cache read error", e);
  }
  return null;
}
function _setCachedRates(base, ratesObj) {
  try {
    const k = _cacheKeyForBase(base);
    localStorage.setItem(k, JSON.stringify({ timestamp: Date.now(), rates: ratesObj }));
  } catch (e) {
    console.warn("Cache write error", e);
  }
}

/* Fetch /latest and normalize response shapes into { CODE: rate } */
async function _fetchLatestRates(base, symbols = []) {
  base = (base || "").toUpperCase();
  if (!base) return { ok: false, reason: "no_base" };

  // Try daily cache first
  const cached = _getCachedRates(base);
  if (cached) {
    _cbLog("Using daily cache for", base);
    if (symbols.length === 0) return { ok: true, rates: cached };
    const filtered = {};
    symbols.forEach(s => { if (cached[s]) filtered[s] = cached[s]; });
    return { ok: true, rates: filtered };
  }

  const url = new URL(`${CB_BASE}/latest`);
  url.searchParams.set("base", base);
  if (symbols.length) url.searchParams.set("symbols", symbols.join(","));
  url.searchParams.set("api_key", CURRENCYBEACON_API_KEY);

  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      mode: "cors",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${CURRENCYBEACON_API_KEY}`
      },
      cache: "no-store"
    });

    if (!res.ok) {
      const txt = await res.text();
      _cbLog("latest http error", res.status, txt);
      return { ok: false, reason: `http_${res.status}`, body: txt };
    }

    const json = await res.json();
    _cbLog("latest response for base", base, json);

    // Normalize many possible shapes
    let rates = {};
    if (json.rates && typeof json.rates === "object") {
      Object.keys(json.rates).forEach(k => { rates[k.toUpperCase()] = Number(json.rates[k]); });
    } else if (json.quotes && typeof json.quotes === "object") {
      Object.keys(json.quotes).forEach(k => {
        const v = Number(json.quotes[k]);
        const key = String(k).toUpperCase();
        if (key.length === 3) rates[key] = v;
        else if (key.length === 6) rates[key.slice(3)] = v;
        else rates[key] = v;
      });
    } else if (json.data && json.data.rates && typeof json.data.rates === "object") {
      Object.keys(json.data.rates).forEach(k => { rates[k.toUpperCase()] = Number(json.data.rates[k]); });
    } else {
      Object.keys(json).forEach(k => { if (typeof json[k] === "number") rates[k.toUpperCase()] = Number(json[k]); });
    }

    if (Object.keys(rates).length > 0) {
      _setCachedRates(base, rates);
      return { ok: true, rates };
    }

    return { ok: false, reason: "no_rates_in_response", body: json };
  } catch (err) {
    _cbLog("fetchLatestRates exception", err);
    return { ok: false, reason: "fetch_exception", err };
  }
}

/* Fallback: /convert endpoint for single-pair conversion */
async function _fetchConvertPair(from, to, amount = 1) {
  const url = new URL(`${CB_BASE}/convert`);
  url.searchParams.set("from", from);
  url.searchParams.set("to", to);
  url.searchParams.set("amount", String(amount));
  url.searchParams.set("api_key", CURRENCYBEACON_API_KEY);

  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      mode: "cors",
      headers: { "Accept": "application/json", "Authorization": `Bearer ${CURRENCYBEACON_API_KEY}` },
      cache: "no-store"
    });
    if (!res.ok) {
      const t = await res.text();
      _cbLog("convert http error", res.status, t);
      return { ok: false, reason: `http_${res.status}`, body: t };
    }
    const j = await res.json();
    _cbLog("convert response", j);
    if (typeof j.result === "number") return { ok: true, value: Number(j.result) };
    if (j.data && typeof j.data.result === "number") return { ok: true, value: Number(j.data.result) };
    if (j.conversion && typeof j.conversion.result === "number") return { ok: true, value: Number(j.conversion.result) };
    if (typeof j.value === "number") return { ok: true, value: Number(j.value) };
    if (j.rates && typeof j.rates[to] === "number") return { ok: true, value: Number(j.rates[to]) * amount };
    return { ok: false, reason: "unknown_convert_shape", body: j };
  } catch (e) {
    _cbLog("convert fetch exception", e);
    return { ok: false, reason: "fetch_exception", err: e };
  }
}

/* Resolve rate FROM -> TO. Try (1) latest base=FROM, (2) latest base=TO and invert, (3) convert endpoint */
async function resolveRate(from, to) {
  from = (from || "").toUpperCase();
  to = (to || "").toUpperCase();
  if (!from || !to) return null;
  if (from === to) return 1;

  // 1) base = from
  const a = await _fetchLatestRates(from, [to]);
  if (a.ok && a.rates && typeof a.rates[to] === "number") {
    _cbLog(`Rate ${from}->${to} via base ${from}`, a.rates[to]);
    return Number(a.rates[to]);
  }

  // 2) base = to, invert
  const b = await _fetchLatestRates(to, [from]);
  if (b.ok && b.rates && typeof b.rates[from] === "number" && b.rates[from] !== 0) {
    const inv = 1 / Number(b.rates[from]);
    _cbLog(`Rate ${from}->${to} by inverting ${to}->${from}`, inv);
    return inv;
  }

  // 3) fallback convert endpoint
  const c = await _fetchConvertPair(from, to, 1);
  if (c.ok && typeof c.value === "number") {
    _cbLog(`Rate ${from}->${to} via convert`, c.value);
    return Number(c.value);
  }

  _cbLog(`Failed to resolve rate ${from}->${to}`);
  return null;
}

/* ---------- Helper: infer currency code from symbol if possible ---------- */
function inferCurrencyCodeFromSymbol(symbol) {
  if (!symbol) return null;
  if (!inferCurrencyCodeFromSymbol._map) {
    inferCurrencyCodeFromSymbol._map = {};
    currencies.forEach(c => {
      const s = (c.symbol || "").toString();
      if (!inferCurrencyCodeFromSymbol._map[s]) inferCurrencyCodeFromSymbol._map[s] = new Set();
      inferCurrencyCodeFromSymbol._map[s].add(c.code.toUpperCase());
    });
  }
  const set = inferCurrencyCodeFromSymbol._map[symbol];
  if (!set) return null;
  const arr = Array.from(set);
  return arr.length === 1 ? arr[0] : null;
}

/* ---------- convertCapturedItemsToTargetCurrency (used by selectCurrency) ---------- */
async function convertCapturedItemsToTargetCurrency(targetCurrency, items) {
  if (!targetCurrency || !targetCurrency.code) return { success: false, reason: "no_target" };
  const targetCode = targetCurrency.code.toUpperCase();

  // Group items by source code
  const groups = {};
  for (const it of items) {
    const src = (it.srcCode || "").toUpperCase() || null;
    if (!src || src === targetCode) continue;
    if (!groups[src]) groups[src] = [];
    groups[src].push(it);
  }

  if (Object.keys(groups).length === 0) return { success: true, converted: 0 };

  // Resolve rates once per source
  const resolved = {};
  for (const src of Object.keys(groups)) {
    const rate = await resolveRate(src, targetCode);
    if (rate === null) {
      return { success: false, reason: "rate_resolution_failed", source: src };
    }
    resolved[src] = rate;
  }

  // Apply conversions
  let convertedCount = 0;
  for (const src of Object.keys(groups)) {
    const rate = resolved[src];
    for (const item of groups[src]) {
      const newVal = Number((item.amount * rate).toFixed(2));
      item.input.value = newVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      if (item.span) item.span.dataset.currencyCode = targetCode;
      convertedCount++;
    }
  }

  return { success: true, converted: convertedCount };
}

/* ---------- convertAllInputsToTargetCurrency (backwards-compatible bulk converter) ---------- */
async function convertAllInputsToTargetCurrency(targetCurrency) {
  // This function inspects DOM, captures source codes & numeric amounts,
  // then delegates to convertCapturedItemsToTargetCurrency
  if (!targetCurrency || !targetCurrency.code) return { success: false, reason: "no_target" };

  const wrappers = Array.from(document.querySelectorAll(".currency-or-unit-input"));
  const captured = [];

  // fallback saved selected code
  let savedSelectedCode = null;
  try {
    const saved = localStorage.getItem("selectedCurrency");
    if (saved) {
      const s = JSON.parse(saved);
      if (s && s.code) savedSelectedCode = s.code.toUpperCase();
    }
  } catch (e) {}

  for (const w of wrappers) {
    const span = w.querySelector(".currency-or-unit-display");
    const input = w.querySelector("input");
    if (!span || !input) continue;

    let src = (span.dataset.currencyCode || "").toUpperCase();
    if (!src) {
      src = inferCurrencyCodeFromSymbol((span.textContent || "").trim());
    }
    if (!src) src = savedSelectedCode || "USD";

    const raw = (input.value || "").toString().replace(/,/g, "").trim();
    const num = raw === "" ? null : Number(raw);
    if (num === null || !isFinite(num)) {
      captured.push({ span, input, srcCode: src, amount: 0, shouldConvert: false });
    } else {
      captured.push({ span, input, srcCode: src, amount: num, shouldConvert: true });
    }
  }

  // items to actually convert:
  const itemsToConvert = captured
    .filter(it => it.shouldConvert && it.amount !== null)
    .map(it => ({ span: it.span, input: it.input, srcCode: it.srcCode, amount: it.amount }));

  if (itemsToConvert.length === 0) return { success: true, converted: 0 };

  return convertCapturedItemsToTargetCurrency(targetCurrency, itemsToConvert);
}

/* ---------- Replacement selectCurrencyWithAtomicConversion (stable) ---------- */
async function selectCurrencyWithAtomicConversion(currency) {
  if (!currency || !currency.code) return;

  const targetCode = currency.code.toUpperCase();

  // collect wrappers and capture source codes/amounts BEFORE changing UI
  const wrappers = Array.from(document.querySelectorAll(".currency-or-unit-input"));
  const capturedItems = []; // { span, input, srcCode, amount, shouldConvert }
  let savedSelectedCode = null;
  try {
    const saved = localStorage.getItem("selectedCurrency");
    if (saved) {
      const s = JSON.parse(saved);
      if (s && s.code) savedSelectedCode = s.code.toUpperCase();
    }
  } catch (e) {}

  for (const w of wrappers) {
    const span = w.querySelector(".currency-or-unit-display");
    const input = w.querySelector("input");
    if (!span || !input) continue;

    let src = (span.dataset.currencyCode || "").toUpperCase();
    if (!src) src = inferCurrencyCodeFromSymbol((span.textContent || "").trim());
    if (!src) src = savedSelectedCode || "USD";

    const raw = (input.value || "").toString().replace(/,/g, "").trim();
    const num = raw === "" ? null : Number(raw);
    if (num === null || !isFinite(num)) {
      capturedItems.push({ span, input, srcCode: src, amount: 0, shouldConvert: false });
    } else {
      capturedItems.push({ span, input, srcCode: src, amount: num, shouldConvert: true });
    }
  }

  // Start visual flash (opacity animation) on spans
  const spans = document.querySelectorAll(
    ".symbol,.currency-or-unit-display, .naira-to-selected-currency-car-custom-duty, .currency-display-for-expanded-results, .currency-display-for-tooltip"
  );
  spans.forEach(s => s.classList.add("currency-flash"));

  // Immediately update UI and persist selection
  applyCurrencyToUI(currency);
  try { localStorage.setItem("selectedCurrency", JSON.stringify(currency)); } catch (e) { console.warn("save fail", e); }

  document.body.classList.add("converting");

  try {
    // Prepare items needing conversion
    const itemsToConvert = capturedItems
      .filter(it => it.shouldConvert && it.amount !== null)
      .map(it => ({ span: it.span, input: it.input, srcCode: it.srcCode, amount: it.amount }));

    if (itemsToConvert.length === 0) {
      // nothing to convert; succeed fast
      return;
    }

    const convResult = await convertCapturedItemsToTargetCurrency(currency, itemsToConvert);

    if (!convResult.success) {
      console.warn("Conversion aborted:", convResult);
      showMessage("Currency conversion failed")
      //alert("Currency conversion failed");
      return;
    }

    // success: converted inputs already applied
  } catch (err) {
    console.error("Conversion error:", err);
    alert("Currency conversion failed");
    return;
  } finally {
    spans.forEach(s => s.classList.remove("currency-flash"));
    document.body.classList.remove("converting");
    closeCurrencyPopup();
  }
}

/* ---------- loadSavedCurrency (set UI and data attributes on load) ---------- */
function loadSavedCurrency() {
  const saved = localStorage.getItem("selectedCurrency");
  if (saved) {
    try {
      const currency = JSON.parse(saved);
      applyCurrencyToUI(currency);
      return;
    } catch (e) {
      console.warn("loadSavedCurrency parse error", e);
    }
  }

  // If no saved currency, try to seed dataset currency codes where unique
  const allSymbols = {};
  currencies.forEach(c => {
    if (!allSymbols[c.symbol]) allSymbols[c.symbol] = [];
    allSymbols[c.symbol].push(c.code);
  });
  document.querySelectorAll(".currency-or-unit-display").forEach(span => {
    const txt = (span.textContent || "").trim();
    if (txt && allSymbols[txt] && allSymbols[txt].length === 1) {
      span.dataset.currencyCode = allSymbols[txt][0];
    }
  });
}

/* ---------- DOM Ready wiring (keeps your tooltip behavior) ---------- */
document.addEventListener("DOMContentLoaded", () => {
  loadSavedCurrency();
  document.querySelectorAll(".currency-select-svg").forEach(svg => {
    svg.addEventListener("click", openCurrencyPopup);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const svgElements = document.querySelectorAll(".currency-select-svg");
  
  svgElements.forEach(svg => {
    const tooltip = document.createElement("div");
    tooltip.className = "currency-tooltip";
    tooltip.textContent = "Choose your preferred Currency";
    document.body.appendChild(tooltip);
    
    const rect = svg.getBoundingClientRect();
    tooltip.style.top = rect.top - 30 + "px";
    tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + "px";
    
    setTimeout(() => {
      tooltip.classList.add("visible");
      setTimeout(() => tooltip.classList.remove("visible"), 5000);
    }, 2000);
  });
});

/* ---------- Expose helpers for debugging in console if needed ---------- */
window._cbResolveRate = resolveRate;
window._cbConvertAll = convertAllInputsToTargetCurrency;
window.selectCurrencyWithAtomicConversion = selectCurrencyWithAtomicConversion;

/**********************************************************/