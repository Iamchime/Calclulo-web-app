window.addEventListener('DOMContentLoaded', function() {
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
    s = s.replace(/,/g, '').replace(/\s+/g, '').replace(/[%$£€₦¥₹]/g, '');
    s = s.replace(/[^\d.\-]/g, '');
    s = s.replace(/\.(?=.*\.)/g, '');
    const n = parseFloat(s);
    return isNaN(n) ? 0 : n;
  }
  
  function formatNumber(num) {
    if (!isFinite(num)) return '';
    return (Math.round((num + Number.EPSILON) * 100) / 100).toLocaleString(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});
  }
  
  function toggleTaxVisibility() {
    if (!taxInputGroup) return;
    // ✅ FIX: show tax input only if checkbox is checked
    taxInputGroup.style.display = taxCheckbox.checked ? 'block' : 'none';
  }
  
  function calculate() {
    const original = parseNumber(originalEl.value);
    const pct = parseNumber(percentEl.value);
    const taxRate = parseNumber(taxEl ? taxEl.value : 0);
    
    if ((original === 0 && originalEl.value.trim() === '') ||
      (pct === 0 && percentEl.value.trim() === '')) {
      finalEl.value = '';
      savingsEl.value = '';
      return;
    }
    
    const discountedNet = original * (1 - pct / 100);
    
    let finalPrice = 0;
    let savings = 0;
    
    if (taxCheckbox.checked) {
      // ✅ only apply tax if checkbox is checked
      const originalGross = original * (1 + taxRate / 100);
      finalPrice = discountedNet * (1 + taxRate / 100);
      savings = originalGross - finalPrice;
    } else {
      finalPrice = discountedNet;
      savings = original - discountedNet;
    }
    
    finalEl.value = formatNumber(finalPrice);
    savingsEl.value = formatNumber(savings);
  }
  
  [originalEl, percentEl, taxEl].forEach(el => {
    if (!el) return;
    el.addEventListener('input', calculate);
  });
  
  if (taxCheckbox) {
    taxCheckbox.addEventListener('change', function() {
      toggleTaxVisibility();
      calculate();
    });
  }
  
  // ✅ set initial UI correctly
  toggleTaxVisibility();
  calculate();
});