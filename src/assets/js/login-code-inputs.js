const ERROR_CLASS = "code-input--error";
const CORRECT_CODE = "1234";

const $codeInputs = document.querySelector(".code-inputs");
if ($codeInputs) {
  const $inputs = document.querySelectorAll(".code-inputs__input");
  $inputs.forEach(($input, index) => {
    $input.addEventListener("input", () => {
      $inputs.forEach(($input) => $input.classList.remove(ERROR_CLASS));

      if ($input.value && index < $inputs.length - 1) {
        const $nextInput = $inputs[index + 1];
        $nextInput.focus();
        $nextInput.select();
      }

      checkCode($inputs);
    });

    $input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace") {
        $inputs.forEach(($input) => $input.classList.remove(ERROR_CLASS));

        if (!$input.value && index > 0) {
          const $prevInput = $inputs[index - 1];
          $prevInput.focus();
          $prevInput.select();
        }
      }
    });

    $input.addEventListener("focus", () => $input.select());

    $input.addEventListener("paste", (e) => {
      const paste = e.clipboardData.getData("text").replace(/\D/g, "");
      if (paste.length === $inputs.length) {
        e.preventDefault();

        $inputs.forEach(($input, i) => $input.value = paste[i] || "");

        checkCode($inputs);
      }
    });
  });
}

function checkCode($inputs) {
  const code = Array.from($inputs)
    .map(($input) => $input.value)
    .join("");

  if (code.length !== $inputs.length) {
    return;
  }

  if (code === CORRECT_CODE) {
    window.location.href = "/";
  } else {
    $inputs.forEach(($input) => $input.classList.add(ERROR_CLASS));
  }
}
