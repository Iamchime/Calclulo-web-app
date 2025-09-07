document.addEventListener("DOMContentLoaded", () => {
  const linearRadio = document.getElementById("linearBinomials");
  const generalRadio = document.getElementById("Generalbinomials");
  
  const exponentMGroup = document.getElementById("ExponentM").closest(".input-group");
  const exponentNGroup = document.getElementById("Exponentm").closest(".input-group");
  const resultBox = document.querySelector(".foil-results");
  
  // Toggle exponent input-groups visibility
  function toggleExponentGroups() {
    if (generalRadio.checked) {
      exponentMGroup.style.display = "block";
      exponentNGroup.style.display = "block";
    } else {
      exponentMGroup.style.display = "none";
      exponentNGroup.style.display = "none";
    }
    calculateResults(); // Auto-update when toggling mode
  }
  
  // Core calculation
  function calculateResults() {
    const a = parseFloat(document.getElementById("a").value) || 0;
    const b = parseFloat(document.getElementById("b").value) || 0;
    const c = parseFloat(document.getElementById("c").value) || 0;
    const d = parseFloat(document.getElementById("d").value) || 0;
    
    const n = parseFloat(document.getElementById("Exponentm").value) || 1;
    const m = parseFloat(document.getElementById("ExponentM").value) || 1;
    
    const isGeneral = generalRadio.checked;
    
    const termA = `${a}x${isGeneral ? n : ""}`;
    const termB = b;
    const termC = `${c}x${isGeneral ? m : ""}`;
    const termD = d;
    
    // FOIL calculations
    const firstCoef = a * c;
    const firstExp = isGeneral ? n + m : 2;
    const first = `${firstCoef}x${firstExp}`;
    
    const outerCoef = a * d;
    const outerExp = isGeneral ? n : 1;
    const outer = `${outerCoef}x${outerExp}`;
    
    const innerCoef = b * c;
    const innerExp = isGeneral ? m : 1;
    const inner = `${innerCoef}x${innerExp}`;
    
    const last = b * d;
    const midSum = outerCoef + innerCoef;
    
    const result = `
      <div class="result-head"><strong>Results</strong></div>
      <p><strong>FOIL Method:</strong></p>
      <p>(${termA} + ${termB}) ⋅ (${termC} + ${termD}) =</p>
      <p>First + Outer + Inner + Last</p>
      <br/>
      <p>First: ${a}x${isGeneral ? n : ""} ⋅ ${c}x${isGeneral ? m : ""} = ${first}</p>
      <p>Outer: ${a}x${isGeneral ? n : ""} ⋅ ${d} = ${outer}</p>
      <p>Inner: ${b} ⋅ ${c}x${isGeneral ? m : ""} = ${inner}</p>
      <p>Last: ${b} ⋅ ${d} = ${last}</p>
      <br/>
      <p><strong>Final Result:</strong><br/>
      (${termA} + ${termB}) ⋅ (${termC} + ${termD}) =<br/>
      ${first} + ${midSum}x${isGeneral ? Math.max(n, m) : 1} + ${last}
      </p>
    `;
    
    resultBox.innerHTML = result;
  }
  
  // Attach auto-calculate to all inputs
  const inputs = document.querySelectorAll("#a, #b, #c, #d, #Exponentm, #ExponentM");
  inputs.forEach(input => {
    input.addEventListener("input", calculateResults);
  });
  
linearRadio.addEventListener("change", toggleExponentGroups);
  generalRadio.addEventListener("change", toggleExponentGroups);
});

window.addEventListener("load", () => {
  calculateResults();
});