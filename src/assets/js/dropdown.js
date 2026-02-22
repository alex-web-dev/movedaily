const $dropdowns = document.querySelectorAll(".dropdown");
$dropdowns.forEach(($dropdown) => {
  const $btn = $dropdown.querySelector(".dropdown__btn");

  $btn.addEventListener("click", (e) => {
    e.stopPropagation();

    $dropdowns.forEach(($d) => {
      if ($d !== $dropdown) {
        closeDropdown($d);
      }
    });

    toggleDropdown($dropdown);
  });
});

window.addEventListener("click", (e) => {
  if (e.target.closest(".dropdown")) return;

  $dropdowns.forEach(($d) => closeDropdown($d));
});

export function toggleDropdown($dropdown) {
  const isActive = $dropdown.classList.toggle("dropdown--active");

  const $btn = $dropdown.querySelector(".dropdown__btn");
  $btn.classList.toggle("dropdown__btn--active");

  $dropdown.dispatchEvent(
    new CustomEvent(isActive ? "dropdown:open" : "dropdown:close", {
      bubbles: true,
    }),
  );
}

export function openDropdown($dropdown) {
  $dropdown.classList.add("dropdown--active");

  const $btn = $dropdown.querySelector(".dropdown__btn");
  $btn.classList.add("dropdown__btn--active");

  $dropdown.dispatchEvent(new CustomEvent("dropdown:open", { bubbles: true }));
}

export function closeDropdown($dropdown) {
  if (!$dropdown.classList.contains("dropdown--active")) return;

  $dropdown.classList.remove("dropdown--active");

  const $btn = $dropdown.querySelector(".dropdown__btn");
  $btn.classList.remove("dropdown__btn--active");

  $dropdown.dispatchEvent(new CustomEvent("dropdown:close", { bubbles: true }));
}
