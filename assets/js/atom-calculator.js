// Atom Calculator JavaScript
// - Full element database (1-118)
// - Inputs auto-update each other
// - Handles numbers with commas
// - Uses showMessage(message, "error") for errors
// - Fixes: total mass uses isotope mass (protons + neutrons) when available
// - Fixes: atomic number remains editable (no cursor jump). Do not force-format a field while it's focused.

// -----------------------------
// Full element database
// -----------------------------
const elementData = {
  1:  { symbol: 'H',  name: 'Hydrogen',      atomicMass: 1.008 },
  2:  { symbol: 'He', name: 'Helium',        atomicMass: 4.002602 },
  3:  { symbol: 'Li', name: 'Lithium',       atomicMass: 6.94 },
  4:  { symbol: 'Be', name: 'Beryllium',     atomicMass: 9.0121831 },
  5:  { symbol: 'B',  name: 'Boron',         atomicMass: 10.81 },
  6:  { symbol: 'C',  name: 'Carbon',        atomicMass: 12.011 },
  7:  { symbol: 'N',  name: 'Nitrogen',      atomicMass: 14.007 },
  8:  { symbol: 'O',  name: 'Oxygen',        atomicMass: 15.999 },
  9:  { symbol: 'F',  name: 'Fluorine',      atomicMass: 18.998403163 },
  10: { symbol: 'Ne', name: 'Neon',          atomicMass: 20.1797 },
  11: { symbol: 'Na', name: 'Sodium',        atomicMass: 22.98976928 },
  12: { symbol: 'Mg', name: 'Magnesium',     atomicMass: 24.305 },
  13: { symbol: 'Al', name: 'Aluminium',     atomicMass: 26.9815385 },
  14: { symbol: 'Si', name: 'Silicon',       atomicMass: 28.085 },
  15: { symbol: 'P',  name: 'Phosphorus',    atomicMass: 30.973761998 },
  16: { symbol: 'S',  name: 'Sulfur',        atomicMass: 32.06 },
  17: { symbol: 'Cl', name: 'Chlorine',      atomicMass: 35.45 },
  18: { symbol: 'Ar', name: 'Argon',         atomicMass: 39.948 },
  19: { symbol: 'K',  name: 'Potassium',     atomicMass: 39.0983 },
  20: { symbol: 'Ca', name: 'Calcium',       atomicMass: 40.078 },
  21: { symbol: 'Sc', name: 'Scandium',      atomicMass: 44.955908 },
  22: { symbol: 'Ti', name: 'Titanium',      atomicMass: 47.867 },
  23: { symbol: 'V',  name: 'Vanadium',      atomicMass: 50.9415 },
  24: { symbol: 'Cr', name: 'Chromium',      atomicMass: 51.9961 },
  25: { symbol: 'Mn', name: 'Manganese',     atomicMass: 54.938044 },
  26: { symbol: 'Fe', name: 'Iron',          atomicMass: 55.845 },
  27: { symbol: 'Co', name: 'Cobalt',        atomicMass: 58.933194 },
  28: { symbol: 'Ni', name: 'Nickel',        atomicMass: 58.6934 },
  29: { symbol: 'Cu', name: 'Copper',        atomicMass: 63.546 },
  30: { symbol: 'Zn', name: 'Zinc',          atomicMass: 65.38 },
  31: { symbol: 'Ga', name: 'Gallium',       atomicMass: 69.723 },
  32: { symbol: 'Ge', name: 'Germanium',     atomicMass: 72.630 },
  33: { symbol: 'As', name: 'Arsenic',       atomicMass: 74.921595 },
  34: { symbol: 'Se', name: 'Selenium',      atomicMass: 78.971 },
  35: { symbol: 'Br', name: 'Bromine',       atomicMass: 79.904 },
  36: { symbol: 'Kr', name: 'Krypton',       atomicMass: 83.798 },
  37: { symbol: 'Rb', name: 'Rubidium',      atomicMass: 85.4678 },
  38: { symbol: 'Sr', name: 'Strontium',     atomicMass: 87.62 },
  39: { symbol: 'Y',  name: 'Yttrium',       atomicMass: 88.90584 },
  40: { symbol: 'Zr', name: 'Zirconium',     atomicMass: 91.224 },
  41: { symbol: 'Nb', name: 'Niobium',       atomicMass: 92.90637 },
  42: { symbol: 'Mo', name: 'Molybdenum',    atomicMass: 95.95 },
  43: { symbol: 'Tc', name: 'Technetium',    atomicMass: 98.0 },
  44: { symbol: 'Ru', name: 'Ruthenium',     atomicMass: 101.07 },
  45: { symbol: 'Rh', name: 'Rhodium',       atomicMass: 102.90550 },
  46: { symbol: 'Pd', name: 'Palladium',     atomicMass: 106.42 },
  47: { symbol: 'Ag', name: 'Silver',        atomicMass: 107.8682 },
  48: { symbol: 'Cd', name: 'Cadmium',       atomicMass: 112.414 },
  49: { symbol: 'In', name: 'Indium',        atomicMass: 114.818 },
  50: { symbol: 'Sn', name: 'Tin',           atomicMass: 118.710 },
  51: { symbol: 'Sb', name: 'Antimony',      atomicMass: 121.760 },
  52: { symbol: 'Te', name: 'Tellurium',     atomicMass: 127.60 },
  53: { symbol: 'I',  name: 'Iodine',        atomicMass: 126.90447 },
  54: { symbol: 'Xe', name: 'Xenon',         atomicMass: 131.293 },
  55: { symbol: 'Cs', name: 'Caesium',       atomicMass: 132.90545196 },
  56: { symbol: 'Ba', name: 'Barium',        atomicMass: 137.327 },
  57: { symbol: 'La', name: 'Lanthanum',     atomicMass: 138.90547 },
  58: { symbol: 'Ce', name: 'Cerium',        atomicMass: 140.116 },
  59: { symbol: 'Pr', name: 'Praseodymium',  atomicMass: 140.90766 },
  60: { symbol: 'Nd', name: 'Neodymium',     atomicMass: 144.242 },
  61: { symbol: 'Pm', name: 'Promethium',    atomicMass: 145.0 },
  62: { symbol: 'Sm', name: 'Samarium',      atomicMass: 150.36 },
  63: { symbol: 'Eu', name: 'Europium',      atomicMass: 151.964 },
  64: { symbol: 'Gd', name: 'Gadolinium',    atomicMass: 157.25 },
  65: { symbol: 'Tb', name: 'Terbium',       atomicMass: 158.92535 },
  66: { symbol: 'Dy', name: 'Dysprosium',    atomicMass: 162.500 },
  67: { symbol: 'Ho', name: 'Holmium',       atomicMass: 164.93033 },
  68: { symbol: 'Er', name: 'Erbium',        atomicMass: 167.259 },
  69: { symbol: 'Tm', name: 'Thulium',       atomicMass: 168.93422 },
  70: { symbol: 'Yb', name: 'Ytterbium',     atomicMass: 173.045 },
  71: { symbol: 'Lu', name: 'Lutetium',      atomicMass: 174.9668 },
  72: { symbol: 'Hf', name: 'Hafnium',       atomicMass: 178.49 },
  73: { symbol: 'Ta', name: 'Tantalum',      atomicMass: 180.94788 },
  74: { symbol: 'W',  name: 'Tungsten',      atomicMass: 183.84 },
  75: { symbol: 'Re', name: 'Rhenium',       atomicMass: 186.207 },
  76: { symbol: 'Os', name: 'Osmium',        atomicMass: 190.23 },
  77: { symbol: 'Ir', name: 'Iridium',       atomicMass: 192.217 },
  78: { symbol: 'Pt', name: 'Platinum',      atomicMass: 195.084 },
  79: { symbol: 'Au', name: 'Gold',          atomicMass: 196.966569 },
  80: { symbol: 'Hg', name: 'Mercury',       atomicMass: 200.59 },
  81: { symbol: 'Tl', name: 'Thallium',      atomicMass: 204.3833 },
  82: { symbol: 'Pb', name: 'Lead',          atomicMass: 207.2 },
  83: { symbol: 'Bi', name: 'Bismuth',       atomicMass: 208.98040 },
  84: { symbol: 'Po', name: 'Polonium',      atomicMass: 209.0 },
  85: { symbol: 'At', name: 'Astatine',      atomicMass: 210.0 },
  86: { symbol: 'Rn', name: 'Radon',         atomicMass: 222.0 },
  87: { symbol: 'Fr', name: 'Francium',      atomicMass: 223.0 },
  88: { symbol: 'Ra', name: 'Radium',        atomicMass: 226.0254 },
  89: { symbol: 'Ac', name: 'Actinium',      atomicMass: 227.0 },
  90: { symbol: 'Th', name: 'Thorium',       atomicMass: 232.0377 },
  91: { symbol: 'Pa', name: 'Protactinium',  atomicMass: 231.03588 },
  92: { symbol: 'U',  name: 'Uranium',       atomicMass: 238.02891 },
  93: { symbol: 'Np', name: 'Neptunium',     atomicMass: 237.0 },
  94: { symbol: 'Pu', name: 'Plutonium',     atomicMass: 244.0 },
  95: { symbol: 'Am', name: 'Americium',     atomicMass: 243.0 },
  96: { symbol: 'Cm', name: 'Curium',        atomicMass: 247.0 },
  97: { symbol: 'Bk', name: 'Berkelium',     atomicMass: 247.0 },
  98: { symbol: 'Cf', name: 'Californium',   atomicMass: 251.0 },
  99: { symbol: 'Es', name: 'Einsteinium',   atomicMass: 252.0 },
 100: { symbol: 'Fm', name: 'Fermium',       atomicMass: 257.0 },
 101: { symbol: 'Md', name: 'Mendelevium',   atomicMass: 258.0 },
 102: { symbol: 'No', name: 'Nobelium',      atomicMass: 259.0 },
 103: { symbol: 'Lr', name: 'Lawrencium',    atomicMass: 266.0 },
 104: { symbol: 'Rf', name: 'Rutherfordium', atomicMass: 267.0 },
 105: { symbol: 'Db', name: 'Dubnium',       atomicMass: 268.0 },
 106: { symbol: 'Sg', name: 'Seaborgium',    atomicMass: 269.0 },
 107: { symbol: 'Bh', name: 'Bohrium',       atomicMass: 270.0 },
 108: { symbol: 'Hs', name: 'Hassium',       atomicMass: 269.0 },
 109: { symbol: 'Mt', name: 'Meitnerium',    atomicMass: 278.0 },
 110: { symbol: 'Ds', name: 'Darmstadtium',  atomicMass: 281.0 },
 111: { symbol: 'Rg', name: 'Roentgenium',   atomicMass: 282.0 },
 112: { symbol: 'Cn', name: 'Copernicium',   atomicMass: 285.0 },
 113: { symbol: 'Nh', name: 'Nihonium',      atomicMass: 286.0 },
 114: { symbol: 'Fl', name: 'Flerovium',     atomicMass: 289.0 },
 115: { symbol: 'Mc', name: 'Moscovium',     atomicMass: 290.0 },
 116: { symbol: 'Lv', name: 'Livermorium',   atomicMass: 293.0 },
 117: { symbol: 'Ts', name: 'Tennessine',    atomicMass: 294.0 },
 118: { symbol: 'Og', name: 'Oganesson',     atomicMass: 294.0 }
};

