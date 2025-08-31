(function() {
  const FAVS_KEY = "calculatorFavourites";
  
  const outlineIcon = `<svg class="fav-icon heart-outline" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/></svg>`;
  
  const filledIcon = `<svg class="fav-icon heart-filled" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M718-313 604-426l57-56 57 56 141-141 57 56-198 198ZM440-501Zm0 381L313-234q-72-65-123.5-116t-85-96q-33.5-45-49-87T40-621q0-94 63-156.5T260-840q52 0 99 22t81 62q34-40 81-62t99-22q81 0 136 45.5T831-680h-85q-18-40-53-60t-73-20q-51 0-88 27.5T463-660h-46q-31-45-70.5-72.5T260-760q-57 0-98.5 39.5T120-621q0 33 14 67t50 78.5q36 44.5 98 104T440-228q26-23 61-53t56-50l9 9 19.5 19.5L605-283l9 9q-22 20-56 49.5T498-172l-58 52Z"/></svg>`;
  
  function loadFavourites() {
    return JSON.parse(localStorage.getItem(FAVS_KEY)) || [];
  }
  
  function saveFavourites(favs) {
    localStorage.setItem(FAVS_KEY, JSON.stringify(favs));
  }
  
  function toggleFavourite(button) {
    const id = button.dataset.id;
    const name = button.dataset.name;
    const link = button.dataset.link || window.location.pathname;
    let favs = loadFavourites();
    
    const exists = favs.find(fav => fav.id === id);
    if (exists) {
      favs = favs.filter(fav => fav.id !== id);
      
    } else {
      favs.push({ id, name, link, dateAdded: new Date().toISOString() });
      
    }
    
    saveFavourites(favs);
    updateFavButtonState(button);
  }
  
  function updateFavButtonState(button) {
    const id = button.dataset.id;
    const favs = loadFavourites();
    const isFavourited = favs.find(fav => fav.id === id);
    
    const iconHTML = isFavourited ? filledIcon : outlineIcon;
    const label = isFavourited ? "Favourite" : "Favourite";
    
    button.innerHTML = `${iconHTML}${label}`;
    
    if (isFavourited) {
      button.classList.add("fav-active");
    } else {
      button.classList.remove("fav-active");
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".fav-btn").forEach(btn => {
      updateFavButtonState(btn);
      btn.addEventListener("click", () => toggleFavourite(btn));
    });
  });
})();