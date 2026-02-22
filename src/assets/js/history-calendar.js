import { pluralize } from "./utils";

const MONTHS = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
const MONTHS_GEN = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
const WEEKDAYS_SHORT = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const MAX_VISIBLE = 3;

const $calendars = document.querySelectorAll(".calendar");
$calendars.forEach(($calendar) => {
  const $history = $calendar.closest(".history");
  let config = [];
  try {
    config = JSON.parse(($history || $calendar).dataset.config || "[]");
  } catch (e) {
        console.error("Ошибка парсинга данных календаря", e);
  }

  const eventMap = buildEventMap(config);

  const now = new Date();
  const todayKey = today();

  const state = {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    weekOffset: getInitialWeekOffset(now.getFullYear(), now.getMonth() + 1, now.getDate()),
    selectedDay: todayKey,
  };

  const $titleMonth = $calendar.querySelector(".js-calendar-month");
  const $titleYear = $calendar.querySelector(".js-calendar-year");
  const $desktopEl = $calendar.querySelector(".js-calendar-desktop");
  const $mobileEl = $calendar.querySelector(".js-calendar-mobile");
  const $btnPrev = $calendar.querySelector(".js-calendar-prev");
  const $btnNext = $calendar.querySelector(".js-calendar-next");

  const $donut = $history ? $history.querySelector(".chart-donut") : null;

  function renderAll() {
    $titleMonth.textContent = MONTHS[state.month - 1];
    $titleYear.textContent = state.year;

    renderDesktop($desktopEl, state.year, state.month, eventMap);
    renderMobile($mobileEl, state.year, state.month, state.weekOffset, eventMap, state.selectedDay, state);

    if ($donut) {
      const donutConfig = buildDonutConfig(config, state.year, state.month);

      const totalEvents = config.filter((ev) => {
        const d = new Date(ev.date);
        return d.getFullYear() === state.year && d.getMonth() + 1 === state.month;
      }).length;

      $donut.setAttribute("data-chart", JSON.stringify(donutConfig));
      $donut.setAttribute("data-word-value", totalEvents);
    }
  }

  $btnPrev.addEventListener("click", () => {
    const isMobile = window.innerWidth <= 991;
    if (isMobile) {
      state.weekOffset--;
      const firstOfMonth = new Date(state.year, state.month - 1, 1);
      const dow0 = dayOfWeek(firstOfMonth);
      const weekStart = new Date(firstOfMonth);
      weekStart.setDate(1 - dow0 + state.weekOffset * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      if (weekEnd < firstOfMonth) {
        state.month--;
        if (state.month < 1) {
          state.month = 12;
          state.year--;
        }
        const newFirst = new Date(state.year, state.month - 1, 1);
        const newLast = new Date(state.year, state.month, 0);
        const ndow0 = dayOfWeek(newFirst);

        const lastDayOff = ndow0 + newLast.getDate() - 1;
        state.weekOffset = Math.floor(lastDayOff / 7);
      }
    } else {
      state.month--;
      if (state.month < 1) {
        state.month = 12;
        state.year--;
      }
      state.weekOffset = 0;
    }
    renderAll();
  });

  $btnNext.addEventListener("click", () => {
    const isMobile = window.innerWidth <= 991;
    if (isMobile) {
      state.weekOffset++;
      const firstOfMonth = new Date(state.year, state.month - 1, 1);
      const dow0 = dayOfWeek(firstOfMonth);
      const weekStart = new Date(firstOfMonth);
      weekStart.setDate(1 - dow0 + state.weekOffset * 7);
      const lastOfMonth = new Date(state.year, state.month, 0);
      if (weekStart > lastOfMonth) {
        state.month++;
        if (state.month > 12) {
          state.month = 1;
          state.year++;
        }
        state.weekOffset = 0;
      }
    } else {
      state.month++;
      if (state.month > 12) {
        state.month = 1;
        state.year++;
      }
      state.weekOffset = 0;
    }
    renderAll();
  });

  renderAll();
});

function renderDesktop(container, year, month, eventMap) {
  const todayKey = today();
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const startOffset = dayOfWeek(firstDay);
  const totalDays = lastDay.getDate();

  let html = `<div class="calendar__weekdays">`;
  WEEKDAYS_SHORT.forEach((d, i) => {
    const cls = i >= 5 ? " calendar__weekday--weekend" : "";
    html += `<div class="calendar__weekday${cls}">${d}</div>`;
  });
  html += `</div><div class="calendar__grid">`;

  for (let i = 0; i < startOffset; i++) {
    html += `<div class="calendar__cell calendar__cell--empty"></div>`;
  }

  for (let day = 1; day <= totalDays; day++) {
    const dow = (startOffset + day - 1) % 7;
    const isWeekend = dow >= 5;
    const key = dateKey(year, month, day);
    const isToday = key === todayKey;
    const events = eventMap[key] || [];

    let cellCls = "calendar__cell";
    if (isWeekend) cellCls += " calendar__cell--weekend";

    html += `<div class="${cellCls}">`;
    html += `<div class="calendar__day-num${isToday ? " calendar__day-num--today" : ""}">${day}</div>`;
    html += `<div class="calendar__events">`;

    const visible = events.slice(0, MAX_VISIBLE);
    const hidden = events.length - MAX_VISIBLE;

    visible.forEach((ev) => {
      html += `
            <div class="calendar__event" style="background:${hexToRgba(ev.color, 0.6)}">
              <span class="calendar__event-title">${ev.title}</span>
              <span class="calendar__event-time">${ev.time}</span>
            </div>`;
    });

    if (hidden > 0) {
      html += `<div class="calendar__more">ещё + ${hidden} ${pluralize(hidden, "тренировка", "тренировки", "тренировок")}</div>`;
    }

    html += `</div></div>`;
  }

  const totalCells = startOffset + totalDays;
  const remainder = totalCells % 7;
  if (remainder !== 0) {
    for (let i = 0; i < 7 - remainder; i++) {
      html += `<div class="calendar__cell calendar__cell--empty"></div>`;
    }
  }

  html += `</div>`;
  container.innerHTML = html;
}

function renderMobile(container, year, month, weekOffset, eventMap, selectedDay, state) {
  const todayKey = today();
  const firstOfMonth = new Date(year, month - 1, 1);
  const dow0 = dayOfWeek(firstOfMonth);

  const weekStartDate = new Date(firstOfMonth);
  weekStartDate.setDate(1 - dow0 + weekOffset * 7);

  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStartDate);
    d.setDate(weekStartDate.getDate() + i);
    days.push(d);
  }

  let html = `<div class="calendar__week-strip">`;

  days.forEach((d, i) => {
    const key = dateKey(d.getFullYear(), d.getMonth() + 1, d.getDate());
    const isToday = key === todayKey;
    const isActive = key === selectedDay;
    const events = eventMap[key] || [];
    const dow = i;

    let dayCls = "calendar__week-day";
    if (isActive) dayCls += " calendar__week-day--active";

    const dotsHtml = events
      .slice(0, 3)
      .map((ev) => `<span class="calendar__week-day-dot" style="background:${ev.color}"></span>`)
      .join("");

    html += `
      <div class="${dayCls}" data-day="${key}">
        <span class="calendar__week-day-name">${WEEKDAYS_SHORT[dow]}</span>
        <span class="calendar__week-day-num${isToday ? " calendar__week-day-num--today" : ""}">${d.getDate()}</span>
        <div class="calendar__week-day-dots">${dotsHtml}</div>
      </div>`;
  });

  html += `</div>`;

  html += `<div class="calendar__day-detail">`;

  if (selectedDay) {
    const sd = new Date(selectedDay);
    const dayNum = sd.getDate();
    const monthIdx = sd.getMonth();
    html += `<div class="calendar__day-label">${dayNum} ${MONTHS_GEN[monthIdx]}</div>`;

    const events = eventMap[selectedDay] || [];
    if (events.length !== 0) {
      events.forEach((ev) => {
        html += `
              <div class="calendar__event-row" style="background:${ev.color}">
                <span class="calendar__event-row-title">${ev.title}</span>
                <span class="calendar__event-row-time">${ev.time} мин.</span>
              </div>`;
      });
    }
  }

  html += `</div>`;
  container.innerHTML = html;

  const $weekDays = container.querySelectorAll(".calendar__week-day");
  $weekDays.forEach(($weekDay) => {
    $weekDay.addEventListener("click", () => {
      state.selectedDay = $weekDay.dataset.day;
      renderMobile(container, year, month, weekOffset, eventMap, $weekDay.dataset.day, state);
    });
  });
}

// Utils
function dateKey(y, m, d) {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function dayOfWeek(date) {
  return (date.getDay() + 6) % 7;
}

function today() {
  const d = new Date();
  return dateKey(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

function buildEventMap(config) {
  const map = {};
  config.forEach((ev) => {
    if (!map[ev.date]) map[ev.date] = [];
    map[ev.date].push(ev);
  });
  return map;
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getInitialWeekOffset(year, month, day) {
  const firstOfMonth = new Date(year, month - 1, 1);
  const dow0 = dayOfWeek(firstOfMonth);
  const dayIndex = dow0 + day - 1;
  return Math.floor(dayIndex / 7);
}

function buildDonutConfig(config, year, month) {
  const filtered = config.filter((ev) => {
    const d = new Date(ev.date);
    return d.getFullYear() === year && d.getMonth() + 1 === month;
  });

  const groups = {};
  filtered.forEach((ev) => {
    const key = ev.title;
    if (!groups[key]) groups[key] = { label: ev.title, color: ev.color, count: 0 };
    groups[key].count++;
  });

  const total = filtered.length;
  if (total === 0) return [];

  return Object.values(groups).map((g) => ({
    label: g.label,
    color: g.color,
    value: Math.round((g.count / total) * 100),
  }));
}
