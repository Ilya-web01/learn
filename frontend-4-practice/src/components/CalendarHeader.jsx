import { MONTHS_NOMINATIVE } from '../data/date.js';
export default function CalendarHeader({ currentMonth, currentYear, previousDisabled, onChangeMonth }) {
  return <div className="calendar__heading">
    <h2 className="panel__title" id="calendar-title">{MONTHS_NOMINATIVE[currentMonth]} {currentYear}</h2>
    <div className="calendar__navigation" aria-label="Переключение месяцев">
      <button className="calendar__arrow" type="button" aria-label="Предыдущий месяц" disabled={previousDisabled} onClick={() => onChangeMonth(-1)}>‹</button>
      <button className="calendar__arrow" type="button" aria-label="Следующий месяц" onClick={() => onChangeMonth(1)}>›</button>
    </div>
  </div>;
}
