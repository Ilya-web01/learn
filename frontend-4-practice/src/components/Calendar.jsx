import CalendarHeader from './CalendarHeader.jsx';
import CalendarGrid from './CalendarGrid.jsx';
export default function Calendar(props) {
  return <section className="panel calendar" aria-labelledby="calendar-title">
    <CalendarHeader currentMonth={props.currentMonth} currentYear={props.currentYear} previousDisabled={props.previousDisabled} onChangeMonth={props.onChangeMonth} />
    <div className="calendar__weekdays" aria-hidden="true">
      {['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'].map(day => <span key={day}>{day}</span>)}
    </div>
    <CalendarGrid {...props} />
  </section>;
}
