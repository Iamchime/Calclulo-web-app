function parseNumber(val) {
  if (val == null || val === "") return 0;
  return Number(val.toString().replace(/,/g, "")) || 0;
}
function fmt(n) {
  return "₦" + (Number(n) || 0).toLocaleString();
}
function getVal(id) {
  const el = document.getElementById(id);
  return el ? parseNumber(el.value) : 0;
}
function attach(id, fn) {
  const el = document.getElementById(id);
  if (el) el.addEventListener("input", fn);
}

// ---------- main calc ----------
function calculatePAYE() {
  const income = getVal("gross-annual-income");
  const resultEl = document.getElementById("resultdiv");
  if (!resultEl) return;

  if (income <= 0) {
    resultEl.innerHTML = "";
    return;
  }

  // Optional deductions
  // --- NHF: use default ₦850 when the NHF field is missing or left empty (matches gov calculator) ---
  const nhfEl = document.getElementById("nhf-contribution");
  const nhf = nhfEl
    ? (String(nhfEl.value).trim() === "" ? 850 : parseNumber(nhfEl.value))
    : 850;

  const nhis   = getVal("nhis-contribution");
  const pension= getVal("pension-contribution");
  const loan   = getVal("interest-on-loan-for-owner-occupied-house");
  const life   = getVal("life-insurance-premium");
  const life2  = getVal("life-insurance-premium-you-and-spouse");
  const rentRaw= getVal("annual-rent");

  // --- NEW (minimal change) ---
  // Rent relief = 20% of annual rent, capped at ₦500,000 (so we deduct rentRelief, not full rent).
  const rentRelief = Math.min(rentRaw * 0.20, 500000);

  const totalDeductions = nhf + nhis + pension + loan + life + life2 + rentRelief;

  let taxableIncome = income - totalDeductions;
  if (taxableIncome < 0) taxableIncome = 0;

  // ---- New Law brackets ----
  let remaining = taxableIncome;
  let tax = 0;
  const brackets = [];

  let b0 = Math.min(800000, remaining);
  brackets.push({ label: "First ₦800,000 @ 0%", income: b0, due: 0 });
  remaining -= b0;

  let b1 = Math.min(2200000, Math.max(0, remaining));
  tax += b1 * 0.15;
  brackets.push({ label: "Next ₦2,200,000 @ 15%", income: b1, due: b1 * 0.15 });
  remaining -= b1;

  let b2 = Math.min(9000000, Math.max(0, remaining));
  tax += b2 * 0.18;
  brackets.push({ label: "Next ₦9,000,000 @ 18%", income: b2, due: b2 * 0.18 });
  remaining -= b2;

  // 13,000,000 band = 21%
  let b3 = Math.min(13000000, Math.max(0, remaining));
  tax += b3 * 0.21;
  brackets.push({ label: "Next ₦13,000,000 @ 21%", income: b3, due: b3 * 0.21 });
  remaining -= b3;

  let b4 = Math.min(25000000, Math.max(0, remaining));
  tax += b4 * 0.23;
  brackets.push({ label: "Next ₦25,000,000 @ 23%", income: b4, due: b4 * 0.23 });
  remaining -= b4;

  let b5 = Math.max(0, remaining);
  tax += b5 * 0.25;
  brackets.push({ label: "Above ₦50,000,000 @ 25%", income: b5, due: b5 * 0.25 });

  const monthlySalary = income / 12;
  const monthlyTax = tax / 12;
  const effRate = income > 0 ? ((tax / income) * 100).toFixed(2) : "0.00";

  // ---- render ----
  const html = `
    <h3>PAYE Calculation </h3>

    <table class="box table-income" width="100%">
      <tr><th colspan="2">Income Breakdown</th></tr>
      <tr><td>Gross Annual Income</td><td>${fmt(income)}</td></tr>
      <tr><td>NHF Contribution</td><td>(${fmt(nhf)})</td></tr>
      <tr><td>NHIS Contribution</td><td>(${fmt(nhis)})</td></tr>
      <tr><td>Pension Contribution</td><td>(${fmt(pension)})</td></tr>
      <tr><td>Interest on Loan for Owner Occupied House</td><td>(${fmt(loan)})</td></tr>
      <tr><td>Life Insurance Premium</td><td>(${fmt(life)})</td></tr>
      <tr><td>Life Insurance Premium (You & Spouse)</td><td>(${fmt(life2)})</td></tr>
      <tr><td>Annual Rent (Deductible Rent Relief)</td><td>(${fmt(rentRelief)})</td></tr>
      <tr><td><b>Taxable Income</b></td><td><b>${fmt(taxableIncome)}</b></td></tr>
    </table>
    <br>

    <table class="box table-brackets" width="100%">
      <tr><th>Tax Brackets</th><th>Taxable Income</th><th>Tax Due</th></tr>
      ${brackets.map(b => `
        <tr>
          <td>${b.label}</td>
          <td>${fmt(b.income)}</td>
          <td>${fmt(b.due)}</td>
        </tr>
      `).join("")}
      <tr>
        <td><b>Total</b></td>
        <td><b>${fmt(taxableIncome)}</b></td>
        <td><b>${fmt(tax)}</b></td>
      </tr>
    </table>
    <br>

    <table class="box table-summary" width="100%">
      <tr><th colspan="2">Summary</th></tr>
      <tr><td>Monthly Salary</td><td>${fmt(monthlySalary)}</td></tr>
      <tr><td>Monthly PAYE Tax</td><td>${fmt(monthlyTax)}</td></tr>
      <tr><td>Effective Tax Rate</td><td>${effRate}%</td></tr>
    </table>
  `;

  resultEl.innerHTML = html;
}

// Auto-calc on input for whatever fields exist
[
  "gross-annual-income",
  "nhf-contribution",
  "nhis-contribution",
  "pension-contribution",
  "interest-on-loan-for-owner-occupied-house",
  "life-insurance-premium",
  "life-insurance-premium-you-and-spouse",
  "annual-rent"
].forEach(id => attach(id, calculatePAYE));

window.addEventListener("load", () => {
  calculatePAYE();
});