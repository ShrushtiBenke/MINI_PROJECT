const savedData = JSON.parse(localStorage.getItem("waterData"));

if (!savedData) {
  alert("No calculator data found. Please use the calculator first.");
  window.location.href = "calculation.html";
}

document.getElementById("targetValue").textContent =
  `${savedData.target.toFixed(0)} m³/day`;

document.getElementById("desalValue").textContent =
  `${savedData.desalWater.toFixed(0)} m³/day`;

document.getElementById("demandValue").textContent =
  `${savedData.demandWater.toFixed(0)} m³/day`;

document.getElementById("recycleValue").textContent =
  `${savedData.recycleWater.toFixed(0)} m³/day`;

const ctx = document.getElementById("waterChart");

new Chart(ctx, {
  type: "bar",

  data: {
    labels: ["Water Deficit Mix"],

    datasets: [
      {
        label: "Desalination",
        data: [savedData.desalWater],
        backgroundColor: "#7ed8c8"
      },
      {
        label: "Demand Reduction",
        data: [savedData.demandWater],
        backgroundColor: "#8db6ff"
      },
      {
        label: "Water Recycling",
        data: [savedData.recycleWater],
        backgroundColor: "#c9b8ff"
      }
    ]
  },

  options: {
    responsive: true,

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