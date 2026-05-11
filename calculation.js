let dataset = [];
let waterChart;

fetch("water_options.json")
  .then(response => response.json())
  .then(data => {
    dataset = data;
    loadSavedCalculatorValues();
    createChart();
    updateCalculations();
  })
  .catch(error => {
    console.error("Error loading JSON:", error);
  });

const targetInput = document.getElementById("targetInput");

const desalSlider = document.getElementById("desalSlider");
const demandSlider = document.getElementById("demandSlider");
const recycleSlider = document.getElementById("recycleSlider");

const desalPercent = document.getElementById("desalPercent");
const demandPercent = document.getElementById("demandPercent");
const recyclePercent = document.getElementById("recyclePercent");

const desalValue = document.getElementById("desalValue");
const demandValue = document.getElementById("demandValue");
const recycleValue = document.getElementById("recycleValue");

const energyResult = document.getElementById("energyResult");
const carbonResult = document.getElementById("carbonResult");
const costResult = document.getElementById("costResult");
const feasibilityResult = document.getElementById("feasibilityResult");

function createChart() {
  const ctx = document.getElementById("waterChart");

  waterChart = new Chart(ctx, {
    type: "bar",

    data: {
      labels: ["Water Deficit Mix"],

      datasets: [
        {
          label: "Desalination",
          data: [0],
          backgroundColor: "#7ed8c8"
        },
        {
          label: "Demand Reduction",
          data: [0],
          backgroundColor: "#8db6ff"
        },
        {
          label: "Water Recycling",
          data: [0],
          backgroundColor: "#c9b8ff"
        }
      ]
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: {
          position: "bottom"
        },

        title: {
          display: true,
          text: "Contribution of Each Option to Water Deficit Target"
        }
      },

      scales: {
        x: {
          stacked: true
        },

        y: {
          stacked: true,
          beginAtZero: true,
          title: {
            display: true,
            text: "Water Contribution (m³/day)"
          }
        }
      }
    }
  });
}

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

function updateCalculations() {
  if (dataset.length === 0) return;

  const target = Number(targetInput.value);

  const selectedData = getClosestDataset(target);

  const desalPercentValue = Number(desalSlider.value);
  const demandPercentValue = Number(demandSlider.value);
  const recyclePercentValue = Number(recycleSlider.value);

  const totalPercent =
    desalPercentValue +
    demandPercentValue +
    recyclePercentValue;

  desalPercent.textContent = `${desalPercentValue}%`;
  demandPercent.textContent = `${demandPercentValue}%`;
  recyclePercent.textContent = `${recyclePercentValue}%`;

  const desalWater = (desalPercentValue / 100) * target;
  const demandWater = (demandPercentValue / 100) * target;
  const recycleWater = (recyclePercentValue / 100) * target;

  desalValue.textContent = desalWater.toFixed(0);
  demandValue.textContent = demandWater.toFixed(0);
  recycleValue.textContent = recycleWater.toFixed(0);

  const totalEnergy =
    (desalWater * selectedData.desalination.energy_kwh_m3) +
    (demandWater * selectedData.demand_reduction.energy_kwh_m3) +
    (recycleWater * selectedData.water_recycling.energy_kwh_m3);

  const totalCarbon =
    (desalWater * selectedData.desalination.carbon_kg_m3) +
    (demandWater * selectedData.demand_reduction.carbon_kg_m3) +
    (recycleWater * selectedData.water_recycling.carbon_kg_m3);

  const totalCost =
    (desalWater * selectedData.desalination.cost_inr_m3) +
    (demandWater * selectedData.demand_reduction.cost_inr_m3) +
    (recycleWater * selectedData.water_recycling.cost_inr_m3);

  energyResult.textContent = `${totalEnergy.toFixed(2)} kWh/day`;
  carbonResult.textContent = `${totalCarbon.toFixed(2)} kgCO₂/day`;
  costResult.textContent = `₹${totalCost.toFixed(2)}/day`;

  if (totalPercent === 100) {
    feasibilityResult.textContent = "✅ Feasible Mix";
    feasibilityResult.style.color = "#2e8b57";
  }

  else if (totalPercent < 100) {
    feasibilityResult.textContent = `❌ ${100 - totalPercent}% Short`;
    feasibilityResult.style.color = "#d9534f";
  }

  else {
    feasibilityResult.textContent = `⚠ ${totalPercent - 100}% Excess`;
    feasibilityResult.style.color = "#ff9800";
  }

  waterChart.data.datasets[0].data = [desalWater];
  waterChart.data.datasets[1].data = [demandWater];
  waterChart.data.datasets[2].data = [recycleWater];

  waterChart.update();

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

targetInput.addEventListener("input", updateCalculations);
desalSlider.addEventListener("input", updateCalculations);
demandSlider.addEventListener("input", updateCalculations);
recycleSlider.addEventListener("input", updateCalculations);

function loadSavedCalculatorValues() {
  const savedData = JSON.parse(localStorage.getItem("waterData"));

  if (!savedData) return;

  targetInput.value = savedData.target;

  desalSlider.value = savedData.desalPercent;
  demandSlider.value = savedData.demandPercent;
  recycleSlider.value = savedData.recyclePercent;
}