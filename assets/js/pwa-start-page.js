const hamburger = document.querySelector("#hamburger-menu");
const nav = document.querySelector(".side-nav");
const closeBtn = document.querySelector(".close-nav-btn");
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


hamburger.addEventListener("click", openNav);
closeBtn.addEventListener("click", closeNav);

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input-index");
  const searchResults = document.querySelector(".search-results-index");
  const clearBtn = document.querySelector(".clear-search-index");
  let toolsData = [];
  
  // Fetch keywords.json
  fetch("/assets/keywords.json")
    .then(res => res.json())
    .then(data => {
      toolsData = data.tools || [];
    })
    .catch(err => console.error("Error fetching JSON:", err));
  
  // Highlight matching text
  const highlightMatch = (text, query) => {
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, `<mark class="search-highlighted">$1</mark>`);
  };
  
  // Search Function
  const performSearch = (query) => {
    query = query.trim().toLowerCase();
    searchResults.innerHTML = "";
    
    if (query === "") {
      searchResults.classList.remove("active");
      return;
    }
    
    // Filter tools by tool name, category, or related keywords
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
    
    // Show results container
    searchResults.classList.add("active");
  };
  
  // Input Event
  searchInput.addEventListener("input", (e) => {
    performSearch(e.target.value);
  });
  
  // Clear Search
  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    searchResults.innerHTML = "";
    searchResults.classList.remove("active");
    searchInput.focus();
  });
  
  // Close results on outside click
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-wrapper-index") && !e.target.closest(".search-results-index")) {
      searchResults.classList.remove("active");
    }
  });
});

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