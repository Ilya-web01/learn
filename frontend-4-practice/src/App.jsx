import { useEffect, useState } from 'react';
import SiteHeader from './components/SiteHeader.jsx';
import Calendar from './components/Calendar.jsx';
import TimeSlots from './components/TimeSlots.jsx';
import BookingBottomBar from './components/BookingBottomBar.jsx';
import { compareDates, formatDate } from './data/date.js';
import { fetchToday, fetchSlots } from './api.js';

export default function App() {
  const [today, setToday] = useState(null);
  const [todayLoading, setTodayLoading] = useState(true);
  const [todayError, setTodayError] = useState(null);
  const [retryToday, setRetryToday] = useState(0);

  const [currentMonth, setCurrentMonth] = useState(null);
  const [currentYear, setCurrentYear] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState(null);
  const [retrySlots, setRetrySlots] = useState(0);

  // При загрузке приложения запрашиваем серверную дату. AbortController защищает
  // от устаревших результатов, в том числе при StrictMode в режиме разработки.
  useEffect(() => {
    const controller = new AbortController();
    setTodayLoading(true);
    setTodayError(null);
    fetchToday(controller.signal)
      .then(date => {
        if (controller.signal.aborted) return;
        setToday(date);
        setCurrentMonth(date.month);
        setCurrentYear(date.year);
        setSelectedDay(date.day);
      })
      .catch(error => { if (!controller.signal.aborted) setTodayError(error.message); })
      .finally(() => { if (!controller.signal.aborted) setTodayLoading(false); });
    return () => controller.abort();
  }, [retryToday]);

  // Один запрос при выборе даты. Старые запросы отменяются при быстром переключении.
  useEffect(() => {
    if (!today || selectedDay === null || currentMonth === null || currentYear === null) return;
    const controller = new AbortController();
    const date = { day: selectedDay, month: currentMonth, year: currentYear };
    setSlotsLoading(true);
    setSlotsError(null);
    setSlots([]);
    fetchSlots(date, controller.signal)
      .then(result => {
        if (controller.signal.aborted) return;
        if (result.date.day !== date.day || result.date.month !== date.month || result.date.year !== date.year) return;
        setSlots(result.slots);
      })
      .catch(error => { if (!controller.signal.aborted) setSlotsError(error.message); })
      .finally(() => { if (!controller.signal.aborted) setSlotsLoading(false); });
    return () => controller.abort();
  }, [today, selectedDay, currentMonth, currentYear, retrySlots]);

  function handleDayClick(day) {
    if (day === selectedDay) return;
    setSelectedDay(day);
    setSelectedTime(null);
  }

  function handleMonthChange(delta) {
    const next = new Date(currentYear, currentMonth + delta, 1);
    const minMonth = new Date(today.year, today.month, 1);
    if (compareDates(next, minMonth) < 0) return;
    const day = next.getMonth() === today.month && next.getFullYear() === today.year ? today.day : 1;
    setCurrentMonth(next.getMonth());
    setCurrentYear(next.getFullYear());
    setSelectedDay(day);
    setSelectedTime(null);
  }

  function handleNext() {
    if (!selectedTime || slotsLoading || slotsError) return;
    window.alert(`Вы выбрали: ${formatDate(selectedDay, currentMonth, currentYear)} • ${selectedTime}.\nЭто демонстрационная страница.`);
  }

  const ready = !todayLoading && !todayError && today !== null;
  const previousDisabled = ready && compareDates(
    new Date(currentYear, currentMonth, 1), new Date(today.year, today.month, 1)
  ) <= 0;
  const todayDate = ready ? new Date(today.year, today.month, today.day) : null;

  return <div className="page__shell">
    <SiteHeader />
    <main className="booking" id="main">
      <div className="booking__intro">
        <p className="booking__eyebrow">ОНЛАЙН-ЗАПИСЬ</p>
        <h1 className="booking__title">Выберите дату и время</h1>
        <p className="booking__description">Выберите удобный день и свободное время для визита.</p>
      </div>
      {todayLoading && <div className="panel status-panel" role="status">Загрузка…</div>}
      {todayError && <div className="panel status-panel status-panel--error" role="alert">
        Не удалось загрузить календарь: {todayError}
        <button type="button" className="status-panel__retry" onClick={() => setRetryToday(value => value + 1)}>Повторить</button>
      </div>}
      {ready && <>
        <div className="booking__layout">
          <Calendar currentMonth={currentMonth} currentYear={currentYear} selectedDay={selectedDay} today={todayDate} previousDisabled={previousDisabled} onDayClick={handleDayClick} onChangeMonth={handleMonthChange} />
          <TimeSlots selectedDay={selectedDay} currentMonth={currentMonth} currentYear={currentYear} slots={slots} selectedTime={selectedTime} onTimeClick={setSelectedTime} loading={slotsLoading} error={slotsError} onRetry={() => setRetrySlots(value => value + 1)} />
        </div>
        <BookingBottomBar selectedDay={selectedDay} currentMonth={currentMonth} currentYear={currentYear} selectedTime={selectedTime} onNext={handleNext} disabled={slotsLoading || Boolean(slotsError)} />
      </>}
    </main>
    <footer className="site-footer">Nurth Cut · Онлайн-запись</footer>
  </div>;
}
