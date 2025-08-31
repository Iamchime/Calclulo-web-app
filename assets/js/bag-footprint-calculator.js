function calculateResults() {
  const bagTypeEl = document.querySelector('input[name="bagtype"]:checked');
  if (!bagTypeEl) return;
  const bagType = bagTypeEl.value;
  
  const uses = parseFloat(document.getElementById('numberofuse').value.replace(/,/g, ''));
  const disposed = parseFloat(document.getElementById('numberofbagdisposed').value.replace(/,/g, ''));
  const frequency = document.getElementById('frequency').value;
  const resultDiv = document.querySelector('.bag-footprint-result');
  
  if (isNaN(uses) || uses <= 0 || isNaN(disposed) || disposed <= 0) {
    resultDiv.innerHTML = `<p id="error-txt" style="color: red;">Please enter valid positive numbers.</p>`;
    return;
  }
  
  const usageThresholds = {
    paperbag: 1665,
    reusableplasticbag: 2220,
    materialbag: 72705,
    plasticbag: 555 // baseline
  };
  
  const selectedThreshold = usageThresholds[bagType];
  const comparisonText = uses >= selectedThreshold ?
    `<span style="color: green;"><strong>Great choice!</strong> Your usage exceeds the break-even point of ${selectedThreshold} uses.</span>` :
    `<span style="color: red;"><strong> Not sustainable yet.</strong> You need to use it at least <strong>${selectedThreshold.toLocaleString(undefined, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
})}</strong> times to match the carbon footprint of a plastic bag used 555 times.</span>`;
  
  // Calculate yearly plastic waste
  const frequencyMap = {
    Day: 365,
    Week: 52,
    Month: 12,
    'half-a-year': 2,
    year: 1
  };
  
  const sanitizetext = (bagtype) => {
    switch (bagtype) {
      case 'plasticbag':
        return 'plastic bag';
      case 'paperbag':
        return 'paper bag';
      case 'materialbag':
        return 'material bag';
      case 'reusableplasticbag':
        return 'reusable plastic bag';
      default:
    }
  }
  
  const yearlyBags = Math.round(disposed * frequencyMap[frequency]);
  const yearlyPlasticWasteKg = (yearlyBags * 0.025);
  
  resultDiv.innerHTML = `
    <div class="footprint-sec-one" ">
      <p><strong>Selected Bag:</strong> <span class="span-info">${sanitizetext(bagType)}</span></p>
      <p><strong>Your planned usage:</strong> <span class="span-info">${uses.toLocaleString()} times</span></p>
      <p class="comparison-text">${comparisonText}</p>
    </div>

    <div class="footprint-sec-two" >
      <p><strong>Plastic waste impact:</strong></p>
      <ul style="line-height: 1.6; margin-left: 1rem;">
        <li><strong>~${yearlyPlasticWasteKg.toLocaleString(undefined, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
})}</strong> <strong>kg</strong> of plastic trash/year</li>
        <li>Plastic can take <strong>500+ years</strong> to decompose</li>
        <li>Only <strong>1%</strong> of plastic bags are recycled</li>
        <li>Plastic bags are made from <strong>nonrenewable petroleum (HDPE)</strong></li>
      </ul>
    </div>
  `;
}
function resetFields() {
  document.getElementById('numberofuse').value = '';
  document.getElementById('numberofbagdisposed').value = '';
  document.getElementById('frequency').selectedIndex = 0;
  document.querySelector('#plasticbag').checked = true;
  document.querySelector('.bag-footprint-result').innerHTML = '';
}

// Auto-calculate on input changes
document.querySelectorAll('input[name="bagtype"], #numberofuse, #numberofbagdisposed, #frequency').forEach(el => {
  el.addEventListener('input', calculateResults);
  el.addEventListener('change', calculateResults);
});
