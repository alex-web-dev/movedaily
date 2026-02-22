import { getFormData, resetAllForms } from "./app-form-data";

import { openPopup, closePopup } from "./popup";

// Запуск процесса генерации тренировки
export function generateTraining($sourcePopup) {
  const $loaderPopup = document.querySelector('.popup[data-popup-name="generate-loader"]');
  const $failedPopup = document.querySelector('.popup[data-popup-name="generate-failed"]');
  const $failedCountPopup = document.querySelector('.popup[data-popup-name="generate-failed-count"]');
  const $successPopup = document.querySelector('.popup[data-popup-name="generated-training"]');
  const $trainingAccess = document.querySelector(".training-access");

  //Объект с данными форм
  const appFormData = getFormData();
  console.log(appFormData);

  if ($sourcePopup) {
    closePopup($sourcePopup);
  }

  openPopup($loaderPopup);

  setTimeout(() => {
    closePopup($loaderPopup);

    const config = JSON.parse($trainingAccess.dataset.config);

    if (config.totalCount !== -1 && config.currentCount >= config.totalCount) {
      openPopup($failedCountPopup);
      return;
    }

    const isFailed = Math.random() < 0.25;

    if (isFailed) {
      openPopup($failedPopup);
    } else {
      openPopup($successPopup);

      //Добавляем генерацию в блок доступных тренировок
      config.currentCount += 1;
      $trainingAccess.dataset.config = JSON.stringify(config);

      //Очищаем все данные форм
      resetAllForms();
    }
  }, 1500);
}
