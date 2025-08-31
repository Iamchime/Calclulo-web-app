const caffeineContent = {
  "7-Eleven Brewed Coffee": 134,
  "Alpine Start Instant Coffee": 120,
  "Americano": 77,
  "Arby's Jamocha Shake": 86,
  "Barista Bros Iced Coffee": 147,
  "Baskin Robbins Cappuccino Blast": 90,
  "Biggby Brewed Coffee": 150,
  "Biggby Creamy Lattes": 100,
  "Biggby Espresso": 100,
  "Biggby Iced Coffee": 130,
  "Biohazard Coffee": 928,
  "Bizzy Cold Brew": 170,
  "Black Ink Coffee": 120,
  "Black Insomnia Coffee": 702,
  "Black Label Brewed Coffee": 1292,
  "Bottled Iced Coffee (Dunkin')": 153,
  "Bulletproof Coffee": 125,
  "Café Bustelo": 113,
  "Café Con Leche": 75,
  "Caffè Mocha": 152,
  "Caffè Nero Coffee": 160,
  "Califia Farms Cold Brew": 90,
  "Cannonball Coffee Maximum Charge": 1101,
  "Cappuccino": 75,
  "Caribou Brewed Coffee": 230,
  "Caribou Canned Cold Brew": 190,
  "CBD Coffee": 30,
  "Chameleon Cold Brew (Concentrate)": 270,
  "Chameleon Cold Brew RTD": 200,
  "Chameleon Cold Brew with Milk": 140,
  "Chick-fil-A Brewed Coffee": 140,
  "Chick-fil-A Frosted Coffee": 90,
  "Chick-fil-A Iced Coffee": 95,
  "Choffy (Roasted Cacao)": 25,
  "Black Coffee": 95,
  "Decaf Instant Coffee": 5,
  "Instant Coffee": 60,
  "The Coffee Bean & Tea Leaf": 140,
  "Coffee Leaf Tea": 35,
  "COGO Caffeinated Hot Chocolate": 80,
  "CoolBrew Coffee": 100,
  "Costa Coffee": 185,
  "Crio Bru Brewed Cacao": 15,
  "Dare Iced Coffee": 160,
  "Death Wish Canned Cold Brew": 300,
  "Death Wish Coffee": 728,
  "Death Wish Latte": 285,
  "Driftaway Coffee": 120,
  "Dripdash Kyoto Style Coffee": 250,
  "Dunkin' Shot in the Dark": 80,
  "Dunkin' Cold Brew": 260,
  "Dunkin' Brewed Coffee": 210,
  "Dunkin' Dunkaccino": 100,
  "Dunkin' Extra Charged Coffee": 300,
  "Dunkin' Iced Coffee": 180,
  "Dunkin' Iced Latte": 120,
  "Dunkin' Latte": 130,
  "Dutch Bros Coffee (Classic)": 140,
  "Eight O'Clock Coffee": 90,
  "Einstein Bros Coffee": 185,
  "Espresso Monster": 150,
  "Espresso": 63,
  "Flat White": 130,
  "Folgers Coffee": 112,
  "Gloria Jean's Coffee": 140,
  "Gold Peak Coffee": 150,
  "GothRider Gasoline Coffee": 170,
  "Gourmesso Coffee Pods": 75,
  "Greek Coffee (Metrios)": 60,
  "Guayaki Canned Yerba Mate": 80,
  "GymBrew Coffee": 200,
  "Hell Energy Coffee": 150,
  "High Brew Coffee": 140,
  "High Voltage Coffee (Australia)": 1150,
};

const unitToKg = {
  "kilograms(kg)": 1,
  "grams(g)": 0.001,
  "pounds(lb)": 0.453592,
  "stones(st)": 6.35029,
};

const sensitivityFactor = {
  "verytolerant": 7,
  "tolerant": 6,
  "average": 5,
  "sensitive": 4,
  "verysensitive": 3,
};

function getSelectedSensitivity() {
  const radios = document.getElementsByName("sensitivity");
  for (let r of radios) if (r.checked) return r.value;
  return "average";
}

function calculateCaffeine() {
  let weight = parseFloat(document.getElementById("bodyWeight").value.replace(/,/g, '')) || 0;
  const unit = document.getElementById("bodyWeightUnits").value;
  const drink = document.getElementById("coffeeSelect").value;
  const caffeinePerPortion = caffeineContent[drink] || 0;
  const sensitivity = getSelectedSensitivity();

  // Convert weight to kg
  let weightKg = weight * (unitToKg[unit] || 1);

  const personalLimit = weightKg * sensitivityFactor[sensitivity];
  const maxAllowed = 400; // daily limit
  const maxPortions = caffeinePerPortion > 0 ? personalLimit / caffeinePerPortion : 0;
  const totalCaffeine = Math.min(maxPortions * caffeinePerPortion, maxAllowed);

  const safePortions = totalCaffeine / caffeinePerPortion;

  document.getElementById("NumberOfPortions").value = safePortions.toFixed(1);
  document.getElementById("totalCaffeine").value = totalCaffeine.toFixed(1);
  document.querySelector("#caffeineInfoSec input").value = caffeinePerPortion;

  let feedback = [];
  feedback.push(
    `You can safely consume up to <strong>${safePortions.toFixed(1)}</strong> portion(s) of <strong>${drink}</strong> based on your sensitivity and body weight.`
  );
  feedback.push(
    `That equals approximately <strong>${totalCaffeine.toFixed(1)} mg</strong> of caffeine.`
  );
  if (totalCaffeine >= maxAllowed) {
    feedback.push(
      `<p class="coffee-recommendation"><strong>Warning:</strong> Your daily dose exceeds the recommended 400 mg per day.</p>`
    );
  }
  document.querySelector(".coffeeFeedback").innerHTML = `<p>${feedback.join("<br>")}</p>`;
}

// Auto-calculate on input change
document.querySelectorAll("#bodyWeight, #bodyWeightUnits, #coffeeSelect, input[name='sensitivity']")
  .forEach(el => el.addEventListener("input", calculateCaffeine));