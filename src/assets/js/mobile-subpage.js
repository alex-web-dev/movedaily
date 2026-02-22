import { getBodyLockedBy, lockBody, unlockBody } from "./utils";

const $openBtns = document.querySelectorAll(".js-open-subpage");
$openBtns.forEach(($btn) => {
  $btn.addEventListener("click", () => {
    const name = $btn.dataset.subpageName;
    const $subpage = document.querySelector(`.mobile-subpage[data-subpage-name="${name}"`);

    if (window.innerWidth > 991 || !name || !$subpage || $subpage.classList.contains("mobile-subpage--active")) {
      return;
    }

    open($subpage);
  });
});

const $subpages = document.querySelectorAll(".mobile-subpage");
$subpages.forEach(($subpage) => {
  const $closeBtns = $subpage.querySelectorAll(".js-close-subpage");
  $closeBtns.forEach(($closeBtn) => {
    $closeBtn?.addEventListener("click", () => close($subpage));
  });
});

function close($subpage) {
  $subpage.classList.remove("mobile-subpage--active");
  unlockBody();
}

function open($subpage) {
  $subpage.classList.add("mobile-subpage--active");

  if (!getBodyLockedBy()) {
    lockBody(`subpage-${$subpage.dataset.subpageName}`, true);
  }
}
