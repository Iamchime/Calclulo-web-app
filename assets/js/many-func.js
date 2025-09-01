/************pwa helper
 ******/
 document.addEventListener("DOMContentLoaded", () => {
  const homeLink = document.querySelector(".home-link");
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches;
  
  // Function to update the link dynamically
  const updateHomeLink = () => {
    if (!homeLink) return;
    if (isStandalone) {
      homeLink.setAttribute("href", "/pwa-start-page.html");
    } else {
      homeLink.setAttribute("href", "/index.html");
    }
  };
  
  // Update the link on page load
  updateHomeLink();
  
  // Auto-redirect if user is on index.html but should be on pwa-start-page.html
  if (
    (isStandalone) &&
    window.location.pathname === "/index.html"
  ) {
    window.location.replace("/pwa-start-page.html");
  }
  
  // Listen for orientation changes
  window.addEventListener("resize", updateHomeLink);
});

/*********************************
 * Progressive Web App
 *********************************/

// Register service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((reg) => console.log("Service worker registered:", reg.scope))
      .catch((err) =>
        console.error("Service worker registration failed:", err)
      );
  });
}

let deferredPrompt = null;

// Listen for the install prompt event
window.addEventListener("beforeinstallprompt", (e) => {
  // Stop Chrome from showing its default "big box"
  e.preventDefault();
  deferredPrompt = e;
  
  console.log("PWA install prompt saved!");
  
  // Automatically trigger Chrome’s built-in prompt
  showMiniPrompt();
});

function showMiniPrompt() {
  if (deferredPrompt) {
    // This shows Chrome’s built-in, swipeable prompt
    deferredPrompt.prompt();
    
    // Wait for the user's choice
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the PWA install prompt");
      } else {
        console.log("User dismissed the PWA install prompt");
      }
      deferredPrompt = null;
    });
  }
}

