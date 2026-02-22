import { openPopup } from "./popup";

const $changes = document.querySelector(".changes");
const $resultsDates = document.querySelector(".results-dates");

if ($changes && $resultsDates) {
  const $btn = $changes.querySelector(".changes__btn");
  const $analyticsPanel = document.querySelector(".muscle-panel--analytics");

  const $inputA = $resultsDates.querySelectorAll(".select-btn__text")[0];

  const $resultsDatesPopup = $resultsDates.closest(`.popup[data-popup-name="results-dates"]`);

  $btn.addEventListener("click", () => {
    const selectValue = $analyticsPanel.querySelector(".select-btn__text").value;

    $inputA.value = selectValue;
    $inputA.dispatchEvent(new Event("input", { bubbles: true }));
    
    openPopup($resultsDatesPopup);
  });
}
