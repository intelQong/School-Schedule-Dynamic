/* ============================================
   Class Routine — Dynamic Schedule App
   ============================================ */

// ---- Schedule Data ----
const SCHEDULE_DATA = [
  {
    day: "Sunday",
    periods: [
      { period: 1, time: "8:00 - 8:40", className: null },
      { period: 2, time: "8:40 - 9:15", className: "II Rosemary" },
      { period: 3, time: "9:15 - 9:50", className: "Play" },
      { period: 4, time: "9:50 - 10:25", className: "III Salvia" },
      { period: 5, time: "10:40 - 11:15", className: "I Bela" },
      { period: 6, time: "11:15 - 11:50", className: "V" },
      { period: 7, time: "11:50 - 12:25", className: null },
      { period: 8, time: "12:25 - 1:00", className: null }
    ]
  },
  {
    day: "Monday",
    periods: [
      { period: 1, time: "8:00 - 8:40", className: null },
      { period: 2, time: "8:40 - 9:15", className: "Nursery Rose" },
      { period: 3, time: "9:15 - 9:50", className: "II Marigold" },
      { period: 4, time: "9:50 - 10:25", className: "I Camellia" },
      { period: 5, time: "10:40 - 11:15", className: "Nursery Rose" },
      { period: 6, time: "11:15 - 11:50", className: "IV Orchid" },
      { period: 7, time: "11:50 - 12:25", className: null },
      { period: 8, time: "12:25 - 1:00", className: null }
    ]
  },
  {
    day: "Tuesday",
    periods: [
      { period: 1, time: "8:00 - 8:40", className: null },
      { period: 2, time: "8:40 - 9:15", className: "I Bakul" },
      { period: 3, time: "9:15 - 9:50", className: "IV Orchid" },
      { period: 4, time: "9:50 - 10:25", className: "KG Jasmine" },
      { period: 5, time: "10:40 - 11:15", className: null },
      { period: 6, time: "11:15 - 11:50", className: "Play" },
      { period: 7, time: "11:50 - 12:25", className: null },
      { period: 8, time: "12:25 - 1:00", className: "II Camellia" }
    ]
  },
  {
    day: "Wednesday",
    periods: [
      { period: 1, time: "8:00 - 8:40", className: null },
      { period: 2, time: "8:40 - 9:15", className: "IV Aster" },
      { period: 3, time: "9:15 - 9:50", className: "Nursery Primrose" },
      { period: 4, time: "9:50 - 10:25", className: "KG Daisy" },
      { period: 5, time: "10:40 - 11:15", className: null },
      { period: 6, time: "11:15 - 11:50", className: "V" },
      { period: 7, time: "11:50 - 12:25", className: "K.G. Daisy" },
      { period: 8, time: "12:25 - 1:00", className: null }
    ]
  },
  {
    day: "Thursday",
    periods: [
      { period: 1, time: "8:00 - 8:40", className: null },
      { period: 2, time: "8:40 - 9:15", className: null },
      { period: 3, time: "9:15 - 9:50", className: "Nursery Tuba Rose" },
      { period: 4, time: "9:50 - 10:25", className: "II Rosemary" },
      { period: 5, time: "10:40 - 11:15", className: "II Marigold" },
      { period: 6, time: "11:15 - 11:50", className: "IV Aster" },
      { period: 7, time: "11:50 - 12:25", className: null },
      { period: 8, time: "12:25 - 1:00", className: "III Salvia" }
    ]
  }
];

// Period time boundaries in 24h (for "today" highlighting)
const PERIOD_TIMES = [
  { start: [8, 0],  end: [8, 40] },
  { start: [8, 40], end: [9, 15] },
  { start: [9, 15], end: [9, 50] },
  { start: [9, 50], end: [10, 25] },
  { start: [10, 40], end: [11, 15] },
  { start: [11, 15], end: [11, 50] },
  { start: [11, 50], end: [12, 25] },
  { start: [12, 25], end: [13, 0] }
];

