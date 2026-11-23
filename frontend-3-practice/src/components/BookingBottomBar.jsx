import { formatDate } from '../data/date.js';
export default function BookingBottomBar({ selectedDay, currentMonth, currentYear, selectedTime, onNext }) {
  return <footer className="booking__footer">
    <p className="booking__selection" aria-live="polite">{formatDate(selectedDay, currentMonth, currentYear)} • {selectedTime || 'Выберите время'}</p>
    <button className="booking__next" type="button" disabled={!selectedTime} onClick={onNext}>ДАЛЕЕ <span aria-hidden="true">→</span></button>
  </footer>;
}
