export function createElem(type, className, options) {
  const $elem = document.createElement(type);
  $elem.className = className;
  for (let key in options) {
    $elem[key] = options[key];
  }

  return $elem;
}

export function moveElement(options) {
  const { element, from, to, width, fromInsertType = "append", toInsertType = "append" } = options;

  const $elem = document.querySelector(element);
  const $from = document.querySelector(from);
  const $to = document.querySelector(to);

  if (!$elem || !$from || !$to) {
    return;
  }

  setTimeout(() => {
    if (window.innerWidth <= width && $elem.parentNode === $from) {
      $to[toInsertType]($elem);
    } else if (window.innerWidth > width && $elem.parentNode !== $from) {
      $from[fromInsertType]($elem);
    }
  });
}

let cachedScrollbarWidth = null;

export function getScrollbarWidth() {
  return window.innerWidth - document.documentElement.clientWidth;
}

export function lockBody(onlyMobile = false) {
  if (onlyMobile && window.innerWidth >= 768) return;

  if (document.body.classList.contains("body--lock")) {
    return;
  }

  cachedScrollbarWidth = getScrollbarWidth();
  const scrollbarWidthPX = `${cachedScrollbarWidth}px`;

  document.body.classList.add("body--lock");
  document.body.style.paddingRight = scrollbarWidthPX;

  const $absoluteElems = document.querySelectorAll(".header");
  $absoluteElems.forEach(($elem) => {
    $elem.style.paddingRight = scrollbarWidthPX;
  });
}

export function unlockBody() {
  if (!document.body.classList.contains("body--lock")) return;

  document.body.classList.remove("body--lock");
  document.body.style.paddingRight = "";

  const $absoluteElems = document.querySelectorAll(".header");
  $absoluteElems.forEach(($elem) => {
    $elem.style.paddingRight = "";
  });

  cachedScrollbarWidth = null;
}

export function getBodyLockedBy() {
  return document.body.dataset.lockedBy ? document.body.dataset.lockedBy : "";
}

export function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function pluralize(n, one, few, many) {
  const abs = Math.abs(n);
  const mod10 = abs % 10;
  const mod100 = abs % 100;

  if (mod100 >= 11 && mod100 <= 19) return many;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}

export default {
  createElem,
  moveElement,
  getScrollbarWidth,
  lockBody,
  unlockBody,
  getBodyLockedBy,
  isMobileDevice,
  pluralize,
};
