//Пример изменения конфигурации мышц при выборе другой даты
const defaultConfig = {
  front: {
    bicep_1_left: "attention",
    bicep_1_right: "attention",
    calf_1_left: "critical",
    calf_1_right: "critical",
  },
  back: {
    latissimus_dorsi_left: "attention",
    latissimus_dorsi_right: "attention",
    bicep_femoris_1_left: "critical",
    bicep_femoris_1_right: "critical",
    forearm_back_1_left: "attention",
    forearm_back_1_right: "attention",
    achilles_tendon_left: "attention",
    achilles_tendon_right: "attention",
  },
};

const exampleConfig = {
  front: {
    bicep_1_left: "attention",
    bicep_1_right: "attention",
  },
  back: {},
};

const $musclePanels = document.querySelectorAll(".muscle-panel");
$musclePanels.forEach(($musclePanel) => {
  const $selectItems = $musclePanel.querySelectorAll(".select__item");
  const $selectInput = $musclePanel.querySelector(".select-btn__text");

  $selectItems.forEach(($item) => {
    $item.addEventListener("click", () => {
      const date = $item.dataset.selectText;
      $selectInput.value = date;

      // Здесь можно заменить на запрос к серверу и передать полученный конфиг в applyMuscleConfig
      const config = date === "26.12.2025" ? defaultConfig : exampleConfig;
      applyMuscleConfig($musclePanel, config);
    });
  });
});

// Принимает конфиг и применяет его к панели
function applyMuscleConfig($musclePanel, config) {
  const $bodies = $musclePanel.querySelectorAll(".muscle-panel__body");
  $bodies.forEach(($body) => {
    const type = $body.dataset.configType || "front";
    const newConfig = config[type];
    if (newConfig) {
      $body.dataset.config = JSON.stringify(newConfig);
    }
  });
}
