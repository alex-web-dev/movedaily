const $progressBars = document.querySelectorAll(".progress");
$progressBars.forEach(initProgress);

function updateProgress(el) {
  const $bar = el.querySelector(".progress__bar");
  if (!$bar) return;

  const value = parseFloat(el.dataset.value) || 0;
  const max = parseFloat(el.dataset.max) || 1;

  const percent = Math.min(Math.max((value / max) * 100, 0), 100);

  $bar.style.width = percent + "%";
}

function initProgress(el) {
  updateProgress(el);

  const observer = new MutationObserver(() => updateProgress(el));

  observer.observe(el, {
    attributes: true,
    attributeFilter: ["data-value", "data-max"],
  });
}