// -----------------------------
// Helpers
// -----------------------------
function $id(id) { return document.getElementById(id); }
const resultDiv = document.querySelector('.resultdiv');

// parseNumberInput: strips commas and whitespace; returns NaN for empty or invalid
function parseNumberInput(str) {
  if (typeof str !== 'string') return NaN;
  const cleaned = str.replace(/,/g, '').trim();
  if (cleaned === '') return NaN;
  // Allow negative sign for charge
  if (/^[+-]?\d+(\.\d+)?$/.test(cleaned)) return Number(cleaned);
  return NaN;
}

// formatNumberForInput: returns '' for NaN; optionally avoid commas (useful for AtomicNumber)
function formatNumberForInput(n, { noCommas = false, maxFractionDigits = 6 } = {}) {
  if (n === null || n === undefined || Number.isNaN(n)) return '';
  if (noCommas) return String(Math.trunc(n));
  if (Number.isInteger(n)) return n.toLocaleString('en-US');
  return (+n).toLocaleString('en-US', { maximumFractionDigits: maxFractionDigits });
}

// renderResult: structured HTML output
function renderResult(atomicNumber, massNumber, chargeNumber, protons, neutrons, electrons) {
  if (!resultDiv) return;
  const element = !Number.isNaN(atomicNumber) ? elementData[atomicNumber] : null;
// Compute total mass with realistic nucleon masses
let totalMassDisplay = '—';
if (!Number.isNaN(protons) && !Number.isNaN(neutrons) && !Number.isNaN(electrons)) {
  const mass = protons * 1.007276 + neutrons * 1.008665 + electrons * 0.00054858;
  totalMassDisplay = mass.toFixed(5) + ' u';
} else if (!Number.isNaN(protons) && !Number.isNaN(neutrons)) {
  const mass = protons * 1.007276 + neutrons * 1.008665;
  totalMassDisplay = mass.toFixed(5) + ' u';
} else if (!Number.isNaN(massNumber)) {
  totalMassDisplay = massNumber.toFixed(5) + ' u';
} else if (element) {
  totalMassDisplay = element.atomicMass.toFixed(5) + ' u';
}

  if (!element) {
    resultDiv.innerHTML = `
      <div class="atom-result" style="display:flex;flex-direction:column;gap:6px;">
        <div><strong>Element not found for atomic number:</strong> ${Number.isNaN(atomicNumber) ? '—' : atomicNumber}</div>
        <div><strong>Composition</strong></div>
        <ul style="margin:4px 0 0 18px;">
          <li>Protons: ${Number.isNaN(protons) ? '—' : protons}</li>
          <li>Neutrons: ${Number.isNaN(neutrons) ? '—' : neutrons}</li>
          <li>Electrons: ${Number.isNaN(electrons) ? '—' : electrons}</li>
          <li>Charge: ${Number.isNaN(chargeNumber) ? '—' : (chargeNumber >= 0 ? `+${chargeNumber}` : chargeNumber)}</li>
        </ul>
        <div>The total mass of your atom is <strong>${totalMassDisplay}</strong></div>
      </div>
    `;
    return;
  }

  const azeHtml = `
    <div style="font-family:monospace;line-height:1.05;">
      <div style="font-size:1.05rem;">${massNumber || ''} ${element.symbol}</div>
      <div style="font-size:0.95rem;">${protons || ''}</div>
    </div>
  `;

  resultDiv.innerHTML = `
    <div class="atom-result" style="display:flex;flex-direction:column;gap:8px;">
      <h3 style="margin:0;">Your element is <strong>${element.name}</strong></h3>
      <div><strong>AZE notation</strong></div>
      <div>${azeHtml}</div>
      <div>The standard atomic mass (relative atomic mass) is <strong>${element.atomicMass} u</strong>.</div>
      <div><strong>Composition:</strong>
        <ul style="margin:6px 0 0 18px;">
          <li>Protons: ${Number.isNaN(protons) ? '—' : protons}</li>
          <li>Neutrons: ${Number.isNaN(neutrons) ? '—' : neutrons}</li>
          <li>Electrons: ${Number.isNaN(electrons) ? '—' : electrons}</li>
          <li>Charge: ${Number.isNaN(chargeNumber) ? '—' : (chargeNumber >= 0 ? `+${chargeNumber}` : chargeNumber)}</li>
        </ul>
      </div>
      <div>The total mass of your atom is <strong>${totalMassDisplay}</strong></div>
    </div>
  `;
}