/*****************************
 * cookie management 
 */
 document.addEventListener("DOMContentLoaded", () => {
  if (!document.cookie.includes("accepted_cookies=yes")) {
    const cookieBox = document.createElement("div");
    cookieBox.className = "cookie-wrapper";
    cookieBox.innerHTML = `
    <img src="../assets/icons/cookie.svg"/>
      <h2>Cookies Consent</h2> 
      <div class="cookie-data">    
        <p>We use cookies to improve your experience on our website. By using our website, you’re agreeing to the collection of data as described in our <a class="from-cookie-to-tos" href="/privacy.html">Privacy Policy</a></p>    
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
    
    if (tip.classList.contains('animating')) return; // Ignore rapid clicks during active animation
    
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


/*********************************** currency handling ****************************/

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
  { code: "VES", name: "Venezuelan Bolívar", symbol: "Bs.", sign: "Bs." },
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
  { code: "ILS", name: "Israeli New Shekel", symbol: "₪", sign: "₪" },
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
  
  // --- Major Cryptocurrencies ---
{ code: "BTC", name: "Bitcoin", symbol: "₿", sign: "₿" },
{ code: "ETH", name: "Ethereum", symbol: "Ξ", sign: "ETH" },
{ code: "BNB", name: "BNB", symbol: "BNB", sign: "BNB" },
{ code: "SOL", name: "Solana", symbol: "SOL", sign: "SOL" },
{ code: "XRP", name: "XRP", symbol: "XRP", sign: "XRP" },
{ code: "ADA", name: "Cardano", symbol: "₳", sign: "ADA" },
{ code: "DOGE", name: "Dogecoin", symbol: "Ð", sign: "DOGE" },
{ code: "SHIB", name: "Shiba Inu", symbol: "🐕", sign: "SHIB" },
{ code: "DOT", name: "Polkadot", symbol: "DOT", sign: "DOT" },
{ code: "MATIC", name: "Polygon", symbol: "MATIC", sign: "MATIC" },

// --- Stablecoins ---
{ code: "USDT", name: "Tether", symbol: "₮", sign: "USDT" },
{ code: "USDC", name: "USD Coin", symbol: "$", sign: "USDC" },
{ code: "DAI", name: "Dai", symbol: "DAI", sign: "DAI" },
{ code: "BUSD", name: "Binance USD", symbol: "BUSD", sign: "BUSD" },
{ code: "TUSD", name: "TrueUSD", symbol: "TUSD", sign: "TUSD" },
{ code: "FRAX", name: "Frax", symbol: "FRAX", sign: "FRAX" },
{ code: "USTC", name: "TerraClassicUSD", symbol: "USTC", sign: "USTC" },

// --- Exchange Tokens ---
{ code: "OKB", name: "OKB", symbol: "OKB", sign: "OKB" },
{ code: "HT", name: "Huobi Token", symbol: "HT", sign: "HT" },
{ code: "CRO", name: "Cronos", symbol: "CRO", sign: "CRO" },
{ code: "FTT", name: "FTX Token", symbol: "FTT", sign: "FTT" },
{ code: "GT", name: "GateToken", symbol: "GT", sign: "GT" },
{ code: "LEO", name: "UNUS SED LEO", symbol: "LEO", sign: "LEO" },

// --- DeFi Tokens ---
{ code: "UNI", name: "Uniswap", symbol: "UNI", sign: "UNI" },
{ code: "AAVE", name: "Aave", symbol: "AAVE", sign: "AAVE" },
{ code: "COMP", name: "Compound", symbol: "COMP", sign: "COMP" },
{ code: "MKR", name: "Maker", symbol: "MKR", sign: "MKR" },
{ code: "SNX", name: "Synthetix", symbol: "SNX", sign: "SNX" },
{ code: "YFI", name: "yearn.finance", symbol: "YFI", sign: "YFI" },
{ code: "CRV", name: "Curve DAO Token", symbol: "CRV", sign: "CRV" },

// --- Other Popular Tokens ---
{ code: "LTC", name: "Litecoin", symbol: "Ł", sign: "Ł" },
{ code: "BCH", name: "Bitcoin Cash", symbol: "Ƀ", sign: "BCH" },
{ code: "XLM", name: "Stellar", symbol: "★", sign: "XLM" },
{ code: "ATOM", name: "Cosmos", symbol: "ATOM", sign: "ATOM" },
{ code: "ALGO", name: "Algorand", symbol: "ALGO", sign: "ALGO" },
{ code: "AVAX", name: "Avalanche", symbol: "AVAX", sign: "AVAX" },
{ code: "TRX", name: "TRON", symbol: "TRX", sign: "TRX" },
{ code: "NEAR", name: "NEAR Protocol", symbol: "NEAR", sign: "NEAR" },
{ code: "EGLD", name: "MultiversX (Elrond)", symbol: "EGLD", sign: "EGLD" },
{ code: "APT", name: "Aptos", symbol: "APT", sign: "APT" },
{ code: "SUI", name: "Sui", symbol: "SUI", sign: "SUI" },

// --- Meme / Community Coins ---
{ code: "PEPE", name: "Pepe", symbol: "PEPE", sign: "PEPE" },
{ code: "FLOKI", name: "Floki Inu", symbol: "$FLOKI", sign: "FLOKI" },
{ code: "BONK", name: "Bonk", symbol: "BONK", sign: "BONK" },
{ code: "BTTC", name: "BitTorrent", symbol: "BTTC", sign: "BTTC" }
];

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
    li.addEventListener("click", () => selectCurrency(c));
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
  
  // Force a reflow so transition triggers properly
  void popup.offsetWidth;
  
  popup.classList.add("active");
  
  // Disable background scrolling
  document.body.style.overflow = "hidden";
}

function closeCurrencyPopup() {
  const popup = document.getElementById("currencyPopup");
  if (popup) {
    popup.classList.remove("active");
    
    // Wait for fade-out before removing from DOM
    
    /*
    setTimeout(() => {
      popup.remove();
      document.body.style.overflow = "";
    }, 300); // Match CSS transition duration*/
    popup.ontransitionend = () => {
      popup.remove();
document.body.style.overflow = "";
    }
  }
}

function selectCurrency(currency) {

document.querySelectorAll(".naira-to-selected-currency-car-custom-duty").forEach(span => {
  span.textContent = currency.symbol;
});

document.querySelectorAll(".currency-display-for-expanded-results").forEach(span => {
  span.textContent = currency.symbol;
});

document.querySelectorAll(".currency-display-for-tooltip").forEach(span => {
  span.textContent = currency.name;
});

  document.querySelectorAll(".currency-or-unit-display").forEach(span => {
    span.textContent = currency.symbol;
  });
  localStorage.setItem("selectedCurrency", JSON.stringify(currency));
  closeCurrencyPopup();
}

function loadSavedCurrency() {
  const saved = localStorage.getItem("selectedCurrency");
  if (saved) {
    const currency = JSON.parse(saved);
    document.querySelectorAll(".currency-or-unit-display").forEach(span => {
      span.textContent = currency.symbol;
    });
    //
    document.querySelectorAll(".naira-to-selected-currency-car-custom-duty").forEach(span => {
  span.textContent = currency.symbol;
});
    //
    document.querySelectorAll(".currency-display-for-tooltip").forEach(span => {
  span.textContent = currency.name;
});
    //
    document.querySelectorAll(".currency-display-for-expanded-results").forEach(span => {
  span.textContent = currency.symbol;
});
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadSavedCurrency();
  document.querySelectorAll(".currency-select-svg").forEach(svg => {
    svg.addEventListener("click", openCurrencyPopup);
  });
});



document.addEventListener("DOMContentLoaded", () => {
  const svgElements = document.querySelectorAll(".currency-select-svg");
  
  svgElements.forEach(svg => {
    // Create tooltip element
    const tooltip = document.createElement("div");
    tooltip.className = "currency-tooltip";
    tooltip.textContent = "Choose your preferred Currency";
    document.body.appendChild(tooltip);
    
    // Position the tooltip above the SVG
    const rect = svg.getBoundingClientRect();
    tooltip.style.top = rect.top - 30 + "px"; // 35px above the SVG
    tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + "px";
    
    
    // Optional: show automatically for 3 seconds on page load
    setTimeout(() => {
      
      
      tooltip.classList.add("visible");
      setTimeout(() => tooltip.classList.remove("visible"), 5000);
    }, 2000);
  });
});


/***********************************
 Reset all inputs across containers
***********************************/
function resetCalculator() {
  const containers = document.querySelectorAll(".container"); // all containers
  
  containers.forEach(container => {
    // Reset all input fields except read-only ones
    const inputs = container.querySelectorAll("input:not([readonly])");
    inputs.forEach(input => {
      if (input.type === "radio" || input.type === "checkbox") {
        input.checked = false;
      } else {
        input.value = "";
      }
    });
    
    // Reset all selects to their first option
    const selects = container.querySelectorAll("select");
    selects.forEach(select => {
      select.selectedIndex = 0;
    });
    
    // Reset output fields if any
    const outputs = container.querySelectorAll("input[readonly], .result, .output");
    outputs.forEach(output => {
      if (output.tagName.toLowerCase() === "input") {
        output.value = "";
      } else {
        output.textContent = "";
      }
    });
  });
  
//extra results divs
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

//results div
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

// Remove error text if it exists

  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach(msg => msg.remove());
}

/********* flash results ******/

// === Flash .result on any change (user or programmatic) ===
(function () {
  // 1) Patch value setter so programmatic updates emit an event
  if (!window.__valueSetterPatched) {
    window.__valueSetterPatched = true;
    const patch = (Ctor) => {
      if (!Ctor) return;
      const d = Object.getOwnPropertyDescriptor(Ctor.prototype, 'value');
      if (!d || !d.configurable) return;
      Object.defineProperty(Ctor.prototype, 'value', {
        get: d.get,
        set: function (v) {
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

  // 2) Flash helper with per-element timer so it’s reusable
  const timers = new WeakMap();
  function flash(el) {
    if (timers.has(el)) clearTimeout(timers.get(el));
    el.classList.add('flashResult');
    timers.set(el, setTimeout(() => {
      el.classList.remove('flashResult');
      timers.delete(el);
    }, 400)); // match your CSS transition
  }

  // 3) Wire up existing and future .result elements
  function wire(el) {
    if (el.dataset.flashWired) return;
    el.dataset.flashWired = '1';

    if (el.matches('input, textarea, select')) {
      el.addEventListener('input', () => flash(el));
      el.addEventListener('change', () => flash(el));
      el.addEventListener('value-set', () => flash(el)); // programmatic changes
    } else {
      // spans/divs/etc. -> watch text changes
      const mo = new MutationObserver(() => flash(el));
      mo.observe(el, { childList: true, characterData: true, subtree: true });
    }
  }

  document.querySelectorAll('.result').forEach(wire);

  // If results are injected later, wire them too
  const addObserver = new MutationObserver(() => {
    document.querySelectorAll('.result:not([data-flash-wired])').forEach(wire);
  });
  addObserver.observe(document.documentElement, { childList: true, subtree: true });
})();


/**********options box***********/
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
  // Create overlay (unchanged)
  overlayForExpandedOpt = document.createElement('div');
  overlayForExpandedOpt.className = 'overlay-blocker';
  document.body.appendChild(overlayForExpandedOpt);
  
  // Use the existing box inside the same input-group
  const group = icon.closest('.input-group');
  const box = group?.querySelector('.input-options');
  if (!box) return;
  
  // --- Accurate positioning relative to the box's offsetParent ---
  const parent = box.offsetParent || document.body;
  const iconRect = icon.getBoundingClientRect();
  const parentRect = parent.getBoundingClientRect();
  
  const GAP = 8;
  
  // Align box's right edge with icon's right edge, drop just below icon
  const top = iconRect.bottom - parentRect.top + GAP;
  let left = iconRect.right - parentRect.left - (box.offsetWidth || 250);
  
  // Clamp within parent bounds to avoid overflow
  const parentWidth = (parent === document.body || parent === document.documentElement) ?
    window.innerWidth :
    parent.clientWidth;
  
  const maxLeft = Math.max(0, parentWidth - (box.offsetWidth || 250) - 8);
  left = Math.min(Math.max(8, left), maxLeft);
  
  box.style.top = `${Math.round(top)}px`;
  box.style.left = `${Math.round(left)}px`;
  
  // Animate/show
  requestAnimationFrame(() => box.classList.add('show'));
  icon.classList.add('rotated');
  
  activeBox = box;
  activeIcon = icon;
  
  // Outside click via overlay
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
      // Do NOT remove the element; we only hide it
      activeBox = null;
      activeIcon = null;
      if (typeof callback === 'function') callback();
    }, 300);
  } else if (typeof callback === 'function') {
    callback();
  }
}

// Close when clicking outside (kept)
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

/****options features***/

  document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".input-group").forEach(group => {
    const inputId    = group.dataset.inputId;
    const saveToggle = group.querySelector('input[data-role="save-toggle"]');
    const optionsBox = group.querySelector(".input-options");
    const expandBtn  = group.querySelector(".expanded-input-option-svg");

    // Find the MAIN label (the one that contains the expand svg)
    function getMainLabel(g) {
      const labels = g.querySelectorAll("label");
      for (const lb of labels) if (lb.querySelector(".expanded-input-option-svg")) return lb;
      return labels[0] || null;
    }
    const mainLabel = getMainLabel(group);
    if (!saveToggle || !mainLabel) return;

    // -------- Indicator SVG ----------
    const indicatorSVG = `
      <svg class="indicate-save-inputs-svg" xmlns="http://www.w3.org/2000/svg"
           height="18px" viewBox="0 -960 960 960" width="18px" fill="#1f1f1f"
           style="margin-left:6px; vertical-align:middle;">
        <path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0
                 56.5 23.5T760-760v640L480-240 200-120Zm80-122
                 200-86 200 86v-518H280v518Zm0-518h400-400Z"/>
      </svg>`;
    function updateLabelIndicator() {
      const existing = mainLabel.querySelector(".indicate-save-inputs-svg");
      if (existing) existing.remove();
      if (saveToggle.checked) mainLabel.insertAdjacentHTML("beforeend", indicatorSVG);
    }

    // -------- Label text helpers (keep icons intact) ----------
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

    // -------- Collect real form inputs in the group (exclude the options panel) ----------
    const inputs = Array.from(group.querySelectorAll("input, textarea, select"))
      .filter(el => el !== saveToggle && !el.closest(".input-options"));

    // Stable key for each element
    function keyFor(el, index) {
      return el.dataset.persistKey || el.name || el.id || `${el.tagName.toLowerCase()}:${el.type || ""}#${index}`;
    }

    // Get/set value for different types
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
          const radios = group.querySelectorAll(`input[type="radio"][name="${CSS.escape(rec.name)}"]`);
          radios.forEach(r => { r.checked = (r.value === rec.v); });
          break;
        case "select-multi":
          if (!Array.isArray(rec.v)) break;
          Array.from(el.options).forEach(opt => { opt.selected = rec.v.includes(opt.value); });
          break;
        default: // "val"
          el.value = rec.v ?? "";
      }
    }

    // -------- Persist/restore all inputs ----------
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

      // store radios as a block
      payload.fields["__radios__"] = { t: "radios", v: payload.radios };
      localStorage.setItem(`value-${inputId}`, JSON.stringify(payload));
    }

    function restoreAllInputs() {
      if (!saveToggle.checked) return;
      const raw = localStorage.getItem(`value-${inputId}`);
      if (!raw) return;
      try {
        const payload = JSON.parse(raw) || {};
        const fields = payload.fields || {};
        const radios = (fields["__radios__"] && fields["__radios__"].v) || {};

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

    // -------- Restore toggle + label + values ----------
    const savedToggle = localStorage.getItem(`save-${inputId}`);
    if (savedToggle === "1") saveToggle.checked = true;
    else if (savedToggle === "0") saveToggle.checked = false;

    const savedLabel = localStorage.getItem(`label-${inputId}`);
    if (savedLabel) setLabelText(savedLabel);

    restoreAllInputs();
    updateLabelIndicator();

    // -------- Save toggle changes ----------
    saveToggle.addEventListener("change", () => {
      localStorage.setItem(`save-${inputId}`, saveToggle.checked ? "1" : "0");
      if (!saveToggle.checked) {
        localStorage.removeItem(`value-${inputId}`);
      } else {
        persistAllInputs();
      }
      updateLabelIndicator();
    });

    // -------- User-driven changes ----------
    inputs.forEach(el => {
      ["input","change","blur","keyup","paste","cut","drop"].forEach(ev =>
        el.addEventListener(ev, persistAllInputs)
      );
    });


    // -------- Programmatic changes (value/checked/setAttribute/attributes) ----------
    inputs.forEach(el => {
      // wrap .value if present
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
      // wrap .checked for checkbox/radio
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
      // wrap setAttribute
      const origSetAttr = el.setAttribute.bind(el);
      el.setAttribute = function(name, val) {
        origSetAttr(name, val);
        const n = String(name).toLowerCase();
        if (n === "value" || n === "checked" || n === "selected") {
          Promise.resolve().then(persistAllInputs);
        }
      };
      // mutation observer for attribute changes
      const mo = new MutationObserver(() => persistAllInputs());
      mo.observe(el, { attributes: true, attributeFilter: ["value","checked","selected","aria-checked"] });
    });

    // -------- Options actions (reset/rename/copy/paste) + close box ----------
    group.querySelectorAll(".input-options-item").forEach(option => {
      option.addEventListener("click", async () => {
        const action = option.dataset.action;
        if (!action) return; // ignore the save toggle row

        switch (action) {
          case "reset":
            inputs.forEach(el => {
              if(el.type == "text" || el.type == "number"){
                el.value = "";
              }else return;
            });

localStorage.removeItem(`value-${inputId}`);
saveToggle.checked = false;
localStorage.setItem(`value-${inputId}`, "0");
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
    // trigger your save/apply logic if needed:
    pasteTarget.dispatchEvent(new Event("input", { bubbles: true }));
  } catch (e) {
    console.warn("Clipboard read failed:", e);
  }
}
            break;
        }

        // close the options box after action
        if (optionsBox) optionsBox.classList.remove("show");
        if (expandBtn)  expandBtn.classList.remove("rotated");
      });
    });
  });
});

