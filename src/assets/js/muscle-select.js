import { generateTraining } from "./generate-training";

//Окно для выбора мышечных зон
const $muscleSelects = document.querySelectorAll(".muscle-select");
$muscleSelects.forEach(($muscleSelect) => {
  const $btnSkip = $muscleSelect.querySelector(".muscle-panel__btn-skip");
  const $btnGenerate = $muscleSelect.querySelector(".muscle-panel__btn-generate");
  const $thisPopup = $muscleSelect.closest(".popup");

  const $musclePanelFront = $muscleSelect.querySelectorAll(".muscle-panel__body")[0];
  const $musclePanelBack = $muscleSelect.querySelectorAll(".muscle-panel__body")[1];

  //Если хотя бы одна мышца выбрана, отображать кнопку генерации
  function updateGenerateBtn() {
    const frontConfig = JSON.parse($musclePanelFront.dataset.config || "{}");
    const backConfig = JSON.parse($musclePanelBack.dataset.config || "{}");

    const hasSelection = Object.keys(frontConfig).length > 0 || Object.keys(backConfig).length > 0;

    if (hasSelection) {
      $btnGenerate.classList.add("muscle-panel__btn-generate--active");
    } else {
      $btnGenerate.classList.remove("muscle-panel__btn-generate--active");
    }
  }

  $musclePanelFront.addEventListener("muscle-change", updateGenerateBtn);
  $musclePanelBack.addEventListener("muscle-change", updateGenerateBtn);

  updateGenerateBtn();

  $btnSkip?.addEventListener("click", () => generateTraining($thisPopup));
  $btnGenerate?.addEventListener("click", () => generateTraining($thisPopup));
});
