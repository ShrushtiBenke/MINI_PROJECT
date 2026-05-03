const savedData = JSON.parse(
  localStorage.getItem("waterData")
);

// =========================
// CHECK DATA
// =========================

if (!savedData) {

  alert("No calculator data found.");

  window.location.href =
    "calculation.html";

}

// =========================
// DISPLAY CURRENT VALUES
// =========================

document.getElementById(
  "energyValue"
).textContent =

  `${savedData.totalEnergy.toFixed(2)} kWh/day`;

document.getElementById(
  "carbonValue"
).textContent =

  `${savedData.totalCarbon.toFixed(2)} kgCO₂/day`;

document.getElementById(
  "costValue"
).textContent =

  `₹${savedData.totalCost.toFixed(2)}/day`;

// =========================
// FEASIBILITY
// =========================

const totalPercent =

  savedData.desalPercent +

  savedData.demandPercent +

  savedData.recyclePercent;

const feasibilityValue =
  document.getElementById(
    "feasibilityValue"
  );

if (totalPercent === 100) {

  feasibilityValue.textContent =
    "✅ Feasible";

  feasibilityValue.style.color =
    "#2e8b57";

}

else {

  feasibilityValue.textContent =
    "❌ Not Feasible";

  feasibilityValue.style.color =
    "#d9534f";

}

// =========================
// BEST MIX ALGORITHM
// =========================

// Lower desalination
// Higher demand reduction
// Balanced recycling

let bestDesal = 15;
let bestDemand = 55;
let bestRecycle = 30;

// Large target needs more desalination

if (savedData.target > 5000) {

  bestDesal = 25;
  bestDemand = 45;
  bestRecycle = 30;

}

// Extremely high carbon

if (savedData.totalCarbon > 10000) {

  bestDesal = 10;
  bestDemand = 60;
  bestRecycle = 30;

}

// Extremely high cost

if (savedData.totalCost > 300000) {

  bestDesal = 5;
  bestDemand = 65;
  bestRecycle = 30;

}

// =========================
// DISPLAY BEST MIX
// =========================

document.getElementById(
  "bestDesal"
).textContent =

  `${bestDesal}%`;

document.getElementById(
  "bestDemand"
).textContent =

  `${bestDemand}%`;

document.getElementById(
  "bestRecycle"
).textContent =

  `${bestRecycle}%`;

// =========================
// SUSTAINABILITY SCORE
// =========================

let score = 100;

// Carbon penalty

if (savedData.totalCarbon > 10000) {

  score -= 30;

}

else if (
  savedData.totalCarbon > 5000
) {

  score -= 15;

}

// Cost penalty

if (savedData.totalCost > 300000) {

  score -= 30;

}

else if (
  savedData.totalCost > 150000
) {

  score -= 15;

}

// Desalination penalty

if (
  savedData.desalPercent > 50
) {

  score -= 20;

}

// Feasibility penalty

if (totalPercent !== 100) {

  score -= 25;

}

// Minimum limit

if (score < 0) {

  score = 0;

}

// =========================
// DISPLAY SCORE
// =========================

document.getElementById(
  "sustainabilityScore"
).textContent =

  `${score}/100`;

// =========================
// RECOMMENDATION MESSAGE
// =========================

const recommendationBox =
  document.getElementById(
    "recommendationBox"
  );

let recommendation = "";

// HIGH DESALINATION

if (
  savedData.desalPercent > 50
) {

  recommendation +=

  `
  Your current solution depends heavily on desalination.

  Desalination increases energy usage, financial cost,
  and carbon emissions significantly.

  Consider shifting more percentage toward
  demand reduction and recycling.
  
  `;

}

// HIGH CARBON

if (
  savedData.totalCarbon > 5000
) {

  recommendation +=

  `
  The carbon footprint is currently high.

  Lower-carbon solutions such as demand reduction
  should be prioritized for sustainability.
  
  `;

}

// HIGH COST

if (
  savedData.totalCost > 150000
) {

  recommendation +=

  `
  The current financial cost is high.

  Increasing conservation strategies can help
  reduce operational expenses.
  
  `;

}

// LOW DEMAND REDUCTION

if (
  savedData.demandPercent < 20
) {

  recommendation +=

  `
  Demand reduction is underutilized.

  Increasing water-saving measures may significantly
  improve sustainability performance.
  
  `;

}

// GOOD MIX

if (recommendation === "") {

  recommendation =

  `
  Excellent balance.

  Your current mix maintains a strong balance
  between sustainability, affordability,
  and operational feasibility.

  Continue optimizing based on regional
  infrastructure and environmental priorities.
  `;

}

// =========================
// FINAL OUTPUT
// =========================

recommendationBox.textContent =
  recommendation;