let waterData = [];
let currentData = null;

const targetInput = document.getElementById("targetInput");
const capacitySelect = document.getElementById("capacitySelect");

const desalSlider = document.getElementById("desalSlider");
const demandSlider = document.getElementById("demandSlider");
const recycleSlider = document.getElementById("recycleSlider");

const desalValue = document.getElementById("desalValue");
const demandValue = document.getElementById("demandValue");
const recycleValue = document.getElementById("recycleValue");

const totalCost = document.getElementById("totalCost");
const totalEnergy = document.getElementById("totalEnergy");
const totalCarbon = document.getElementById("totalCarbon");

const sumMessage = document.getElementById("sumMessage");
const feasibility = document.getElementById("feasibility");

const barDesal = document.getElementById("barDesal");
const barDemand = document.getElementById("barDemand");
const barRecycle = document.getElementById("barRecycle");

const recommendBtn = document.getElementById("recommendBtn");

const desalData = document.getElementById("desalData");
const demandData = document.getElementById("demandData");
const recycleData = document.getElementById("recycleData");

async function loadData() {
  try {
    const response = await fetch("water_options.json");
    waterData = await response.json();
    updateCapacityData();
  } catch (error) {
    alert("Failed to load water_options.json. Make sure the file is in the same folder.");
    console.error(error);
  }
}

function updateCapacityData() {
  const selectedCapacity = Number(capacitySelect.value);
  currentData = waterData.find(item => item.capacity_m3_day === selectedCapacity);

  if (!currentData) return;

  let target = Number(targetInput.value);

  if (target < 100) {
    target = 100;
    targetInput.value = 100;
  }

  desalSlider.max = target;
  demandSlider.max = target;
  recycleSlider.max = target;

  desalSlider.step = 100;
  demandSlider.step = 100;
  recycleSlider.step = 100;

  const desalInitial = Math.round((target * 0.3) / 100) * 100;
  const demandInitial = Math.round((target * 0.4) / 100) * 100;
  let recycleInitial = target - desalInitial - demandInitial;

  if (recycleInitial < 0) recycleInitial = 0;

  desalSlider.value = desalInitial;
  demandSlider.value = demandInitial;
  recycleSlider.value = recycleInitial;

  balanceToTarget();
  updateUI();
  showCurrentData();
}

function balanceToTarget() {
  const target = Number(targetInput.value);

  let desal = Number(desalSlider.value);
  let demand = Number(demandSlider.value);
  let recycle = Number(recycleSlider.value);

  let sum = desal + demand + recycle;

  if (sum !== target) {
    recycle = target - desal - demand;

    if (recycle < 0) {
      recycle = 0;
      demand = target - desal;
      if (demand < 0) {
        demand = 0;
        desal = target;
      }
    }
  }

  desalSlider.value = Math.max(0, desal);
  demandSlider.value = Math.max(0, demand);
  recycleSlider.value = Math.max(0, recycle);
}

function handleSliderChange(changedSlider) {
  const target = Number(targetInput.value);

  let desal = Number(desalSlider.value);
  let demand = Number(demandSlider.value);
  let recycle = Number(recycleSlider.value);

  if (changedSlider === "desal") {
    recycle = target - desal - demand;

    if (recycle < 0) {
      recycle = 0;
      demand = target - desal;
      if (demand < 0) {
        demand = 0;
        desal = target;
      }
    }
  }

  if (changedSlider === "demand") {
    recycle = target - desal - demand;

    if (recycle < 0) {
      recycle = 0;
      desal = target - demand;
      if (desal < 0) {
        desal = 0;
        demand = target;
      }
    }
  }

  if (changedSlider === "recycle") {
    demand = target - desal - recycle;

    if (demand < 0) {
      demand = 0;
      desal = target - recycle;
      if (desal < 0) {
        desal = 0;
        recycle = target;
      }
    }
  }

  desalSlider.value = Math.max(0, desal);
  demandSlider.value = Math.max(0, demand);
  recycleSlider.value = Math.max(0, recycle);

  updateUI();
}

