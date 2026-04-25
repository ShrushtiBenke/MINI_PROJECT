// =========================
// GLOBAL VARIABLES
// =========================

let dataset = [];

// =========================
// FETCH JSON DATA
// =========================

fetch("water_options.json")
  .then(response => response.json())
  .then(data => {

    dataset = data;

    loadSavedCalculatorValues();
    updateCalculations();

  })

  .catch(error => {
    console.error("Error loading JSON:", error);
  });

// =========================
// ELEMENTS
// =========================

const targetInput =
  document.getElementById("targetInput");

const desalSlider =
  document.getElementById("desalSlider");

const demandSlider =
  document.getElementById("demandSlider");

const recycleSlider =
  document.getElementById("recycleSlider");

const desalPercent =
  document.getElementById("desalPercent");

const demandPercent =
  document.getElementById("demandPercent");

const recyclePercent =
  document.getElementById("recyclePercent");

const desalValue =
  document.getElementById("desalValue");

const demandValue =
  document.getElementById("demandValue");

const recycleValue =
  document.getElementById("recycleValue");

const energyResult =
  document.getElementById("energyResult");

const carbonResult =
  document.getElementById("carbonResult");

const costResult =
  document.getElementById("costResult");

const feasibilityResult =
  document.getElementById("feasibilityResult");

// =========================
// FIND CLOSEST CAPACITY
// =========================

function getClosestDataset(target) {

  let closest = dataset[0];

  dataset.forEach(item => {

    if (

      Math.abs(item.capacity_m3_day - target)

      <

      Math.abs(closest.capacity_m3_day - target)

    ) {

      closest = item;

    }

  });

  return closest;

}

// =========================
// MAIN FUNCTION
// =========================

function updateCalculations() {

  if (dataset.length === 0) return;

  // =========================
  // TARGET VALUE
  // =========================

  const target =
    Number(targetInput.value);

  // =========================
  // GET DATASET
  // =========================

  const selectedData =
    getClosestDataset(target);

  // =========================
  // SLIDER VALUES
  // =========================

  const desalPercentValue =
    Number(desalSlider.value);

  const demandPercentValue =
    Number(demandSlider.value);

  const recyclePercentValue =
    Number(recycleSlider.value);

  // =========================
  // TOTAL %
  // =========================

  const totalPercent =

    desalPercentValue +

    demandPercentValue +

    recyclePercentValue;

  // =========================
  // UPDATE %
  // =========================

  desalPercent.textContent =
    `${desalPercentValue}%`;

  demandPercent.textContent =
    `${demandPercentValue}%`;

  recyclePercent.textContent =
    `${recyclePercentValue}%`;

  // =========================
  // WATER VALUES
  // =========================

  const desalWater =

    (desalPercentValue / 100)

    * target;

  const demandWater =

    (demandPercentValue / 100)

    * target;

  const recycleWater =

    (recyclePercentValue / 100)

    * target;

  // =========================
  // DISPLAY WATER
  // =========================

  desalValue.textContent =
    desalWater.toFixed(0);

  demandValue.textContent =
    demandWater.toFixed(0);

  recycleValue.textContent =
    recycleWater.toFixed(0);

  // =========================
  // ENERGY
  // =========================

  const totalEnergy =

    (desalWater *

      selectedData.desalination.energy_kwh_m3)

    +

    (demandWater *

      selectedData.demand_reduction.energy_kwh_m3)

    +

    (recycleWater *

      selectedData.water_recycling.energy_kwh_m3);

  // =========================
  // CARBON
  // =========================

  const totalCarbon =

    (desalWater *

      selectedData.desalination.carbon_kg_m3)

    +

    (demandWater *

      selectedData.demand_reduction.carbon_kg_m3)

    +

    (recycleWater *

      selectedData.water_recycling.carbon_kg_m3);

  // =========================
  // COST
  // =========================

  const totalCost =

    (desalWater *

      selectedData.desalination.cost_inr_m3)

    +

    (demandWater *

      selectedData.demand_reduction.cost_inr_m3)

    +

    (recycleWater *

      selectedData.water_recycling.cost_inr_m3);

  // =========================
  // DISPLAY RESULTS
  // =========================

  energyResult.textContent =

    `${totalEnergy.toFixed(2)} kWh/day`;

  carbonResult.textContent =

    `${totalCarbon.toFixed(2)} kgCO₂/day`;

  costResult.textContent =

    `₹${totalCost.toFixed(2)}/day`;

  // =========================
  // FEASIBILITY CHECK
  // =========================

  if (totalPercent === 100) {

    feasibilityResult.textContent =
      "✅ Feasible Mix";

    feasibilityResult.style.color =
      "#2e8b57";

  }

  else if (totalPercent < 100) {

    feasibilityResult.textContent =

      `❌ ${100 - totalPercent}% Short`;

    feasibilityResult.style.color =
      "#d9534f";

  }

  else {

    feasibilityResult.textContent =

      `⚠ ${totalPercent - 100}% Excess`;

    feasibilityResult.style.color =
      "#ff9800";

  }

// =========================
// SAVE DATA FOR CHART PAGE
// =========================

localStorage.setItem(
  "waterData",

  JSON.stringify({

    target: target,

    desalPercent: desalPercentValue,
    demandPercent: demandPercentValue,
    recyclePercent: recyclePercentValue,

    desalWater: desalWater,
    demandWater: demandWater,
    recycleWater: recycleWater,

    totalEnergy: totalEnergy,
    totalCarbon: totalCarbon,
    totalCost: totalCost

  })

);
}

// =========================
// EVENT LISTENERS
// =========================

targetInput.addEventListener(
  "input",
  updateCalculations
);

desalSlider.addEventListener(
  "input",
  updateCalculations
);

demandSlider.addEventListener(
  "input",
  updateCalculations
);

recycleSlider.addEventListener(
  "input",
  updateCalculations
);

function loadSavedCalculatorValues() {
  const savedData = JSON.parse(localStorage.getItem("waterData"));

  if (!savedData) return;

  targetInput.value = savedData.target;

  desalSlider.value = savedData.desalPercent;
  demandSlider.value = savedData.demandPercent;
  recycleSlider.value = savedData.recyclePercent;
}