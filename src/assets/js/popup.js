import { lockBody, unlockBody } from "./utils";

const $overlay = document.querySelector(".popup-overlay");

function updateBodyLock() {
  const $activePopup = document.querySelector(".popup.popup--active");

  if ($activePopup) {
    lockBody();

    $overlay.classList.add("popup-overlay--active");

    if ($activePopup.classList.contains("popup--black")) {
      $overlay.classList.add("popup-overlay--black");
    } else {
      $overlay.classList.remove("popup-overlay--black");
    }
  } else {
    unlockBody();
    $overlay.classList.remove("popup-overlay--active");
    $overlay.classList.remove("popup-overlay--black");
  }
}

function initOpenButtons() {
  const $openBtns = document.querySelectorAll(".js-open-popup");

  $openBtns.forEach(($btn) => {
    $btn.addEventListener("click", () => {
      const name = $btn.dataset.popupName;
      const next = $btn.dataset.popupNext;
      const title = $btn.dataset.popupTitle;

      const $popup = document.querySelector(`.popup[data-popup-name="${name}"]`);

      if (!name || !$popup || $popup.classList.contains("popup--active")) {
        return;
      }

      if (title) {
        const $title = $popup.querySelector(".popup__title");
        if ($title) {
          $title.textContent = title;
        }
      }

      if (next) {
        $popup.dataset.popupNext = next;
      } else {
        $popup.removeAttribute("data-popup-next");
      }

      openPopup($popup);
    });
  });
}

function initPopupNextButtons() {
  document.addEventListener("click", (e) => {
    const $btn = e.target.closest(".js-popup-next");
    if (!$btn) return;

    const $popup = $btn.closest(".popup");
    if (!$popup) return;

    const nextName = $popup.dataset.popupNext;
    if (!nextName) return;

    const $nextPopup = document.querySelector(`.popup[data-popup-name="${nextName}"]`);

    if (!$nextPopup) return;

    closePopup($popup);
    openPopup($nextPopup);
  });
}

function initPopups() {
  const $popups = document.querySelectorAll(".popup");

  window.addEventListener("load", () => {
    $popups.forEach(($popup) => $popup.classList.add("popup--show"));
  });

  $popups.forEach(($popup) => {
    const $closeBtns = $popup.querySelectorAll(".js-close-this-popup");
    $closeBtns.forEach(($closeBtn) => {
      $closeBtn.addEventListener("click", () => closePopup($popup));
    });

    const $backdrop = $popup.querySelector(".popup__backdrop");
    $backdrop?.addEventListener("click", () => closePopup($popup));

    const $dialog = $popup.querySelector(".popup__dialog");
    $dialog?.addEventListener("click", (e) => {
      if (e.target === $dialog) {
        closePopup($popup);
      }
    });
  });
}

export function openPopup($popup) {
  const isMobileLock = $popup.dataset.popupLock === "mobile" && window.innerWidth < 768;

  const isNoLock = $popup.dataset.popupLock === "no";

  $popup.classList.add("popup--active");

  if (!isNoLock) {
    if (isMobileLock || $popup.dataset.popupLock !== "mobile") {
      updateBodyLock();
    }
  }
}

export function closePopup($popup) {
  $popup.classList.remove("popup--active");

  $popup.addEventListener(
    "transitionend",
    () => {
      updateBodyLock();
    },
    { once: true },
  );

  const $video = $popup.querySelector("video");
  if ($video && typeof $video.pause === "function") {
    $video.pause();
  }
}

initOpenButtons();
initPopups();
initPopupNextButtons();

export default {
  openPopup,
  closePopup,
};
