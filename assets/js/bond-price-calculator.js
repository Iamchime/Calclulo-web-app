// --- helpers ---
function sanitizeNumber(selector) {
  const el = document.querySelector(selector);
  if (!el) return NaN;
  const raw = (el.value || "").toString().replace(/[^0-9.\-]/g, "");
  return raw === "" || raw === "-" || raw === "." ? NaN : parseFloat(raw);
}
function isEOMFeb(d) {
  return d.getMonth() === 1 && d.getDate() === new Date(d.getFullYear(), 2, 0).getDate();
}
function days360_US(d1, d2) {
  // US/NASD 30/360
  let D1 = d1.getDate(), D2 = d2.getDate();
  let M1 = d1.getMonth(), M2 = d2.getMonth();
  let Y1 = d1.getFullYear(), Y2 = d2.getFullYear();

  if (D1 === 31 || isEOMFeb(d1)) D1 = 30;
  if ((D2 === 31 && (D1 === 30 || D1 === 31)) || (isEOMFeb(d2) && D1 === 30)) D2 = 30;

  return (Y2 - Y1) * 360 + (M2 - M1) * 30 + (D2 - D1);
}
function daysActual(d1, d2) {
  const ms = 1000 * 60 * 60 * 24;
  return Math.floor((d2 - d1) / ms);
}
function isValidDate(d) {
  return d instanceof Date && !isNaN(d.getTime());
}
function addMonths(date, months) {
  const d = new Date(date);
  const day = d.getDate();
  d.setMonth(d.getMonth() + months);
  // keep end-of-month behavior consistent
  if (d.getDate() < day) d.setDate(0);
  return d;
}

// --- main calc ---
function calculateResults() {
  const fv = sanitizeNumber("#facevalue");
  const ytm = sanitizeNumber("#yield-input") / 100;
  const maturityDate = new Date(document.getElementById("timeofmaturity").value);
  const settlementDate = new Date(document.getElementById("settlementDate").value);
  const annualCouponInput = sanitizeNumber("#annualcoupon");
  const couponUnit = document.getElementById("annualcouponCurrencyorPercent")?.value || "percent";
  const freqStr = document.getElementById("couponfrequencySelect")?.value || "annually";

  const outEl = document.querySelector(".bond-price-results");
  const format = (v) =>
    v.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 });

  // validate
  if (
    !isFinite(fv) || !isFinite(ytm) || !isFinite(annualCouponInput) ||
    !isValidDate(maturityDate) || !isValidDate(settlementDate)
  ) {
    if (outEl) outEl.innerHTML = "";
    return;
  }
  if (settlementDate >= maturityDate) {
    if (outEl) outEl.innerHTML = `
      <p><strong>Dirty price:</strong> <span>${format(0)}</span></p>
      <p><strong>Clean price:</strong> <span>${format(0)}</span></p>
      <p><strong>Accrued interest:</strong> <span>${format(0)}</span></p>
      <p><strong>Interest accrued days:</strong> <span>0</span></p>`;
    return;
  }

  // frequency
  const freqMap = { annually: 1, semiannually: 2, quarterly: 4, monthly: 12 };
  const freq = freqMap[freqStr] || 1;
  const periodMonths = 12 / freq;

  // coupon per period (currency amount per coupon date)
  const couponPerYear = couponUnit === "percent" ? (annualCouponInput / 100) * fv : annualCouponInput;
  const cpn = couponPerYear / freq;

  // build schedule around settlement to get prev/next coupon dates
  // start from maturity and walk backward to get the prev coupon <= settlement
  let prevCoupon = new Date(maturityDate);
  while (prevCoupon > settlementDate) prevCoupon = addMonths(prevCoupon, -periodMonths);
  const nextCoupon = addMonths(prevCoupon, periodMonths);

  // accrued days by convention
  const dayCount = document.querySelector('input[name="daycountconvention"]:checked')?.value || "Actual/Actual";
  let accruedDays;
  let yearBasis;
  if (dayCount === "30/360") {
    accruedDays = days360_US(prevCoupon, settlementDate);
    yearBasis = 360;
  } else if (dayCount === "Actual/360") {
    accruedDays = daysActual(prevCoupon, settlementDate);
    yearBasis = 360;
  } else if (dayCount === "Actual/365") {
    accruedDays = daysActual(prevCoupon, settlementDate);
    yearBasis = 365;
  } else {
    // Actual/Actual (simple): use actual days and actual year length for the period's year
    accruedDays = daysActual(prevCoupon, settlementDate);
    const year = settlementDate.getFullYear();
    yearBasis = (new Date(year, 1, 29).getMonth() === 1) ? 366 : 365;
  }
  const accruedInterest = (cpn * accruedDays) / (yearBasis / freq);

  // number of remaining coupons (count from nextCoupon to maturity inclusive)
  let n = 0;
  for (let d = new Date(nextCoupon); d <= maturityDate; d = addMonths(d, periodMonths)) n++;

  // present value (clean price)
  const perRate = ytm / freq;
  let cleanPrice = 0;
  for (let t = 1; t <= n; t++) {
    cleanPrice += cpn / Math.pow(1 + perRate, t);
  }
  cleanPrice += fv / Math.pow(1 + perRate, n);

  const dirtyPrice = cleanPrice + accruedInterest;

  if (outEl) {
    outEl.innerHTML = `
      <p><strong>Dirty price:</strong> <span><span class="currency-display-for-expanded-results" >$
  </span>${format(dirtyPrice)}</span></p>
      <p><strong>Clean price:</strong>  <span><span class="currency-display-for-expanded-results" >$
  </span>${format(cleanPrice)}</span></p>
      <p><strong>Accrued interest:</strong>  <span><span class="currency-display-for-expanded-results" >$
  </span>${format(accruedInterest)}</span></p>
      <p><strong>Interest accrued days:</strong>  <span>${accruedDays}</span></p>
    `;
  }
  loadSavedCurrency();
}

// auto-calc on any change
function enableAutoCalculation() {
  const selectors = [
    "#facevalue", "#yield-input", "#timeofmaturity", "#settlementDate",
    "#annualcoupon", "#annualcouponCurrencyorPercent", "#couponfrequencySelect",
    "input[name='daycountconvention']"
  ];
  document.addEventListener("input", (e) => {
    if (selectors.some(s => e.target.matches(s))) calculateResults();
  });
  document.addEventListener("change", (e) => {
    if (selectors.some(s => e.target.matches(s))) calculateResults();
  });
  // initial run if fields are prefilled
  calculateResults();
}
window.addEventListener("DOMContentLoaded", enableAutoCalculation);