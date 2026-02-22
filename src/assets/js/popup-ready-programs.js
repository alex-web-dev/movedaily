import { generateTraining } from "./generate-training";

// Окно Готовые программы (контекст тренировки)
const $popupReadyPrograms = document.querySelector('.popup[data-popup-name="ready-programs"]');

if ($popupReadyPrograms) {
  const $generateBtn = $popupReadyPrograms.querySelector(".training-form__btn");

  $generateBtn.addEventListener("click", () => {
    generateTraining($popupReadyPrograms);
  });
}
