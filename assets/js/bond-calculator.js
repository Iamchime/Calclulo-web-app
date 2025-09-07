function calculateResults() {
  // Get all input values and remove any currency symbols or extra characters
  const priceInput = parseFloat(document.getElementById("priceinput").value.replace(/[^0-9.]/g, ""));
  const faceValue = parseFloat(document.getElementById("facevalue").value.replace(/[^0-9.]/g, ""));
  const yieldInput = parseFloat(document.getElementById("yield-input").value.replace(/[^0-9.]/g, "")) / 100;
  const maturity = parseFloat(document.getElementById("timeofmaturity").value.replace(/[^0-9.]/g, ""));
  const annualCoupon = parseFloat(document.getElementById("annualcoupon").value.replace(/[^0-9.]/g, ""));
  const couponFreq = document.getElementById("couponfrequencySelect").value;
  const couponType = document.getElementById("annualcouponCurrencyorPercent").value;
  const resultField = document.getElementById("bond-result");
  
  // Validate inputs
  if (
    isNaN(priceInput) || isNaN(faceValue) || isNaN(yieldInput) ||
    isNaN(maturity) || isNaN(annualCoupon)
  ) {
    resultField.value = "";
    return;
  }
  
  // Determine coupon frequency per year
  let freq = 1;
  switch (couponFreq) {
    case "semiannually":
      freq = 2;
      break;
    case "quarterly":
      freq = 4;
      break;
    case "monthly":
      freq = 12;
      break;
      // Default annually = 1
  }
  
  // Coupon payment per period
  let couponPayment;
  if (couponType === "percent") {
    couponPayment = (faceValue * (annualCoupon / 100)) / freq;
  } else {
    couponPayment = annualCoupon / freq;
  }
  
  const periods = maturity * freq;
  const discountRate = yieldInput / freq;
  
  // Calculate present value of coupons
  let pvCoupons = 0;
  for (let t = 1; t <= periods; t++) {
    pvCoupons += couponPayment / Math.pow(1 + discountRate, t);
  }
  
  // Present value of face value at maturity
  const pvFaceValue = faceValue / Math.pow(1 + discountRate, periods);
  
  // Total bond price estimate
  const bondPrice = pvCoupons + pvFaceValue;
  
  // Set final result WITHOUT any currency symbol
  if (couponType === "currency") {
    resultField.value = Number(bondPrice.toFixed(4)).toLocaleString();
  } else {
    resultField.value = Number(bondPrice.toFixed(2)).toLocaleString();
  }
}

// Make calculator auto-update on input
document.addEventListener("DOMContentLoaded", () => {
  const inputs = [
    "priceinput",
    "facevalue",
    "yield-input",
    "timeofmaturity",
    "annualcoupon",
    "couponfrequencySelect",
    "annualcouponCurrencyorPercent"
  ];
  
  inputs.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener("input", calculateResults);
      element.addEventListener("change", calculateResults);
    }
  });
});

window.addEventListener("load", () => {
  calculateResults();
});