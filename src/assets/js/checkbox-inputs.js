document.addEventListener("change", (e) => {
  const $input = e.target;

  if (!$input.matches('[data-single-toggle] input[type="checkbox"]')) return;

  const $group = $input.closest("[data-single-toggle]");
  const $checkboxes = $group.querySelectorAll('input[type="checkbox"]');

  if ($input.checked) {
    $checkboxes.forEach(($checkbox) => {
      if ($checkbox !== $input) $checkbox.checked = false;
    });
  }
});
