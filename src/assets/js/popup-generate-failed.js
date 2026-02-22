import { generateTraining } from "./generate-training";

//Кнопка Повторить при ошибке генерации
const $generateFailedPopup = document.querySelector('.popup[data-popup-name="generate-failed"]');
if ($generateFailedPopup) {
  const $repeatGeneration = $generateFailedPopup.querySelector(".generate-status__generate-btn");
  $repeatGeneration.addEventListener("click", () => {
    generateTraining($generateFailedPopup);
  });
}
