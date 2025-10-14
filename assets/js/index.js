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

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('Service worker registered:', reg.scope))
      .catch(err => console.error('Service worker registration failed:', err));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input-index");
  const searchResults = document.querySelector(".search-results-index");
  const clearBtn = document.querySelector(".clear-search-index");
  let toolsData = [];
  
  fetch("/assets/keywords.json")
    .then(res => res.json())
    .then(data => {
      toolsData = data.tools || [];
    })
    .catch(err => console.error("Error fetching JSON:", err));
  
  const highlightMatch = (text, query) => {
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, `<mark class="search-highlighted">$1</mark>`);
  };
  
  const performSearch = (query) => {
    query = query.trim().toLowerCase();
    searchResults.innerHTML = "";
    
    if (query === "") {
      searchResults.classList.remove("active");
      return;
    }
  
    const filtered = toolsData.filter(toolObj => {
      const toolName = toolObj.tool.toLowerCase();
      const category = toolObj.category.toLowerCase();
      const keywords = toolObj.relatedKeywords.map(k => k.toLowerCase());
      
      return (
        toolName.includes(query) ||
        category.includes(query) ||
        keywords.some(k => k.includes(query))
      );
    });
    
    if (filtered.length === 0) {
      searchResults.innerHTML = `<p class="no-results">No results found</p>
      <a class="request-calculator-btn" href="mailto:hello@calclulo.com"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>request calculator</a>
      `;
    } else {
      filtered.forEach(toolObj => {
        const highlightedTool = highlightMatch(toolObj.tool, query);
        const highlightedCategory = highlightMatch(toolObj.category.replace("Calculators", ""), query);
        
        const resultItem = document.createElement("a");
        resultItem.href = toolObj.link;
        resultItem.classList.add("search-result-item");
        resultItem.innerHTML = `
          <div>
            <strong >${highlightedTool}</strong>
            <span> ${highlightedCategory}</span>
          </div>
        `;
        searchResults.appendChild(resultItem);
      });
    }
    
    searchResults.classList.add("active");
  };
  
  searchInput.addEventListener("input", (e) => {
    performSearch(e.target.value);
  });
  
  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    searchResults.innerHTML = "";
    searchResults.classList.remove("active");
    searchInput.focus();
  });
  
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-wrapper-index") && !e.target.closest(".search-results-index")) {
      searchResults.classList.remove("active");
    }
  });
});



/****************************/

  fetch('/assets/keywords.json')
    .then(res => res.json())
    .then(data => {
      const tools = data.tools;
      console.log("✅ Total calculators:", tools.length);
      
      tools.forEach((toolObj, index) => {
        console.log(`#${index + 1}: ${toolObj.tool}`);
      });
    })
    .catch(err => console.error(" Error loading JSON:", err));

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

