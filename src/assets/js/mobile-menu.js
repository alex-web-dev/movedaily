import { lockBody, unlockBody } from "./utils";

const $menu = document.querySelector(".mobile-menu");
const $menuContent = document.querySelector(".mobile-menu__content");
const delay = 500;

if ($menu && $menuContent) {
  const $toggleMenuBtns = document.querySelectorAll(".js-toggle-menu");
  $toggleMenuBtns.forEach(($menuToggle) => {
    $menuToggle.addEventListener("click", () => {
      const isActive = $menu.classList.contains("mobile-menu--active");

      if (!isActive) {
        open($menu, $toggleMenuBtns, $menuContent);
      } else {
        close($menu, $toggleMenuBtns, $menuContent);
      }

      if ($menu.classList.contains("mobile-menu--show")) {
        $menu.classList.remove("mobile-menu--show");
      } else {
        setTimeout(() => $menu.classList.add("mobile-menu--show"), delay);
      }
    });
  });

  const $closeMenuBtns = document.querySelectorAll(".js-close-menu");
  $closeMenuBtns.forEach(($closeBtn) => {
    $closeBtn.addEventListener("click", () => close($menu, $toggleMenuBtns, $menuContent));
  });
}

function open($menu, $toggleMenuBtns, $menuContent) {
  $menu.classList.add("mobile-menu--active");

  $menuContent.style.height = `${$menuContent.offsetHeight}px`;

  requestAnimationFrame(() => {
    $menuContent.style.height = `${$menuContent.scrollHeight}px`;
  });

  $toggleMenuBtns.forEach(($menuToggle) => $menuToggle.classList.add("menu-toggle--active"));

  lockBody("mobile-menu");
}

function close($menu, $toggleMenuBtns, $menuContent) {
  $menuContent.style.height = `${$menuContent.scrollHeight}px`;

  const headerHeight = document.querySelector(".header").offsetHeight;

  requestAnimationFrame(() => {
    $menuContent.style.height = `${headerHeight}px`;
  });

  $menu.classList.remove("mobile-menu--active");

  $toggleMenuBtns.forEach(($menuToggle) => $menuToggle.classList.remove("menu-toggle--active"));

  unlockBody();
}
