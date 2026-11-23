import { buildCalendarGrid, isDateSelectable, MONTHS_GENITIVE } from '../data/date.js';

export default function CalendarGrid({ currentYear, currentMonth, selectedDay, today, onDayClick }) {
  const weeks = buildCalendarGrid(currentYear, currentMonth);
  return <div className="calendar__days" role="group" aria-label={`Даты: ${MONTHS_GENITIVE[currentMonth]} ${currentYear}`}>
    {weeks.map((week, weekIndex) => week.map((day, dayIndex) => {
      if (day === null) return <span key={`empty-${weekIndex}-${dayIndex}`} className="calendar__day--empty" aria-hidden="true" />;
      const enabled = isDateSelectable(day, currentMonth, currentYear, today);
      const selected = day === selectedDay;
      const classes = ['calendar__day', !enabled && 'calendar__day--disabled', selected && 'calendar__day--selected'].filter(Boolean).join(' ');
      return <button key={`${currentYear}-${currentMonth}-${day}`} type="button" className={classes} disabled={!enabled} aria-pressed={selected} onClick={() => onDayClick(day)}>{day}</button>;
    }))}
  </div>;
}
