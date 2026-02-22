import { closePopup, openPopup } from "./popup";

// Окно диагностики
const $diagnostics = document.querySelector(".video-section--diagnostics");
if ($diagnostics) {
  const $sectionRight = $diagnostics.querySelector(".video-section__right");

  const $step1 = $diagnostics.querySelectorAll(".video-section__step")[0];
  const $step2 = $diagnostics.querySelectorAll(".video-section__step")[1];
  const $step3 = $diagnostics.querySelectorAll(".video-section__step")[2];

  const $timerValue = $step2.querySelector(".training-timer__value");

  const $switchBtnsBox = $step2.querySelector(".training-process__btns");
  const $switchBtns = $switchBtnsBox.querySelectorAll(".training-process__btn");

  const $step1Start = $step1.querySelector(".training-process__footer-btn");

  const $step2Back = $step2.querySelectorAll(".training-process__steps-btn")[0];
  const $step2Skip = $step2.querySelectorAll(".training-process__steps-btn")[1];
  const $step2Done = $step2.querySelector(".training-process__footer-btn");

  const $step3Back = $step3.querySelectorAll(".training-quiz__footer-btn")[0];
  const $step3Next = $step3.querySelectorAll(".training-quiz__footer-btn")[1];

  const $timer = $step2.querySelector(".training-timer");

  const $video = $diagnostics.querySelector(".video__player");

  let timerInterval = null;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const startTimer = (seconds) => {
    let remaining = seconds;

    $timerValue.textContent = formatTime(remaining);

    timerInterval = setInterval(() => {
      remaining--;

      $timerValue.textContent = formatTime(remaining);

      if (remaining <= 0) {
        clearInterval(timerInterval);

        console.log("Таймер завершён");
      }
    }, 1000);
  };

  $step1Start.addEventListener("click", () => {
    $step1.classList.remove("video-section__step--active");
    $step2.classList.add("video-section__step--active");

    const seconds = parseInt($timerValue.dataset.timerSeconds, 10);

    if (!isNaN(seconds)) {
      startTimer(seconds);
    }
  });

  const $progress = $step2.querySelector(".progress");
  const $progressValues = $step2.querySelector(".training-process__progress-values");

  const getProgressValue = () => parseInt($progress.dataset.value, 10);
  const getProgressMax = () => parseInt($progress.dataset.max, 10);

  const updateProgressUI = () => {
    const value = getProgressValue();
    const max = getProgressMax();

    $progressValues.textContent = `${value}/${max}`;

    if (value >= max) {
      $step2Done.removeAttribute("disabled");
      $switchBtnsBox.classList.add("training-process__btns--hidden");

      $timer.classList.add("training-process__timer--long");
      stopTimer();
    } else {
      $step2Done.setAttribute("disabled", "true");
      $switchBtnsBox.classList.remove("training-process__btns--hidden");

      $timer.classList.remove("training-process__timer--long");
    }
  };

  const incrementProgress = () => {
    const value = getProgressValue();
    const max = getProgressMax();

    if (value < max) {
      $progress.dataset.value = value + 1;
      updateProgressUI();
    }
  };

  const updateSwitchBtnsText = () => {
    $switchBtns.forEach(($btn) => {
      const $text = $btn.querySelector(".training-btn__text");

      if ($btn.classList.contains("training-btn--active")) {
        $text.textContent = "Сейчас";
      } else {
        $text.textContent = "Ожидает";
      }
    });
  };

  const toggleActiveSwitchBtn = () => {
    const $activeBtn = $switchBtnsBox.querySelector(".training-btn--active");
    const $nextBtn = [...$switchBtns].find(($btn) => $btn !== $activeBtn);

    if ($activeBtn && $nextBtn) {
      $activeBtn.classList.remove("training-btn--active");
      $nextBtn.classList.add("training-btn--active");
    }

    updateSwitchBtnsText();
  };

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  };

  const resetStep2 = () => {
    stopTimer();

    $progress.dataset.value = 0;

    const initialSeconds = parseInt($timerValue.dataset.timerSeconds, 10);
    $timerValue.textContent = formatTime(initialSeconds);

    $timer.classList.remove("training-process__timer--long");

    $switchBtnsBox.classList.remove("training-process__btns--hidden");

    $step2Done.setAttribute("disabled", "true");

    $switchBtns.forEach(($btn, index) => {
      if (index === 0) {
        $btn.classList.add("training-btn--active");
      } else {
        $btn.classList.remove("training-btn--active");
      }
    });

    updateSwitchBtnsText();
    updateProgressUI();
  };

  const pauseVideo = () => {
    if ($video && typeof $video.pause === "function") {
      $video.pause();
    }
  };

  const goToStep = ($from, $to) => {
    stopTimer();

    $from.classList.remove("video-section__step--active");
    $to.classList.add("video-section__step--active");
  };

  updateProgressUI();
  updateSwitchBtnsText();

  $switchBtns.forEach(($btn) => {
    $btn.addEventListener("click", () => {
      if (!$btn.classList.contains("training-btn--active")) return;

      toggleActiveSwitchBtn();
      incrementProgress();
    });
  });

  $step2Back.addEventListener("click", () => {
    resetStep2();
    goToStep($step2, $step1);
  });

  $step2Skip.addEventListener("click", () => {
    goToStep($step2, $step3);
    pauseVideo();
    $sectionRight.classList.add("video-section__right--w-lg");
  });

  $step2Done.addEventListener("click", () => {
    if (getProgressValue() === getProgressMax()) {
      goToStep($step2, $step3);
      pauseVideo();
      $sectionRight.classList.add("video-section__right--w-lg");
    }
  });

  $step3Back.addEventListener("click", () => {
    goToStep($step3, $step2);
    $sectionRight.classList.remove("video-section__right--w-lg");
  });

  $step3Next.addEventListener("click", () => {
    pauseVideo();

    const $popupDiagnosticsEnd = document.querySelector('.popup[data-popup-name="diagnostics-end"]');
    openPopup($popupDiagnosticsEnd);

    const $popup = $diagnostics.closest(".popup");
    closePopup($popup);

    resetStep2();
    goToStep($step3, $step1);
  });
}