// Color accents per grade/section
const ACCENT_COLORS = {
  'Nursery':  '#ec4899',
  'KG':       '#f59e0b',
  'K.G.':     '#f59e0b',
  'I ':       '#38bdf8',
  'II ':      '#8b5cf6',
  'III':      '#14b8a6',
  'IV ':      '#6366f1',
  'V':        '#f43f5e',
  'Play':     '#14b8a6',
};

function getAccentColor(className) {
  if (!className) return null;
  for (const [key, color] of Object.entries(ACCENT_COLORS)) {
    if (className.startsWith(key)) return color;
  }
  return '#8b5cf6';
}

// ---- Day Mapping ----
const JS_DAY_MAP = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday'
};

// ---- State ----
let selectedDay = null;

// ---- Helpers ----
function getOrdinalSuffix(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function formatDate(date) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

function formatTime(date) {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

function minutesOfDay(h, m) {
  return h * 60 + m;
}

function getCurrentPeriodIndex() {
  const now = new Date();
  const nowMin = minutesOfDay(now.getHours(), now.getMinutes());
  for (let i = 0; i < PERIOD_TIMES.length; i++) {
    const start = minutesOfDay(PERIOD_TIMES[i].start[0], PERIOD_TIMES[i].start[1]);
    const end = minutesOfDay(PERIOD_TIMES[i].end[0], PERIOD_TIMES[i].end[1]);
    if (nowMin >= start && nowMin < end) return i;
  }
  return -1;
}

function getTodayName() {
  return JS_DAY_MAP[new Date().getDay()];
}

function isToday(dayName) {
  return dayName === getTodayName();
}

function getDaySchedule(dayName) {
  return SCHEDULE_DATA.find(d => d.day === dayName);
}

// ---- Notifications ----
const NOTIFY_BEFORE_MINUTES = 5;

function getNotifiedPeriods() {
  try {
    const stored = localStorage.getItem('notified-periods');
    if (stored) {
      const data = JSON.parse(stored);
      if (data.date === getTodayName()) return new Set(data.periods);
    }
  } catch (e) {}
  return new Set();
}

function markNotified(periodIndex) {
  const periods = [...getNotifiedPeriods(), periodIndex];
  localStorage.setItem('notified-periods', JSON.stringify({ date: getTodayName(), periods }));
}

function requestNotificationPermission() {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'default') Notification.requestPermission();
}

function getNextClassInfo() {
  const todayName = getTodayName();
  const schedule = getDaySchedule(todayName);
  if (!schedule) return null;
  const nowMin = minutesOfDay(new Date().getHours(), new Date().getMinutes());

  for (let i = 0; i < schedule.periods.length; i++) {
    const p = schedule.periods[i];
    if (!p.className) continue;
    const start = minutesOfDay(PERIOD_TIMES[i].start[0], PERIOD_TIMES[i].start[1]);
    const end = minutesOfDay(PERIOD_TIMES[i].end[0], PERIOD_TIMES[i].end[1]);
    if (nowMin >= end) continue;
    if (nowMin >= start && nowMin < end) continue;
    const diff = start - nowMin;
    if (diff > 0 && diff <= NOTIFY_BEFORE_MINUTES) return { period: p, index: i };
  }
  return null;
}

function checkUpcomingClass() {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const next = getNextClassInfo();
  if (!next) return;
  const notified = getNotifiedPeriods();
  if (notified.has(next.index)) return;
  const s = PERIOD_TIMES[next.index].start;
  const timeStr = `${s[0]}:${String(s[1]).padStart(2, '0')}`;
  const body = `${next.period.className} at ${timeStr}`;
  new Notification('📚 Upcoming Class', { body, icon: '/icons/icon-192.png', tag: `class-${getTodayName()}-${next.index}` });
  markNotified(next.index);
}

// ---- Render Clock ----
function updateClock() {
  const clockEl = document.getElementById('clock-time');
  const dateEl = document.getElementById('current-date-display');
  const now = new Date();
  clockEl.textContent = formatTime(now);
  dateEl.textContent = formatDate(now);
}

// ---- Render Status Badge ----
function updateStatus() {
  const statusEl = document.getElementById('current-status');
  const todayName = getTodayName();
  const schedule = getDaySchedule(todayName);

  if (!schedule) {
    statusEl.textContent = 'Day Off';
    statusEl.className = 'current-status off-hours';
    return;
  }

  const periodIdx = getCurrentPeriodIndex();
  if (periodIdx === -1) {
    const now = new Date();
    const nowMin = minutesOfDay(now.getHours(), now.getMinutes());
    const schoolStart = minutesOfDay(8, 0);
    const schoolEnd = minutesOfDay(13, 0);
    if (nowMin < schoolStart) {
      statusEl.textContent = 'Before School';
    } else if (nowMin >= schoolEnd) {
      statusEl.textContent = 'School Over';
    } else {
      statusEl.textContent = 'Break';
    }
    statusEl.className = 'current-status off-hours';
    return;
  }

  const period = schedule.periods[periodIdx];
  if (period && period.className) {
    statusEl.textContent = `📍 ${period.className}`;
    statusEl.className = 'current-status in-class';
  } else {
    statusEl.textContent = 'Free Period';
    statusEl.className = 'current-status break-time';
  }
}

// ---- Render Day Tabs ----
function renderDayTabs() {
  const container = document.getElementById('day-tabs');
  container.innerHTML = '';
  const todayName = getTodayName();

  SCHEDULE_DATA.forEach(dayData => {
    const btn = document.createElement('button');
    btn.className = 'day-tab';
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', dayData.day === selectedDay);
    btn.id = `tab-${dayData.day.toLowerCase()}`;
    btn.textContent = dayData.day.slice(0, 3);
    btn.setAttribute('title', dayData.day);

    if (dayData.day === selectedDay) btn.classList.add('active');
    if (isToday(dayData.day)) btn.classList.add('today');

    btn.addEventListener('click', () => {
      selectedDay = dayData.day;
      renderAll();
    });
    container.appendChild(btn);
  });
}

// ---- Render Stats ----
function renderStats() {
  const schedule = getDaySchedule(selectedDay);
  if (!schedule) return;

  const filled = schedule.periods.filter(p => p.className);
  const total = filled.length;

  let completed = 0;
  let remaining = total;
  let nextClass = '—';

  if (isToday(selectedDay)) {
    const now = new Date();
    const nowMin = minutesOfDay(now.getHours(), now.getMinutes());

    schedule.periods.forEach((p, i) => {
      if (!p.className) return;
      const end = minutesOfDay(PERIOD_TIMES[i].end[0], PERIOD_TIMES[i].end[1]);
      if (nowMin >= end) completed++;
    });
    remaining = total - completed;

    // Find next class
    for (let i = 0; i < schedule.periods.length; i++) {
      const p = schedule.periods[i];
      if (!p.className) continue;
      const start = minutesOfDay(PERIOD_TIMES[i].start[0], PERIOD_TIMES[i].start[1]);
      if (nowMin < start) {
        nextClass = p.className;
        break;
      }
      // If currently in this period, next is the next filled one
      const end = minutesOfDay(PERIOD_TIMES[i].end[0], PERIOD_TIMES[i].end[1]);
      if (nowMin >= start && nowMin < end) {
        // find next filled after this
        for (let j = i + 1; j < schedule.periods.length; j++) {
          if (schedule.periods[j].className) {
            nextClass = schedule.periods[j].className;
            break;
          }
        }
        break;
      }
    }
  }

  document.querySelector('#stat-total .stat-value').textContent = total;
  document.querySelector('#stat-completed .stat-value').textContent = completed;
  document.querySelector('#stat-remaining .stat-value').textContent = remaining;
  document.querySelector('#stat-next .stat-value').textContent = nextClass;
}

// ---- Render Schedule Cards ----
function renderSchedule() {
  const container = document.getElementById('schedule-grid');
  container.innerHTML = '';
  const schedule = getDaySchedule(selectedDay);
  if (!schedule) return;

  const isTodayView = isToday(selectedDay);
  const currentPeriod = isTodayView ? getCurrentPeriodIndex() : -1;
  const now = new Date();
  const nowMin = minutesOfDay(now.getHours(), now.getMinutes());

  schedule.periods.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'period-card';
    card.style.animationDelay = `${i * 0.06}s`;

    const accentColor = getAccentColor(p.className);
    if (accentColor) card.style.setProperty('--card-accent', accentColor);

    const isEmpty = !p.className;
    const isActive = isTodayView && i === currentPeriod;
    const isCompleted = isTodayView && !isEmpty &&
      nowMin >= minutesOfDay(PERIOD_TIMES[i].end[0], PERIOD_TIMES[i].end[1]);
    const isPlay = p.className && p.className.toLowerCase() === 'play';

    if (isEmpty) card.classList.add('empty');
    if (isActive) card.classList.add('active-now');
    if (isCompleted) card.classList.add('completed');
    if (isPlay) card.classList.add('play-card');

    // Extract class type info
    let gradeLabel = '';
    if (p.className && !isPlay) {
      const match = p.className.match(/^(Nursery|K\.?G\.?|[IV]+)\s*(.*)/i);
      if (match) {
        gradeLabel = match[1];
      }
    }

    card.innerHTML = `
      <div class="period-header">
        <span class="period-number">${getOrdinalSuffix(p.period)} Period</span>
        <span class="period-time">${p.time}</span>
      </div>
      <div class="period-class-name">${isEmpty ? 'Free Period' : p.className}</div>
      ${!isEmpty && gradeLabel ? `<span class="period-class-type">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 4 3 6 3s6-1 6-3v-5"/>
        </svg>
        ${gradeLabel}
      </span>` : ''}
      ${isPlay ? `<span class="period-class-type">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><polygon points="10,8 16,12 10,16"/>
        </svg>
        Recreation
      </span>` : ''}
      ${isActive && !isEmpty ? '<div class="now-badge">Happening Now</div>' : ''}
    `;

    container.appendChild(card);
  });
}

