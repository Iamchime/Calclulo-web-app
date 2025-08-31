/*const currencySelect = document.getElementById('selectedCurrency');
const currencyListWrapper = document.getElementById('currencyListWrapper');
const searchInput = document.getElementById('searchCurrency');
const currencyList = document.getElementById('currency-list');

const currencies = [
  { code: 'usd', symbol: '$' },
  { code: 'eur', symbol: '€' },
  { code: 'gbp', symbol: '£' },
  { code: 'ngn', symbol: '₦' },
  { code: 'inr', symbol: '₹' },
  { code: 'jpy', symbol: '¥' },
  { code: 'cad', symbol: 'C$' },
  { code: 'aud', symbol: 'A$' }
];

let selectedCurrency = 'usd';
let selectedSymbol = '$';
let hasClickedCurrency = false;
let blinkInterval = null;

// Public getter (you can use this in your calculator logic)
window.getCurrency = () => ({ code: selectedCurrency, symbol: selectedSymbol });

function startBlink() {
  blinkInterval = setInterval(() => {
    currencySelect.classList.toggle('blink');
  }, 700);
}

function stopBlink() {
  clearInterval(blinkInterval);
  currencySelect.classList.remove('blink');
  hasClickedCurrency = true;
}

function renderCurrencyList(filter = '') {
  currencyList.innerHTML = '';
  currencies
    .filter(c => c.code.includes(filter.toLowerCase()))
    .forEach(currency => {
      const li = document.createElement('li');
      li.textContent = `${currency.code.toUpperCase()} (${currency.symbol})`;
      li.addEventListener('click', () => {
        selectedCurrency = currency.code;
        selectedSymbol = currency.symbol;
        currencySelect.textContent = currency.code.toUpperCase();
        currencyListWrapper.style.display = 'none';
      });
      currencyList.appendChild(li);
    });
}

currencySelect.addEventListener('click', (e) => {
  e.stopPropagation();
  if (!hasClickedCurrency) stopBlink();
  const show = currencyListWrapper.style.display !== 'block';
  currencyListWrapper.style.display = show ? 'block' : 'none';
  if (show) {
    searchInput.value = '';
    renderCurrencyList();
  }
});

searchInput.addEventListener('input', () => {
  renderCurrencyList(searchInput.value);
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.currency-select') && !e.target.closest('.currency-list')) {
    currencyListWrapper.style.display = 'none';
  }
});

startBlink();*/