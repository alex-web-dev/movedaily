import { generateTraining } from "./generate-training";

// Окно Спорт
const $popupSport = document.querySelector('.popup[data-popup-name="sport"]');

if ($popupSport) {
  const $generateBtn = $popupSport.querySelector(".training-form__btn");
  const $checkboxes = $popupSport.querySelectorAll(".checkbox-input__field");

  const updateButtonState = () => {
    const isAnyChecked = Array.from($checkboxes).some(($checkbox) => $checkbox.checked);

    if (isAnyChecked) {
      $generateBtn.removeAttribute("disabled");
    } else {
      $generateBtn.setAttribute("disabled", "disabled");
    }
  };

  updateButtonState();

  $checkboxes.forEach(($checkbox) => {
    $checkbox.addEventListener("change", updateButtonState);
  });

  $generateBtn.addEventListener("click", () => {
    if (!$generateBtn.disabled) {
      generateTraining($popupSport);
    }
  });
}