// ---- Render Weekly Overview ----
function renderWeeklyOverview() {
  const container = document.getElementById('weekly-grid');
  container.innerHTML = '';
  const todayName = getTodayName();

  SCHEDULE_DATA.forEach(dayData => {
    const col = document.createElement('div');
    col.className = 'weekly-day-col';
    if (isToday(dayData.day)) col.classList.add('today-col');

    let slotsHtml = '';
    let filledCount = 0;

    dayData.periods.forEach(p => {
      const filled = !!p.className;
      if (filled) filledCount++;
      slotsHtml += `<div class="weekly-slot ${filled ? 'filled' : 'empty-slot'}">
        ${filled ? p.className : '—'}
      </div>`;
    });

    col.innerHTML = `
      <div class="weekly-day-name">${dayData.day.slice(0, 3)}</div>
      ${slotsHtml}
      <div class="weekly-class-count"><strong>${filledCount}</strong> classes</div>
    `;

    col.addEventListener('click', () => {
      selectedDay = dayData.day;
      renderAll();
      document.getElementById('schedule-section').scrollIntoView({ behavior: 'smooth' });
    });
    col.style.cursor = 'pointer';

    container.appendChild(col);
  });
}

// ---- Master Render ----
function renderAll() {
  renderDayTabs();
  renderStats();
  renderSchedule();
  renderWeeklyOverview();
}

// ---- Init ----
function init() {
  // Default to today if it's a school day, else Sunday
  const todayName = getTodayName();
  const hasToday = SCHEDULE_DATA.some(d => d.day === todayName);
  selectedDay = hasToday ? todayName : 'Sunday';

  updateClock();
  updateStatus();
  renderAll();
  requestNotificationPermission();

  // Live updates
  setInterval(() => {
    updateClock();
    updateStatus();
    // Re-render schedule every minute for active-now updates
  }, 1000);

  // Re-render schedule every 30s for period transitions
  setInterval(() => {
    if (isToday(selectedDay)) {
      renderStats();
      renderSchedule();
    }
    checkUpcomingClass();
  }, 30000);
}

document.addEventListener('DOMContentLoaded', init);