// -----------------------------
// Core update logic
// -----------------------------
let isUpdating = false;

function updateAll(sourceId) {
  if (isUpdating) return;
  isUpdating = true;

  // Read raw input strings (so we don't lose what user is typing)
  const rawStr = {
    AtomicNumber: $id('AtomicNumber') ? $id('AtomicNumber').value : '',
    MassNumber: $id('MassNumber') ? $id('MassNumber').value : '',
    ChargeNumber: $id('ChargeNumber') ? $id('ChargeNumber').value : '',
    NumberOfProtons: $id('NumberOfProtons') ? $id('NumberOfProtons').value : '',
    NumberOfNeutrons: $id('NumberOfNeutrons') ? $id('NumberOfNeutrons').value : '',
    NumberOfElectrons: $id('NumberOfElectrons') ? $id('NumberOfElectrons').value : ''
  };

  // Parse into numbers (NaN if empty/invalid)
  const raw = {
    AtomicNumber: parseNumberInput(rawStr.AtomicNumber),
    MassNumber: parseNumberInput(rawStr.MassNumber),
    ChargeNumber: parseNumberInput(rawStr.ChargeNumber),
    NumberOfProtons: parseNumberInput(rawStr.NumberOfProtons),
    NumberOfNeutrons: parseNumberInput(rawStr.NumberOfNeutrons),
    NumberOfElectrons: parseNumberInput(rawStr.NumberOfElectrons)
  };

  const has = key => !Number.isNaN(raw[key]);

  // Initialize main variables; prefer AtomicNumber or NumberOfProtons where appropriate
  let atomicNumber = has('AtomicNumber') ? Math.trunc(raw.AtomicNumber) : (has('NumberOfProtons') ? Math.trunc(raw.NumberOfProtons) : NaN);
  let protons = has('NumberOfProtons') ? Math.trunc(raw.NumberOfProtons) : (has('AtomicNumber') ? Math.trunc(raw.AtomicNumber) : NaN);
  if (!Number.isNaN(atomicNumber) && Number.isNaN(protons)) protons = atomicNumber;
  if (!Number.isNaN(protons) && Number.isNaN(atomicNumber)) atomicNumber = protons;

  let massNumber = has('MassNumber') ? Math.trunc(raw.MassNumber) : NaN;
  let neutrons = has('NumberOfNeutrons') ? Math.trunc(raw.NumberOfNeutrons) : NaN;
  let chargeNumber = has('ChargeNumber') ? Math.trunc(raw.ChargeNumber) : NaN;
  let electrons = has('NumberOfElectrons') ? Math.trunc(raw.NumberOfElectrons) : NaN;

  // Decide which relationships to apply based on source
  switch (sourceId) {
    case 'AtomicNumber':
      if (Number.isNaN(raw.AtomicNumber)) { showMessage('Enter valid Atomic Number', 'error'); break; }
      atomicNumber = Math.trunc(raw.AtomicNumber);
      protons = atomicNumber;
      if (!Number.isNaN(massNumber)) neutrons = massNumber - protons;
      if (!Number.isNaN(chargeNumber)) electrons = protons - chargeNumber;
      else if (!Number.isNaN(electrons)) chargeNumber = protons - electrons;
      break;

    case 'NumberOfProtons':
      if (Number.isNaN(raw.NumberOfProtons)) { showMessage('Enter valid Number of Protons', 'error'); break; }
      protons = Math.trunc(raw.NumberOfProtons);
      atomicNumber = protons;
      if (!Number.isNaN(massNumber)) neutrons = massNumber - protons;
      if (!Number.isNaN(chargeNumber)) electrons = protons - chargeNumber;
      else if (!Number.isNaN(electrons)) chargeNumber = protons - electrons;
      break;

    case 'MassNumber':
      if (Number.isNaN(raw.MassNumber)) { showMessage('Enter valid Mass Number', 'error'); break; }
      massNumber = Math.trunc(raw.MassNumber);
      if (!Number.isNaN(protons)) neutrons = massNumber - protons;
      else if (!Number.isNaN(neutrons)) protons = massNumber - neutrons, atomicNumber = protons;
      break;

    case 'NumberOfNeutrons':
      if (Number.isNaN(raw.NumberOfNeutrons)) { showMessage('Enter valid Number of Neutrons', 'error'); break; }
      neutrons = Math.trunc(raw.NumberOfNeutrons);
      if (!Number.isNaN(protons)) massNumber = protons + neutrons;
      else if (!Number.isNaN(atomicNumber)) massNumber = atomicNumber + neutrons, protons = atomicNumber;
      break;

    case 'ChargeNumber':
      if (Number.isNaN(raw.ChargeNumber)) { showMessage('Enter valid Charge Number', 'error'); break; }
      chargeNumber = Math.trunc(raw.ChargeNumber);
      if (!Number.isNaN(protons)) electrons = protons - chargeNumber;
      else if (!Number.isNaN(electrons)) protons = electrons + chargeNumber, atomicNumber = protons;
      break;

    case 'NumberOfElectrons':
      if (Number.isNaN(raw.NumberOfElectrons)) { showMessage('Enter valid Number of Electrons', 'error'); break; }
      electrons = Math.trunc(raw.NumberOfElectrons);
      if (!Number.isNaN(protons)) chargeNumber = protons - electrons;
      else if (!Number.isNaN(atomicNumber)) protons = atomicNumber, chargeNumber = protons - electrons;
      break;

    default:
      // try to derive remaining values
      if (!Number.isNaN(protons) && Number.isNaN(atomicNumber)) atomicNumber = protons;
      if (!Number.isNaN(atomicNumber) && Number.isNaN(protons)) protons = atomicNumber;
      if (!Number.isNaN(massNumber) && !Number.isNaN(protons) && Number.isNaN(neutrons)) neutrons = massNumber - protons;
      if (!Number.isNaN(neutrons) && !Number.isNaN(protons) && Number.isNaN(massNumber)) massNumber = protons + neutrons;
      if (!Number.isNaN(protons) && !Number.isNaN(chargeNumber) && Number.isNaN(electrons)) electrons = protons - chargeNumber;
      if (!Number.isNaN(protons) && !Number.isNaN(electrons) && Number.isNaN(chargeNumber)) chargeNumber = protons - electrons;
  }

  // Consistency checks
  if (!Number.isNaN(massNumber) && !Number.isNaN(protons)) {
    const maybeNeutrons = massNumber - protons;
    if (maybeNeutrons < 0) {
      showMessage('Mass number cannot be less than number of protons', 'error');
      neutrons = NaN;
    } else if (Number.isNaN(neutrons)) {
      neutrons = maybeNeutrons;
    }
  }

  if (!Number.isNaN(protons) && !Number.isNaN(neutrons) && Number.isNaN(massNumber)) {
    massNumber = protons + neutrons;
  }

  // electrons negative is possible if input inconsistent; warn
  if (!Number.isNaN(electrons) && electrons < 0) {
    showMessage('Computed electrons is negative — check inputs', 'error');
  }

  // Write back formatted values to inputs, BUT:
  // - Do NOT overwrite any input that is currently focused (so user's typing isn't interrupted).
  // - AtomicNumber is never formatted with commas (to preserve easy editing).
  const focusedId = (document.activeElement && document.activeElement.id) ? document.activeElement.id : null;

  // Helper to safely set input value only when not focused and only when different
  function safeSet(id, valueStr) {
    const el = $id(id);
    if (!el) return;
    if (el.id === focusedId) return; // don't overwrite focused field
    if (el.value !== valueStr) el.value = valueStr;
  }

  safeSet('AtomicNumber', Number.isNaN(atomicNumber) ? '' : formatNumberForInput(atomicNumber, { noCommas: true }));
  safeSet('MassNumber', Number.isNaN(massNumber) ? '' : formatNumberForInput(massNumber));
  safeSet('ChargeNumber', Number.isNaN(chargeNumber) ? '' : formatNumberForInput(chargeNumber, { noCommas: true })); // charge may be +/- integer
  safeSet('NumberOfProtons', Number.isNaN(protons) ? '' : formatNumberForInput(protons));
  safeSet('NumberOfNeutrons', Number.isNaN(neutrons) ? '' : formatNumberForInput(neutrons));
  safeSet('NumberOfElectrons', Number.isNaN(electrons) ? '' : formatNumberForInput(electrons));

  // Render result if we have an atomic number or protons and element exists; otherwise show helpful message or clear
  if (!Number.isNaN(atomicNumber) && elementData[atomicNumber]) {
    renderResult(atomicNumber, massNumber, chargeNumber, protons, neutrons, electrons);
  } else if (!Number.isNaN(atomicNumber) && !elementData[atomicNumber]) {
    // show not found but still render composition
    renderResult(atomicNumber, massNumber, chargeNumber, protons, neutrons, electrons);
  } else {
    // no atomic number; clear result if all fields empty
    if (Number.isNaN(atomicNumber) && Number.isNaN(protons) && Number.isNaN(neutrons) && Number.isNaN(electrons) && Number.isNaN(massNumber)) {
      if (resultDiv) resultDiv.innerHTML = '';
    } else {
      // still render partial info (without element)
      renderResult(atomicNumber, massNumber, chargeNumber, protons, neutrons, electrons);
    }
  }

  isUpdating = false;
}

// -----------------------------
// Attach event listeners
// -----------------------------
const ids = ['AtomicNumber','MassNumber','ChargeNumber','NumberOfProtons','NumberOfNeutrons','NumberOfElectrons'];
ids.forEach(id => {
  const el = $id(id);
  if (!el) return;
  // Input handler: update relationships live
  el.addEventListener('input', () => updateAll(id));
  // On change/blur, ensure formatting is applied (unless user re-focused)
  el.addEventListener('blur', () => updateAll(id));
  // Allow Enter to also trigger final update
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      el.blur(); // triggers blur -> updateAll
    }
  });
});

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // small initial call to populate if inputs already have values
  updateAll();
});
