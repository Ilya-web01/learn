import { formatDate } from '../data/date.js';

export default function TimeSlots({ selectedDay, currentMonth, currentYear, slots, selectedTime, onTimeClick, loading, error, onRetry }) {
  return <section className="panel slots" aria-labelledby="slots-title">
    <h2 className="panel__title slots__date" id="slots-title">{formatDate(selectedDay, currentMonth, currentYear)}</h2>
    <p className="slots__caption">Доступное время</p>
    {loading ? <p className="slots__message" role="status">Загрузка слотов…</p> :
      error ? <div className="slots__message slots__message--error" role="alert">
        Не удалось загрузить время: {error}
        <button type="button" className="status-panel__retry" onClick={onRetry}>Повторить</button>
      </div> : <>
        <div className="slots__grid" role="group" aria-label="Время записи">
          {slots.map(slot => <button key={slot.time} type="button" className={['slots__time', !slot.available && 'slots__time--busy', selectedTime === slot.time && 'slots__time--selected'].filter(Boolean).join(' ')} disabled={!slot.available} title={!slot.available ? 'Время занято' : undefined} aria-pressed={selectedTime === slot.time} onClick={() => onTimeClick(slot.time)}>{slot.time}{!slot.available && <span className="slots__busy-label">занято</span>}</button>)}
        </div>
        <p className="slots__note">Занятые слоты отмечены серым цветом.</p>
      </>}
  </section>;
}
