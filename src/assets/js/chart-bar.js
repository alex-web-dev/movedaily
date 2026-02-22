import Chart from "chart.js/auto";

const $charts = document.querySelectorAll(".chart-bar");

$charts.forEach(($chart) => {
  const $canvas = $chart.querySelector(".chart-bar__canvas");
  const ctx = $canvas.getContext("2d");

  let chartInstance = null;

  function renderChart(rawData) {
    let parsedData = [];

    if (rawData) {
      try {
        parsedData = JSON.parse(rawData);
      } catch (e) {
        console.error("Ошибка парсинга данных графика", e);
        parsedData = [];
      }
    }

    const labels = parsedData.map((item) => item.day);
    const values = parsedData.map((item) => item.value);

    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, "#EBD4FF");
    gradient.addColorStop(1, "#EBD4FF");

    const barThickness = $chart.dataset.chartThickness ?? 31;

    const maxValue = Math.max(...values);
    const yMax = maxValue > 0 ? undefined : 40;

    if (!chartInstance) {
      chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: gradient,
              borderColor: "#ffffff",
              borderWidth: 0.5,
              borderRadius: 10,
              borderSkipped: false,
              barThickness,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: { top: 16 },
          },
          plugins: {
            legend: { display: false },
          },
          animation: false,
          scales: {
            x: {
              grid: { display: false, drawBorder: false },
              border: { display: false },
              ticks: {
                font: (context) => {
                  const width = context.chart.width;
                  const labelsCount = context.chart.data.labels.length;

                  const isMobileChart = width < 420;
                  const isShortPeriod = labelsCount <= 7;

                  return {
                    size: isMobileChart && !isShortPeriod ? 8 : 12,
                    lineHeight: 1.8,
                  };
                },
                color: "#737373",
              },
            },
            y: {
              beginAtZero: true,
              min: 0,
              max: yMax,
              border: {
                display: false,
                dash: [5, 5],
                dashOffset: 5,
              },
              grid: {
                color: "#E1E4ED",
                lineWidth: (context) => (context.index === 0 ? 0 : 1),
              },
              ticks: {
                stepSize: 5,
                font: { size: 14 },
                color: "#19213D",
                padding: 16,
              },
            },
          },
        },
      });
    } else {
      chartInstance.data.labels = labels;
      chartInstance.data.datasets[0].data = values;
      chartInstance.options.scales.y.max = yMax;
      chartInstance.update();
    }

    const valuesTotal = values.reduce((acc, current) => acc + current, 0);
    const $totalValueNum = $chart.querySelector(".stats-total__value-num");

    if ($totalValueNum) {
      $totalValueNum.innerText = valuesTotal;
    }
  }

  renderChart($chart.dataset.chart);

  const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      if (mutation.type === "attributes" && mutation.attributeName === "data-chart") {
        const newValue = $chart.dataset.chart;
        renderChart(newValue);
      }
    });
  });

  observer.observe($chart, {
    attributes: true,
    attributeFilter: ["data-chart"],
  });
});
