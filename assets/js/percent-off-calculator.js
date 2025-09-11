
document.addEventListener('DOMContentLoaded', function () {
  const originalEl = document.getElementById('originalPrice');
  const percentEl = document.getElementById('percentOff');
  const taxEl = document.getElementById('salesTax');
  const taxCheckbox = document.getElementById('taxation');
  const finalEl = document.getElementById('finalPrice');
  const savingsEl = document.getElementById('savings');
  const taxInputGroup = document.querySelector("[data-input-id='sales-tax-percent-off-calculator']");

  function parseNumber(value) {
    if (value === undefined || value === null) return 0;
    let s = String(value).trim();
    if (s === '') return 0;
    // Remove common non-numeric characters (commas, currency symbols, percent signs, spaces)
    s = s.replace(/,/g, '').replace(/\s+/g, '').replace(/[%$£€₦¥₹]/g, '');
    // Remove any other unexpected characters but keep leading minus and the decimal point
    s = s.replace(/[^\d.\-]/g, '');
    // Remove extra dots if the user pasted a malformed number (keep first dot)
    s = s.replace(/\.(?=.*\.)/g, '');
    const n = parseFloat(s);
    return isNaN(n) ? 0 : n;
  }

  function formatNumber(num) {
    if (!isFinite(num)) return '';
    // Round to 2 decimal places (string), no currency symbol
    return (Math.round((num + Number.EPSILON) * 100) / 100).toFixed(2);
  }

  function toggleTaxVisibility() {
    if (!taxInputGroup) return;
    taxInputGroup.style.display = taxCheckbox.checked ? 'block' : 'none';
  }

  function calculate() {
    const original = parseNumber(originalEl.value);
    const pct = parseNumber(percentEl.value); // e.g. 20 or -10
    const taxRate = parseNumber(taxEl ? taxEl.value : 0); // percent, e.g. 8.25
    const priceIncludesTax = !!taxCheckbox.checked;

    // If nothing meaningful entered, clear outputs
    if ((original === 0 && originalEl.value.trim() === '') || (pct === 0 && percentEl.value.trim() === '')) {
      finalEl.value = '';
      savingsEl.value = '';
      return;
    }

    // discounted net price (before adding tax if price excludes tax)
    const discountedNet = original * (1 - pct / 100);

    let finalPrice = 0;
    let savings = 0;

    if (priceIncludesTax) {
      // The user-entered original already includes tax: apply discount directly to that number.
      finalPrice = discountedNet;
      savings = original - finalPrice;
    } else {
      // Entered original excludes tax.
      if (taxRate && taxRate !== 0) {
        const originalGross = original * (1 + taxRate / 100);
        finalPrice = discountedNet * (1 + taxRate / 100);
        savings = originalGross - finalPrice; // gross savings (what the shopper actually pays less)
      } else {
        finalPrice = discountedNet;
        savings = original - discountedNet;
      }
    }

    finalEl.value = formatNumber(finalPrice);
    savingsEl.value = formatNumber(savings);
  }

  // wire events
  [originalEl, percentEl, taxEl].forEach(el => {
    if (!el) return;
    el.addEventListener('input', calculate);
    // optionally strip spaces while typing (does not add formatting)
  });

  if (taxCheckbox) {
    taxCheckbox.addEventListener('change', function () {
      toggleTaxVisibility();
      calculate();
    });
  }

  // initial state
  toggleTaxVisibility();
  calculate();
});