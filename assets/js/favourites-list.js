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