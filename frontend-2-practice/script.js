// Практика 2: интерактивный календарь без библиотек.
const MONTHS_NOMINATIVE = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const MONTHS_GENITIVE = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const DAYS_OF_WEEK = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
const TIMES = ['10:00', '11:30', '13:00', '14:30', '16:00', '17:30', '19:00', '20:00'];

const state = {
  currentMonth: 0,
  currentYear: 0,
  selectedDay: null,
  selectedTime: null,
  slots: []
};

// Сравниваем только календарную дату, без времени.
function compareDates(a, b) {
  const first = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const second = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return Math.sign(first - second);
}

function isDateSelectable(day, month, year, today) {
  return compareDates(new Date(year, month, day), today) >= 0;
}

// Понедельник — первый день недели. Возвращаем массив недель по 7 ячеек.
function buildCalendarGrid(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  const cells = Array(firstWeekday).fill(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

function formatDate(day) {
  const date = new Date(state.currentYear, state.currentMonth, day);
  return `${DAYS_OF_WEEK[date.getDay()]}, ${day} ${MONTHS_GENITIVE[state.currentMonth]} ${state.currentYear}`;
}

// Для демонстрации занятость зависит от выбранной даты.
// В настоящем сервисе слоты приходили бы с сервера.
function getSlots(day, month, year) {
  return TIMES.map((time, index) => ({
    time,
    busy: (day + month + year + index * 3) % 7 === 0 || (day + index) % 11 === 0
  }));
}

function renderCalendar() {
  const title = document.querySelector('#calendar-title');
  const container = document.querySelector('#calendar-days');
  title.textContent = `${MONTHS_NOMINATIVE[state.currentMonth]} ${state.currentYear}`;
  container.setAttribute('aria-label', `Даты: ${MONTHS_GENITIVE[state.currentMonth]} ${state.currentYear}`);
  const today = new Date();
  const weeks = buildCalendarGrid(state.currentYear, state.currentMonth);
  container.innerHTML = weeks.flat().map(day => {
    if (day === null) return '<span class="calendar__day--empty" aria-hidden="true"></span>';
    const enabled = isDateSelectable(day, state.currentMonth, state.currentYear, today);
    const selected = day === state.selectedDay;
    const classes = ['calendar__day'];
    if (!enabled) classes.push('calendar__day--disabled');
    if (selected) classes.push('calendar__day--selected');
    return `<button type="button" class="${classes.join(' ')}" data-day="${day}" aria-pressed="${selected}" ${enabled ? '' : 'disabled'}>${day}</button>`;
  }).join('');
  container.querySelectorAll('button:not(:disabled)').forEach(button => {
    button.addEventListener('click', onDayClick);
  });
  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const visibleMonthStart = new Date(state.currentYear, state.currentMonth, 1);
  document.querySelector('#prev-month').disabled = compareDates(visibleMonthStart, currentMonthStart) <= 0;
}

function renderTimeSlots() {
  const container = document.querySelector('#time-slots');
  document.querySelector('#slots-title').textContent = formatDate(state.selectedDay);
  state.slots = getSlots(state.selectedDay, state.currentMonth, state.currentYear);
  container.innerHTML = state.slots.map(slot => {
    const selected = slot.time === state.selectedTime;
    const classes = ['slots__time'];
    if (slot.busy) classes.push('slots__time--busy');
    if (selected) classes.push('slots__time--selected');
    return `<button type="button" class="${classes.join(' ')}" data-time="${slot.time}" aria-pressed="${selected}" ${slot.busy ? 'disabled title="Время занято"' : ''}>${slot.time}${slot.busy ? '<span class="slots__busy-label">занято</span>' : ''}</button>`;
  }).join('');
  container.querySelectorAll('button:not(:disabled)').forEach(button => {
    button.addEventListener('click', onTimeSlotClick);
  });
}

function updateBottomBar() {
  const dateText = formatDate(state.selectedDay);
  document.querySelector('#selection-status').textContent = `${dateText} • ${state.selectedTime || 'Выберите время'}`;
  document.querySelector('#next-button').disabled = !state.selectedTime;
}

function onDayClick(event) {
  state.selectedDay = Number(event.currentTarget.dataset.day);
  state.selectedTime = null; // Выбранное ранее время больше не подходит.
  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
}

function onTimeSlotClick(event) {
  state.selectedTime = event.currentTarget.dataset.time;
  renderTimeSlots();
  updateBottomBar();
}

function setupMonthNavigation() {
  document.querySelector('#prev-month').addEventListener('click', () => changeMonth(-1));
  document.querySelector('#next-month').addEventListener('click', () => changeMonth(1));
}

function changeMonth(delta) {
  const month = new Date(state.currentYear, state.currentMonth + delta, 1);
  const today = new Date();
  const firstCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  if (compareDates(month, firstCurrentMonth) < 0) return;
  state.currentMonth = month.getMonth();
  state.currentYear = month.getFullYear();
  state.selectedDay = (state.currentMonth === today.getMonth() && state.currentYear === today.getFullYear()) ? today.getDate() : 1;
  state.selectedTime = null;
  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
}

function init() {
  const today = new Date();
  state.currentMonth = today.getMonth();
  state.currentYear = today.getFullYear();
  state.selectedDay = today.getDate();
  state.selectedTime = null;
  setupMonthNavigation();
  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
  document.querySelector('#next-button').addEventListener('click', () => {
    if (!state.selectedTime) return;
    alert(`Вы выбрали: ${formatDate(state.selectedDay)} • ${state.selectedTime}.\nЭто демонстрационная страница.`);
  });
}

document.addEventListener('DOMContentLoaded', init);
