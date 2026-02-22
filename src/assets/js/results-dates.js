import { openPopup, closePopup } from "./popup";

const $resultsDates = document.querySelector(".results-dates");
if ($resultsDates) {
  const selectWrappers = $resultsDates.querySelectorAll(".results-dates__select");
  const $compareBtn = $resultsDates.querySelector(".results-dates__btn");

  const $inputA = $resultsDates.querySelectorAll(".select-btn__text")[0];
  const $inputB = $resultsDates.querySelectorAll(".select-btn__text")[1];

  const checkFilled = () => {
    const filled = $inputA.value.trim() !== "" && $inputB.value.trim() !== "" && $inputA.value !== $inputB.value;

    $compareBtn.disabled = !filled;
  };

  checkFilled();

  $inputA.addEventListener("input", checkFilled);
  $inputB.addEventListener("input", checkFilled);

  $compareBtn.disabled = true;

  $resultsDates.addEventListener("dropdown:open", (e) => {
    const currentSelect = e.target.closest(".results-dates__select");

    selectWrappers.forEach((wrapper) => {
      if (wrapper !== currentSelect) {
        wrapper.classList.add("results-dates__select--hide");
      }
    });

    $resultsDates.classList.add("results-dates--blur");
  });

  $resultsDates.addEventListener("dropdown:close", () => {
    selectWrappers.forEach((wrapper) => wrapper.classList.remove("results-dates__select--hide"));

    const hasActive = $resultsDates.querySelector(".dropdown--active");
    if (!hasActive) {
      $resultsDates.classList.remove("results-dates--blur");
    }
  });

  const $thisPopup = $resultsDates.closest(".popup");
  const $resultsPopup = document.querySelector('.popup[data-popup-name="results"]');

  $compareBtn.addEventListener("click", () => {
    closePopup($thisPopup);
    openPopup($resultsPopup);
  });
}
