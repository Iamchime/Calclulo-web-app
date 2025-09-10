
  document.addEventListener('DOMContentLoaded', () => {
    const massIn = document.getElementById('BulletMass');
    const massUnit = document.getElementById('BulletMassUnit');
    const velIn = document.getElementById('BulletVelocity');
    const velUnit = document.getElementById('BulletVelocityUnit');
    const energyOut = document.getElementById('bulletEnergy');
    const energyUnit = document.getElementById('bulletEnergyUnit');

    function parseNumber(str) {
      const num = parseFloat(str.replace(/,/g, ''));
      return isNaN(num) ? 0 : num;
    }

    function convertToSI(mass, mUnit, vel, vUnit) {
      let mSI = mass, vSI = vel;
      // Mass to kg
      switch (mUnit) {
        case 'micrograms': mSI = mass * 1e-9; break;
        case 'milligrams': mSI = mass * 1e-6; break;
        case 'grains': mSI = mass * 0.00006479891; break;
        case 'drachms': mSI = mass * 0.001771845; break;
        case 'ounces': mSI = mass * 0.0283495; break;
        case 'pounds': mSI = mass * 0.453592; break;
      }
      // Velocity to m/s
      switch (vUnit) {
        case 'metersPerSeconds': vSI = vel; break;
        case 'kilometersPerHour': vSI = vel / 3.6; break;
        case 'feetPerSecond': vSI = vel * 0.3048; break;
        case 'milesPerHour': vSI = vel * 0.44704; break;
        case 'feetPerMinute': vSI = vel * 0.00508; break;
      }
      return { mSI, vSI };
    }

    function convertEnergy(Ejoules, targetUnit) {
      if (targetUnit === 'joules') return Ejoules;
      if (targetUnit === 'foot-pounds') return Ejoules / 1.3558179483314004; // 1 ft-lb ≈ 1.35582 J
      return Ejoules;
    }

    function formatNumber(num) {
      return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
    }

    function calculateEnergy() {
      const mRaw = parseNumber(massIn.value);
      const vRaw = parseNumber(velIn.value);
      const mU = massUnit.value, vU = velUnit.value, eU = energyUnit.value;

      const { mSI, vSI } = convertToSI(mRaw, mU, vRaw, vU);
      const Ejoules = 0.5 * mSI * vSI * vSI;
      const Econverted = convertEnergy(Ejoules, eU);

      energyOut.value = formatNumber(Econverted);
    }

    [massIn, massUnit, velIn, velUnit, energyUnit].forEach(el =>
      el.addEventListener('input', calculateEnergy)
    );
  });