import { useState } from 'react';
import SiteHeader from './components/SiteHeader.jsx';
import Calendar from './components/Calendar.jsx';
import TimeSlots from './components/TimeSlots.jsx';
import BookingBottomBar from './components/BookingBottomBar.jsx';
import { compareDates, formatDate } from './data/date.js';
import { getSlots } from './data/slots.js';

export default function App() {
  // Начальное значение вычисляется при загрузке страницы.
  const [today] = useState(() => new Date());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [selectedTime, setSelectedTime] = useState(null);
  const [slots, setSlots] = useState(() => getSlots(today.getDate(), today.getMonth(), today.getFullYear()));

  function handleDayClick(day) {
    setSelectedDay(day);
    setSelectedTime(null);
    setSlots(getSlots(day, currentMonth, currentYear));
  }

  function handleMonthChange(delta) {
    const next = new Date(currentYear, currentMonth + delta, 1);
    const currentStart = new Date(today.getFullYear(), today.getMonth(), 1);
    if (compareDates(next, currentStart) < 0) return;
    const day = next.getMonth() === today.getMonth() && next.getFullYear() === today.getFullYear() ? today.getDate() : 1;
    setCurrentMonth(next.getMonth());
    setCurrentYear(next.getFullYear());
    setSelectedDay(day);
    setSelectedTime(null);
    setSlots(getSlots(day, next.getMonth(), next.getFullYear()));
  }

  function handleNext() {
    if (!selectedTime) return;
    window.alert(`Вы выбрали: ${formatDate(selectedDay, currentMonth, currentYear)} • ${selectedTime}.\nЭто демонстрационная страница.`);
  }

  const previousDisabled = compareDates(new Date(currentYear, currentMonth, 1), new Date(today.getFullYear(), today.getMonth(), 1)) <= 0;
  return <div className="page__shell">
    <SiteHeader />
    <main className="booking" id="main">
      <div className="booking__intro">
        <p className="booking__eyebrow">ОНЛАЙН-ЗАПИСЬ</p>
        <h1 className="booking__title">Выберите дату и время</h1>
        <p className="booking__description">Выберите удобный день и свободное время для визита.</p>
      </div>
      <div className="booking__layout">
        <Calendar currentMonth={currentMonth} currentYear={currentYear} selectedDay={selectedDay} today={today} previousDisabled={previousDisabled} onDayClick={handleDayClick} onChangeMonth={handleMonthChange} />
        <TimeSlots selectedDay={selectedDay} currentMonth={currentMonth} currentYear={currentYear} slots={slots} selectedTime={selectedTime} onTimeClick={setSelectedTime} />
      </div>
      <BookingBottomBar selectedDay={selectedDay} currentMonth={currentMonth} currentYear={currentYear} selectedTime={selectedTime} onNext={handleNext} />
    </main>
    <footer className="site-footer">NORTH CUT · Онлайн-запись</footer>
  </div>;
}
