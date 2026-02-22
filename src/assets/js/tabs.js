initTabs();

export function initTabs(container = document) {
  const $tabsBtnsBoxes = container.querySelectorAll(".tabs-btns");

  $tabsBtnsBoxes.forEach(($tabsBtnsBox) => {
    const $btns = $tabsBtnsBox.querySelectorAll(".tabs-btns__btn");

    $btns.forEach(($btn, index) => {
      $btn.addEventListener("click", () => {
        changeTab($tabsBtnsBox.dataset.tabsName, index);
      });
    });
  });
}

function changeTab(name, index) {
  const $btnsBox = document.querySelector(`.tabs-btns[data-tabs-name="${name}"]`);

  const $btns = $btnsBox.querySelectorAll(".tabs-btns__btn");
  const $lists = document.querySelectorAll(`.tabs-list[data-tabs-name="${name}"]`);

  const $oldActiveBtn = $btnsBox.querySelector(".tabs-btns__btn--active");
  $oldActiveBtn?.classList.remove("tabs-btns__btn--active");

  $btns[index].classList.add("tabs-btns__btn--active");

  $lists.forEach(($list) => {
    const $items = $list.querySelectorAll(".tabs-list__item");
    const $oldActiveTab = $list.querySelector(".tabs-list__item--active");

    $oldActiveTab?.classList.remove("tabs-list__item--active");

    $items[index]?.classList.add("tabs-list__item--active");
  });
}

export default {
  initTabs,
};
