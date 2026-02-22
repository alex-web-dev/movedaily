import { closeDropdown } from "./dropdown.js";

const $selects = document.querySelectorAll(".select");

$selects.forEach(($select) => {
  const $items = $select.querySelectorAll(".select__item");
  const $textInput = $select.querySelector(".select-btn__text");
  const $dropdown = $select.closest(".dropdown");

  $items.forEach(($item) => {
    $item.addEventListener("click", (e) => {
      e.stopPropagation();

      const newText = $item.dataset.selectText || $item.textContent;

      $textInput.value = newText;

      const event = new Event("input", { bubbles: true });
      $textInput.dispatchEvent(event);

      closeDropdown($dropdown);
    });
  });
});
