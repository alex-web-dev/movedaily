import Chart from "chart.js/auto";
import { pluralize } from "./utils";

const $donuts = document.querySelectorAll(".chart-donut");

$donuts.forEach(($donut) => {
  const $canvas = $donut.querySelector(".chart-donut__canvas");
  const ctx = $canvas.getContext("2d");

  let chartInstance = null;

  const donutLabelsPlugin = {
    id: "donutLabelsPlugin",
    afterDatasetsDraw(chart) {
      const { ctx } = chart;
      const dataset = chart.data.datasets[0];
      const meta = chart.getDatasetMeta(0);

      if (!dataset || !dataset.data.length) return;
      if ($donut.hasAttribute("data-hide-percent")) return;

      ctx.save();

      meta.data.forEach((arc, index) => {
        const value = dataset.data[index];
        const color = dataset.backgroundColor[index];

        const { x, y, startAngle, endAngle, outerRadius } = arc;
        const angle = (startAngle + endAngle) / 2;

        const offset = 12;
        const labelX = x + Math.cos(angle) * (outerRadius + offset);
        const labelY = y + Math.sin(angle) * (outerRadius + offset);

        ctx.font = "600 16px 'RS', sans-serif";
        ctx.fillStyle = color;
        ctx.textAlign = labelX < x ? "right" : "left";
        ctx.textBaseline = "middle";

        ctx.fillText(value + "%", labelX, labelY);
      });

      ctx.restore();
    },
  };

  function updateInfo() {
    const value = $donut.getAttribute("data-word-value");
    const $infoTitle = $donut.querySelector(".chart-donut__info-title");
    const $infoText = $donut.querySelector(".chart-donut__info-text");

    if ($infoTitle && value !== null) {
      $infoTitle.textContent = value;
    }

    if ($infoText) {
      const w1 = $donut.getAttribute("data-word-1");
      const w2 = $donut.getAttribute("data-word-2");
      const w5 = $donut.getAttribute("data-word-5");

      if (w1 && w2 && w5) {
        $infoText.textContent = pluralize(Number(value), w1, w2, w5);
      }
    }
  }

  function renderDonut(rawData) {
    let data = [];

    if (rawData) {
      try {
        data = JSON.parse(rawData);
      } catch (e) {
        console.error("Ошибка парсинга donut-данных", e);
        data = [];
      }
    }

    const values = data.map((item) => item.value);
    const colors = data.map((item) => item.color);

    const $legendContainer = $donut.querySelector(".chart-donut__legend");

    if ($legendContainer) {
      $legendContainer.innerHTML = "";

      data.forEach((item) => {
        const $legendItem = document.createElement("div");
        $legendItem.className = "legend-item chart-donut__legend-item";

        $legendItem.innerHTML = `
            <span class="legend-item__dot" style="background:${item.color}"></span>
            <span class="text text--2xs text--gray legend-item__text">
              ${item.label}
            </span>
          `;

        $legendContainer.appendChild($legendItem);
      });
    }

    if (!chartInstance) {
      chartInstance = new Chart(ctx, {
        type: "doughnut",
        data: {
          datasets: [
            {
              data: values,
              backgroundColor: colors,
              borderWidth: 0,
              spacing: 2,
              borderRadius: 20,
            },
          ],
        },
        options: {
          responsive: false,
          cutout: "74%",
          radius: "100%",
          rotation: 180,
          layout: {
            padding: {
              left: 80,
              right: 80,
              top: 8,
              bottom: 4,
            },
          },
          plugins: {
            legend: { display: false },
          },
          animation: {
            duration: 800,
            easing: "easeOutQuart",
          },
        },
        plugins: [donutLabelsPlugin],
      });
    } else {
      chartInstance.data.datasets[0].data = values;
      chartInstance.data.datasets[0].backgroundColor = colors;
      chartInstance.update();
    }
  }

  renderDonut($donut.getAttribute("data-chart"));
  updateInfo();

  const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      if (mutation.type === "attributes") {
        if (mutation.attributeName === "data-chart") {
          renderDonut($donut.getAttribute("data-chart"));
        }
        if (mutation.attributeName === "data-word-value") {
          updateInfo();
        }
      }
    });
  });

  observer.observe($donut, {
    attributes: true,
    attributeFilter: ["data-chart", "data-word-value"],
  });
});
