export const MONTHS_NOMINATIVE = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
export const MONTHS_GENITIVE = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
export const DAYS_OF_WEEK = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

export function compareDates(a, b) {
  const first = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const second = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return Math.sign(first - second);
}

export function isDateSelectable(day, month, year, today) {
  return compareDates(new Date(year, month, day), today) >= 0;
}

export function buildCalendarGrid(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  const cells = Array(firstWeekday).fill(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export function formatDate(day, month, year) {
  const date = new Date(year, month, day);
  return `${DAYS_OF_WEEK[date.getDay()]}, ${day} ${MONTHS_GENITIVE[month]} ${year}`;
}
