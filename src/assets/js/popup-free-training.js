import { generateTraining } from "./generate-training";

const $popupFreeTraining = document.querySelector('.popup[data-popup-name="free-training"]');
if ($popupFreeTraining) {
  const $nextBtn = $popupFreeTraining.querySelector(".training-form__btn");

  $nextBtn.addEventListener("click", () => {
    const $nextPopup = $popupFreeTraining.dataset.popupNext;
    if (!$nextPopup) {
      // Отсутствует промежуточное модальное окно, сразу переходим к генерации
      generateTraining($popupFreeTraining); 
    }
  });
}
