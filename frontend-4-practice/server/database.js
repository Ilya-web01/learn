// Имитационная база данных. Сегодня берётся из даты сервера при каждом запросе.
// Для воспроизводимого сценария можно заменить getToday на фиксированную дату.
const TIMES = ['10:00', '11:30', '13:00', '14:30', '16:00', '17:30', '19:00', '20:00'];

export function getToday() {
  const now = new Date();
  return { day: now.getDate(), month: now.getMonth(), year: now.getFullYear() };
}

// Два набора слотов: будни и выходные. Время и правила занятости из практики №3.
export const weekdaySlots = TIMES.map((time, index) => ({ time, available: index !== 2 && index !== 7 }));
export const weekendSlots = TIMES.map((time, index) => ({ time, available: index !== 0 && index !== 5 }));

export function getSlotsForDate(day, month, year) {
  const isWeekend = [0, 6].includes(new Date(year, month, day).getDay());
  const template = isWeekend ? weekendSlots : weekdaySlots;
  // Сохраняем прежнее правило занятости, чтобы слоты различались по датам.
  return template.map(({ time, available }, index) => ({
    time,
    available: available && !((day + month + year + index * 3) % 7 === 0 || (day + index) % 11 === 0)
  }));
}
