document.addEventListener("DOMContentLoaded", function() {
  let tools = [];
  
  const input = document.getElementById("search-global-input");
  const resultsDiv = document.querySelector(".search-results-div");
  
  fetch("/assets/keywords.json")
    .then(res => res.json())
    
    .then(data => {
      tools = data.tools;
    })
    .catch(err => console.error("Failed to load JSON:", err));
  
  input.addEventListener("input", function() {
    const query = input.value.toLowerCase().trim();
    resultsDiv.innerHTML = "";
    
    if (!query) return;
    
    const matches = tools.filter(item =>
      item.tool.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.relatedKeywords.some(k => k.toLowerCase().includes(query))
    ).slice(0, 8);
    if (matches.length === 0) {
      resultsDiv.innerHTML = `<p id="no-results-found-p">No results found</p>`;
      return;
    }
    
    resultsDiv.innerHTML = matches.map(item => {
      return `<div>  
        <a class="search-results-a" href="${item.link}">${item.tool} <span> ${item.category.replace("Calculators","")}</span></a>  
      </div>`;
    }).join("");
  });
});