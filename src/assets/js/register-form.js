const $register = document.querySelector(".auth--register");
if ($register) {
  const $authForm = $register.querySelector(".auth-form");

  const $step1 = $authForm.querySelector('.auth-form__step[data-step="1"]');
  const $step2 = $authForm.querySelector('.auth-form__step[data-step="2"]');

  const $nameInputField = $step1.querySelector(".input__field");
  const $step1Btn = $step1.querySelector(".auth-form__btn");

  $nameInputField.addEventListener("input", () => {
    const value = $nameInputField.value.trim();
    $step1Btn.disabled = value.length < 2;
  });

  $nameInputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !$step1Btn.disabled) {
      $step1Btn.click();
    }
  });

  $step1Btn.addEventListener("click", () => {
    const value = $nameInputField.value.trim();
    if (value.length < 2) return;

    $step1.classList.remove("auth-form__step--active");
    $step2.classList.add("auth-form__step--active");
  });

  const $checkboxes = $step2.querySelectorAll(".checkbox-input__field");
  const $step2Btn = $step2.querySelector(".auth-form__btn");

  $checkboxes.forEach(($checkbox) => {
    $checkbox.addEventListener("change", () => {
      const isChecked = Array.from($checkboxes).some(($cb) => $cb.checked);
      $step2Btn.disabled = !isChecked;
    });
  });

  $step2Btn.addEventListener("click", () => {
    // const selectedSports = Array.from($checkboxes)
    //   .filter(($cb) => $cb.checked)
    //   .map(($cb) => $cb.closest(".checkbox-input").querySelector(".checkbox-input__text").textContent.trim());

    window.location.href = "index.html";
  });

  const $step2Skip = $step2.querySelector(".auth-form__skip");
  $step2Skip.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}
