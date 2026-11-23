const TIMES = ['10:00', '11:30', '13:00', '14:30', '16:00', '17:30', '19:00', '20:00'];

// Те же демонстрационные данные и правило занятости, что в практике №2.
export function getSlots(day, month, year) {
  return TIMES.map((time, index) => ({
    time,
    busy: (day + month + year + index * 3) % 7 === 0 || (day + index) % 11 === 0
  }));
}