/*************************************** long press to copy - tooltip 
 *******************************/
 
 document.addEventListener("DOMContentLoaded", () => {
  enableLongPressCopy(".input-tooltip-float", 600); // selector + hold duration
});

function enableLongPressCopy(selector, holdTime = 600) {
  const tooltips = document.querySelectorAll(selector);
  let pressTimer;
  
  tooltips.forEach(tooltip => {
    // Start detecting long-press (mouse + touch)
    tooltip.addEventListener("mousedown", startPress);
    tooltip.addEventListener("touchstart", startPress);
    
    // Cancel long-press detection when released or moved away
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

/*******************************
 * error handling 
***************************/

/*function showError(message) {
  
}

function clearError(input) {
  
}*/

(function() {
  const activeMessages = [];

  const messageTypes = {
    error: { bg: 'linear-gradient(135deg, #ff4d4f, #ff7a6d)', icon: '✖' },
    success: { bg: 'linear-gradient(135deg, #4CAF50, #81C784)', icon: '✔' },
    info: { bg: 'linear-gradient(135deg, #2196F3, #64B5F6)', icon: 'ℹ' },
    warning: { bg: 'linear-gradient(135deg, #FFC107, #FFD54F)', icon: '⚠' }
  };

  function showMessage(message, type = 'error', duration = 3000) {
    if(activeMessages.length == 4) return;
    const msg = document.createElement('div');
    msg.innerHTML = `${messageTypes[type].icon} ${message}`;

    Object.assign(msg.style, {
      position: 'fixed',
      left: '50%',
      top: '10px',
      transform: 'translateX(-50%) translateY(-20px) scale(0.95) rotate(0deg)',
      background: messageTypes[type].bg,
      color: '#fff',
      padding: '15px 25px',
      borderRadius: '12px',
      boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
      opacity: '0',
      transition: 'all 0.4s ease',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold',
      minWidth: '250px',
      textAlign: 'center',
      cursor: 'pointer',
      zIndex: 9999
    });

    document.body.appendChild(msg);
    activeMessages.push(msg);
    updateStack();

    // Animate in
    requestAnimationFrame(() => {
      msg.style.opacity = '1';
      msg.style.transform = 'translateX(-50%) translateY(0) scale(1) rotate(0deg)';
    });

    // Auto-remove
    let timer = setTimeout(() => removeMessage(msg), duration);

    // Pause removal on hover
    msg.addEventListener('mouseenter', () => clearTimeout(timer));
    msg.addEventListener('mouseleave', () => {
      timer = setTimeout(() => removeMessage(msg), duration);
    });

    // Click to dismiss
    msg.addEventListener('click', () => removeMessage(msg));
  }

  function removeMessage(msg) {
    msg.style.opacity = '0';
    msg.style.transform = 'translateX(-50%) translateY(-20px) scale(0.95) rotate(0deg)';
    msg.addEventListener('transitionend', () => {
      msg.remove();
      const index = activeMessages.indexOf(msg);
      if (index > -1) activeMessages.splice(index, 1);
      updateStack();
    });
  }

  function updateStack() {
    const baseOffset = 20;
    activeMessages.forEach((msg, i) => {
      const scale = 1 - i * 0.05;
      const translateY = baseOffset + i * 10;
      const rotate = (i % 2 === 0 ? -2 : 2) * i; // slight alternating rotation
      msg.style.top = translateY + 'px';
      msg.style.transform = `translateX(-50%) translateY(0) scale(${scale}) rotate(${rotate}deg)`;
    });
  }

  window.showMessage = showMessage;
})();

function clearError(input) {
  
}