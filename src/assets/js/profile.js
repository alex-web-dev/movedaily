import { closePopup, openPopup } from "./popup";
import { validateName, validateEmail, validatePhone } from "./utils/validation";

const validators = {
  name: validateName,
  email: validateEmail,
  phone: validatePhone,
};

const $info = document.querySelector(".profile-info");
if ($info) {
  const $inputs = $info.querySelectorAll(".profile-info__input");

  $inputs.forEach(($input) => {
    const $field = $input.querySelector(".input__field");
    $field.addEventListener("blur", () => validateField($input));
  });
}

const $cancelSubscribePopup = document.querySelector('.popup[data-popup-name="cancel-subscribe"]');
if ($cancelSubscribePopup) {
  const $subscibeCanceledPopup = document.querySelector('.popup[data-popup-name="subscribe-canceled"]');
  const $confirmBtn = $cancelSubscribePopup.querySelector(".confirm__btn--confirm");

  $confirmBtn.addEventListener("click", () => {
    //Подписка отменена
    closePopup($cancelSubscribePopup);
    openPopup($subscibeCanceledPopup);
  });
}

function validateField($input) {
  const $field = $input.querySelector(".input__field");
  const $error = $input.querySelector(".input__error");

  const type = $field.dataset.type;
  const value = $field.value;

  const errorMessage = validators[type]?.(value) ?? "";

  $error.textContent = errorMessage;
  $input.classList.toggle("input--error", !!errorMessage);

  return !errorMessage;
}
