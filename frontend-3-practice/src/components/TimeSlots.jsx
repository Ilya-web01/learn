import { formatDate } from '../data/date.js';
export default function TimeSlots({ selectedDay, currentMonth, currentYear, slots, selectedTime, onTimeClick }) {
  return <section className="panel slots" aria-labelledby="slots-title">
    <h2 className="panel__title slots__date" id="slots-title">{formatDate(selectedDay, currentMonth, currentYear)}</h2>
    <p className="slots__caption">Доступное время</p>
    <div className="slots__grid" role="group" aria-label="Время записи">
      {slots.map(slot => <button key={slot.time} type="button" className={['slots__time', slot.busy && 'slots__time--busy', selectedTime === slot.time && 'slots__time--selected'].filter(Boolean).join(' ')} disabled={slot.busy} title={slot.busy ? 'Время занято' : undefined} aria-pressed={selectedTime === slot.time} onClick={() => onTimeClick(slot.time)}>{slot.time}{slot.busy && <span className="slots__busy-label">занято</span>}</button>)}
    </div>
    <p className="slots__note">Занятые слоты отмечены серым цветом.</p>
  </section>;
}
