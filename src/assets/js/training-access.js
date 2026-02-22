/**
 * Конфигурация блока "Доступные тренировки"
 * Передаётся через атрибут data-config на элементе .training-access
 *
 * Пример:
 * data-config='{"currentCount": 0, "totalCount": 3, "plan": "basic"}'
 *
 * currentCount  - Количество уже использованных генераций
 * totalCount    - Общее количество доступных генераций. Если передать -1 - генерации считаются безлимитными
 * plan          - Текущий тарифный план пользователя.
 *    Возможные значения:
 *      "basic"    - базовый план
 *      "standard" - стандартный план
 *      "premium"  - премиум план
 *      "expired"  - подписка истекла
 */

import { pluralize } from "./utils";

const $trainingAccess = document.querySelector(".training-access");
if ($trainingAccess) {
  handler($trainingAccess);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "attributes" && mutation.attributeName === "data-config") {
        handler($trainingAccess);
      }
    });
  });

  observer.observe($trainingAccess, {
    attributes: true,
    attributeFilter: ["data-config"],
  });
}



function setActivePlan($trainingAccess, plan) {
  const $contents = $trainingAccess.querySelectorAll(".training-access__content");

  $contents.forEach(($content) => $content.classList.remove("training-access__content--active"));

  const $target = $trainingAccess.querySelector(`.training-access__content--${plan}`);
  if ($target) $target.classList.add("training-access__content--active");
}

function updateGeneratesCounts($trainingAccess, currentCount, totalCount) {
  const isInfinite = totalCount === -1;
  const $generatesCounts = $trainingAccess.querySelectorAll(".generates-count");

  $generatesCounts.forEach(($generatesCount) => {
    const $values = $generatesCount.querySelector(".generates-count__values");
    const $infinite = $generatesCount.querySelector(".generates-count__infinite");

    if ($values && !isInfinite) $values.classList.add("generates-count__values--active");
    if ($infinite && isInfinite) $infinite.classList.add("generates-count__infinite--active");

    if (!isInfinite && $values) {
      const $valueThis = $generatesCount.querySelector(".generates-count__value-this");
      const $valueTotal = $generatesCount.querySelector(".generates-count__value-total");

      if ($valueThis) $valueThis.innerText = currentCount;
      if ($valueTotal) $valueTotal.innerText = totalCount;
    }
  });
}

function handler($trainingAccess) {
  // Сброс состояния ошибки
  $trainingAccess.classList.remove("training-access--disabled");
  $trainingAccess.querySelectorAll(".training-available__btn, .training-access__generate-btn").forEach(($btn) => ($btn.disabled = false));
  $trainingAccess.querySelectorAll(".generates-count").forEach(($generatesCount) => {
    $generatesCount.classList.remove("generates-count--error");
  });

  // Сброс generates-count values/infinite
  $trainingAccess.querySelectorAll(".generates-count__values").forEach(($el) => $el.classList.remove("generates-count__values--active"));
  $trainingAccess
    .querySelectorAll(".generates-count__infinite")
    .forEach(($el) => $el.classList.remove("generates-count__infinite--active"));

  const config = JSON.parse($trainingAccess?.dataset?.config ?? "{}");
  const { currentCount, totalCount, plan } = config;
  const isInfinite = totalCount === -1;
  const remaining = isInfinite ? Infinity : totalCount - currentCount;

  const $availableTitle = $trainingAccess.querySelector(".training-available__title");
  const $availableText = $trainingAccess.querySelector(".training-available__text");

  const AVAILABLE_TEXT_DEFAULT = "Начните свой путь к здоровью и выберите тип тренировки, который подходит именно вам";
  const AVAILABLE_TEXT_LAST = "С «Премиум» подпиской вы получите неограниченный доступ ко всем тренировкам";

  setActivePlan($trainingAccess, plan);

  updateGeneratesCounts($trainingAccess, currentCount, totalCount);

  const $progressBars = $trainingAccess.querySelectorAll(".generates-count__progress");
  $progressBars.forEach(($progress) => {
    $progress.hidden = isInfinite;

    if (!isInfinite) {
      $progress.dataset.value = currentCount;
      $progress.dataset.max = totalCount;
    }
  });

  if ($availableTitle) {
    if (isInfinite) {
      $availableTitle.innerText = "У вас неограниченный доступ к тренировкам!";
    } else if (remaining === 1) {
      $availableTitle.innerText = "У вас осталась 1 тренировка!";
    } else {
      const wordForm = pluralize(remaining, "доступная тренировка", "доступные тренировки", "доступных тренировок");
      $availableTitle.innerText = `У вас есть ${remaining} ${wordForm}!`;
    }
  }

  if ($availableText) {
    $availableText.innerText = remaining === 1 ? AVAILABLE_TEXT_LAST : AVAILABLE_TEXT_DEFAULT;
  }

  if (!isInfinite && currentCount >= totalCount) {
    $trainingAccess.querySelectorAll(".training-available__btn, .training-access__generate-btn").forEach(($btn) => ($btn.disabled = true));

    $trainingAccess.classList.add("training-access--disabled");

    $trainingAccess.querySelectorAll(".generates-count").forEach(($generatesCount) => {
      $generatesCount.classList.add("generates-count--error");
    });
  }
}
