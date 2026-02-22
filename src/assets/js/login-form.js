import { isValidEmail, isValidPhone } from "./utils/validation";

const $login = document.querySelector(".auth--login");
if ($login) {
  const $step1 = document.querySelector('.auth-form__step[data-step="1"]');
  const $step2 = document.querySelector('.auth-form__step[data-step="2"]');

  const $step2Title = $step2.querySelector(".auth-form__title");

  const $input = $step1.querySelector(".input");
  const $inputField = $step1.querySelector(".input__field");
  const $nextBtn = $step1.querySelector(".auth-form__btn");

  const infoText = $step2.querySelector(".auth-form__text");
  const resendBtn = $step2.querySelector(".auth-form__btn");

  $inputField.addEventListener("input", () => {
    if ($inputField.value.length > 0) {
      $nextBtn.classList.remove("auth-form__btn--hide");
    } else {
      $nextBtn.classList.add("auth-form__btn--hide");
    }
    clearInputError($input);
  });

  $inputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      $nextBtn.click();
    }
  });

  $nextBtn.addEventListener("click", () => {
    const value = $inputField.value.trim();

    if (!value) {
      showInputError($input, "Введите номер телефона или email");
      return;
    }

    const isEmail = isValidEmail(value);
    const isPhone = isValidPhone(value);

    if (!isEmail && !isPhone) {
      showInputError($input, "Введите корректный номер телефона или email");
      return;
    }

    clearInputError($input);

    $step2Title.textContent = isPhone ? "Код из SMS" : "Код из письма";

    infoText.textContent = isEmail ? `Отправили на ${value}` : `Отправили на номер ${formatPhone(value)}`;

    $step1.classList.remove("auth-form__step--active");
    $step2.classList.add("auth-form__step--active");

    startTimer(50);
  });

  let timerInterval;

  function startTimer(seconds) {
    clearInterval(timerInterval);
    resendBtn.disabled = true;

    let remaining = seconds;
    updateButtonText(remaining);

    timerInterval = setInterval(() => {
      remaining--;

      if (remaining <= 0) {
        clearInterval(timerInterval);
        resendBtn.disabled = false;
        resendBtn.textContent = "Отправить еще код";
        return;
      }

      updateButtonText(remaining);
    }, 1000);
  }

  function updateButtonText(sec) {
    const mm = String(Math.floor(sec / 60)).padStart(2, "0");
    const ss = String(sec % 60).padStart(2, "0");
    resendBtn.textContent = `Отправить еще код ${mm}:${ss}`;
  }

  resendBtn.addEventListener("click", () => {
    startTimer(50);
  });
}

function showInputError($input, message) {
  $input.classList.add("input--error");

  const $errorText = $input.querySelector(".input__error");
  $errorText.textContent = message;
}

function clearInputError($input) {
  $input.classList.remove("input--error");

  const $errorText = $input.querySelector(".input__error");
  $errorText.textContent = "";
}



function formatPhone(value) {
  const digits = value.replace(/\D/g, "").slice(-10);
  return `+7 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`;
}
