// Глобальное хранилище форм генерации видео
window.appFormData = {};

function collectPopupData($popup) {
  if (!$popup) return;

  const popupName = $popup.dataset.popupName;
  const inputs = $popup.querySelectorAll("input.checkbox-input__field");

  const values = {};

  inputs.forEach((input) => {
    const name = input.name;

    if (input.type === "checkbox") {
      if (!values[name]) values[name] = [];
      if (input.checked) values[name].push(input.value);
    }

    if (input.type === "radio" && input.checked) {
      values[name] = input.value;
    }
  });

  window.appFormData[popupName] = values;
}

function collectMuscleConfig($popupMuscle) {
  if (!$popupMuscle) return;

  const $panels = $popupMuscle.querySelectorAll('.muscle-panel__body[data-editable="true"]');

  const configs = {};

  $panels.forEach(($panel) => {
    const type = $panel.dataset.configType || "front";

    try {
      configs[type] = JSON.parse($panel.dataset.config || "{}");
    } catch (err) {
      configs[type] = {};
      console.error("Ошибка парсинга muscle config:", err);
    }
  });

  window.appFormData["muscle-select"] = configs;
}

const $popupFreeTraining = document.querySelector('.popup[data-popup-name="free-training"]');
const $popupReadyPrograms = document.querySelector('.popup[data-popup-name="ready-programs"]');
const $popupSport = document.querySelector('.popup[data-popup-name="sport"]');
const $popupMuscle = document.querySelector('.popup[data-popup-name="muscle-select"]');
const $allPopups = [$popupFreeTraining, $popupReadyPrograms, $popupSport];

$allPopups.forEach(($popup) => {
  if (!$popup) return;

  $popup.addEventListener("change", () => {
    setTimeout(() => collectPopupData($popup));
  });
});

if ($popupMuscle) {
  const $panels = $popupMuscle.querySelectorAll('.muscle-panel__body[data-editable="true"]');

  $panels.forEach(($panel) => {
    $panel.addEventListener("muscle-change", () => {
      collectMuscleConfig($popupMuscle);
    });
  });
}

// Очистка форм по кнопкам
document.querySelectorAll(".js-reset-forms").forEach(($btn) => {
  $btn.addEventListener("click", () => {
    resetAllForms();
  });
});

// Полная очистка
export function resetAllForms() {
  $allPopups.forEach(($popup) => {
    if (!$popup) return;

    const inputs = $popup.querySelectorAll("input.checkbox-input__field");
    inputs.forEach((input) => {
      input.checked = false;
    });
  });

  if ($popupMuscle) {
    const $panels = $popupMuscle.querySelectorAll('.muscle-panel__body[data-editable="true"]');

    $panels.forEach(($panel) => {
      $panel.dataset.config = "{}";
      $panel.dispatchEvent(new CustomEvent("muscle-change", { bubbles: true }));
    });
  }

  Object.keys(window.appFormData).forEach((key) => {
    delete window.appFormData[key];
  });
}

// Получение данных форм (копия)
export function getFormData() {
  return structuredClone(window.appFormData);
}

export default {
  resetAllForms,
  getFormData,
};