function calculateTotals(desal, demand, recycle) {
  const cost =
    desal * currentData.desalination.cost_inr_m3 +
    demand * currentData.demand_reduction.cost_inr_m3 +
    recycle * currentData.water_recycling.cost_inr_m3;

  const energy =
    desal * currentData.desalination.energy_kwh_m3 +
    demand * currentData.demand_reduction.energy_kwh_m3 +
    recycle * currentData.water_recycling.energy_kwh_m3;

  const carbon =
    desal * currentData.desalination.carbon_kg_m3 +
    demand * currentData.demand_reduction.carbon_kg_m3 +
    recycle * currentData.water_recycling.carbon_kg_m3;

  return { cost, energy, carbon };
}

function updateUI() {
  if (!currentData) return;

  const target = Number(targetInput.value);
  const desal = Number(desalSlider.value);
  const demand = Number(demandSlider.value);
  const recycle = Number(recycleSlider.value);

  desalValue.textContent = `${desal} m³/day`;
  demandValue.textContent = `${demand} m³/day`;
  recycleValue.textContent = `${recycle} m³/day`;

  const sum = desal + demand + recycle;
  sumMessage.textContent = `Total selected: ${sum} / ${target} m³/day`;

  const totals = calculateTotals(desal, demand, recycle);

  totalCost.textContent = `₹${totals.cost.toLocaleString("en-IN", {
    maximumFractionDigits: 2
  })}`;

  totalEnergy.textContent = `${totals.energy.toLocaleString("en-IN", {
    maximumFractionDigits: 2
  })} kWh/day`;

  totalCarbon.textContent = `${totals.carbon.toLocaleString("en-IN", {
    maximumFractionDigits: 2
  })} kgCO₂/day`;

  if (sum === target) {
    feasibility.textContent = "Feasible: Mix exactly meets the water deficit target.";
    feasibility.classList.remove("not-feasible");
    feasibility.classList.add("feasible");
  } else {
    feasibility.textContent = "Not feasible: Mix must exactly match the target.";
    feasibility.classList.remove("feasible");
    feasibility.classList.add("not-feasible");
  }

  barDesal.style.width = `${(desal / target) * 100}%`;
  barDemand.style.width = `${(demand / target) * 100}%`;
  barRecycle.style.width = `${(recycle / target) * 100}%`;

  showCurrentData();
}

function showCurrentData() {
  if (!currentData) return;

  desalData.innerHTML = `
    Energy: ${currentData.desalination.energy_kwh_m3} kWh/m³<br>
    Cost: ₹${currentData.desalination.cost_inr_m3}/m³<br>
    Carbon: ${currentData.desalination.carbon_kg_m3} kgCO₂/m³
  `;

  demandData.innerHTML = `
    Energy: ${currentData.demand_reduction.energy_kwh_m3} kWh/m³<br>
    Cost: ₹${currentData.demand_reduction.cost_inr_m3}/m³<br>
    Carbon: ${currentData.demand_reduction.carbon_kg_m3} kgCO₂/m³
  `;

  recycleData.innerHTML = `
    Energy: ${currentData.water_recycling.energy_kwh_m3} kWh/m³<br>
    Cost: ₹${currentData.water_recycling.cost_inr_m3}/m³<br>
    Carbon: ${currentData.water_recycling.carbon_kg_m3} kgCO₂/m³
  `;
}

function recommendOptimalMix() {
  if (!currentData) return;

  const target = Number(targetInput.value);
  const step = 100;

  let bestMix = null;
  let bestScore = Infinity;

  for (let desal = 0; desal <= target; desal += step) {
    for (let demand = 0; demand <= target - desal; demand += step) {
      const recycle = target - desal - demand;

      const totals = calculateTotals(desal, demand, recycle);

      const weightedScore = totals.cost + (totals.carbon * 100);

      if (weightedScore < bestScore) {
        bestScore = weightedScore;
        bestMix = { desal, demand, recycle };
      }
    }
  }

  if (bestMix) {
    desalSlider.value = bestMix.desal;
    demandSlider.value = bestMix.demand;
    recycleSlider.value = bestMix.recycle;
    updateUI();
  }
}

targetInput.addEventListener("change", () => {
  updateCapacityData();
});

capacitySelect.addEventListener("change", () => {
  updateCapacityData();
});

desalSlider.addEventListener("input", () => {
  handleSliderChange("desal");
});

demandSlider.addEventListener("input", () => {
  handleSliderChange("demand");
});

recycleSlider.addEventListener("input", () => {
  handleSliderChange("recycle");
});

recommendBtn.addEventListener("click", recommendOptimalMix);

loadData();