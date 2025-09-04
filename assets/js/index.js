if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('Service worker registered:', reg.scope))
      .catch(err => console.error('Service worker registration failed:', err));
  });
}
/*
  fetch('/assets/keywords.json')
    .then(res => res.json())
    .then(data => {
      const tools = data.tools;
      console.log("✅ Total calculators:", tools.length);
      
      tools.forEach((toolObj, index) => {
        console.log(`#${index + 1}: ${toolObj.tool}`);
      });
    })
    .catch(err => console.error("❌ Error loading JSON:", err));*/

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



/*****************/
