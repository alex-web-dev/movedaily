function updateSemiProgress($progress) {
  const $bar = $progress.querySelector(".semi-progress__bar");
  const $dot = $progress.querySelector(".semi-progress__dot");
  const valueText = $progress.querySelector(".semi-progress__value");

  const value = parseFloat($progress.dataset.value) || 0;
  const max = parseFloat($progress.dataset.max) || 1;

  const percent = Math.min(Math.max(value / max, 0), 1);

  const length = $bar.getTotalLength();

  $bar.style.strokeDasharray = length;
  $bar.style.strokeDashoffset = length - length * percent;

  const point = $bar.getPointAtLength(length * percent);
  $dot.setAttribute("cx", point.x);
  $dot.setAttribute("cy", point.y);

  if (valueText) {
    valueText.textContent = Math.round(percent * 100) + "%";
  }
}

function initSemiProgress($progress) {
  updateSemiProgress($progress);

  const observer = new MutationObserver(() => {
    updateSemiProgress($progress);
  });

  observer.observe($progress, {
    attributes: true,
    attributeFilter: ["data-value", "data-max"],
  });
}

const $progressElems = document.querySelectorAll(".semi-progress");
$progressElems.forEach(initSemiProgress);
