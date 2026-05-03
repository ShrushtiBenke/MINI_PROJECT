const savedData = JSON.parse(
  localStorage.getItem("waterData")
);

if (!savedData) {

  alert(
    "No calculator data found."
  );

  window.location.href =
    "calculation.html";
}

// =========================
// DISPLAY SUMMARY
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

const feasibilityText =
  document.getElementById(
    "feasibilityValue"
  );

if (totalPercent === 100) {

  feasibilityText.textContent =
    "✅ Feasible";

  feasibilityText.style.color =
    "#2e8b57";

}

else {

  feasibilityText.textContent =
    "❌ Not Feasible";

  feasibilityText.style.color =
    "#d9534f";

}

// =========================
// RECOMMENDATION LOGIC
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
    Your current mix relies heavily on desalination.
    While desalination provides large water output,
    it significantly increases energy consumption,
    financial cost, and carbon emissions.

    Consider increasing water recycling or demand reduction
    for a more sustainable solution.
    `;
}

// HIGH CARBON

if (
  savedData.totalCarbon > 5000
) {

  recommendation +=

    `
    
    The current carbon footprint is very high.
    Reducing desalination and increasing lower-carbon
    solutions may improve environmental sustainability.
    `;
}

// HIGH COST

if (
  savedData.totalCost > 100000
) {

  recommendation +=

    `
    
    The selected mix has a high financial cost.
    Demand reduction strategies are usually cheaper
    and can reduce overall expenses.
    `;
}

// LOW DEMAND REDUCTION

if (
  savedData.demandPercent < 20
) {

  recommendation +=

    `
    
    Demand reduction is currently underutilized.
    Increasing conservation measures may lower
    both cost and environmental impact.
    `;
}

// DEFAULT

if (
  recommendation === ""
) {

  recommendation =

    `
    This is a balanced and sustainable mix.

    The selected combination maintains a good balance
    between cost, carbon emissions, and energy usage.

    Continue optimizing based on regional priorities
    and infrastructure limitations.
    `;
}

// DISPLAY

recommendationBox.textContent =
  recommendation;

let recommendedDesal = 20;
let recommendedDemand = 50;
let recommendedRecycle = 30;

if (savedData.target >= 5000) {
  recommendedDesal = 30;
  recommendedDemand = 40;
  recommendedRecycle = 30;
}

if (savedData.totalCarbon > 5000) {
  recommendedDesal = 15;
  recommendedDemand = 55;
  recommendedRecycle = 30;
}

if (savedData.totalCost > 100000) {
  recommendedDesal = 10;
  recommendedDemand = 60;
  recommendedRecycle = 30;
}

document.getElementById("recommendedDesal").textContent =
  `${recommendedDesal}%`;

document.getElementById("recommendedDemand").textContent =
  `${recommendedDemand}%`;

document.getElementById("recommendedRecycle").textContent =
  `${recommendedRecycle}%`;