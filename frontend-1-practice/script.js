// Небольшая интерактивность для демонстрации выбора даты и времени.
const dayButtons = document.querySelectorAll('.calendar__day');
const timeButtons = document.querySelectorAll('.slots__time:not(:disabled)');
const dateTitle = document.querySelector('.slots__date');
const status = document.querySelector('#selection-status');
const nextButton = document.querySelector('#next-button');
const weekdays = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
let selectedDay = 18;
let selectedTime = null;

function updateStatus() {
  status.textContent = `Дата: ${selectedDay} июня · ${selectedTime ? `Время: ${selectedTime}` : 'Выберите время'}`;
  nextButton.disabled = !selectedTime;
}

dayButtons.forEach(button => {
  button.setAttribute('aria-pressed', String(Number(button.dataset.day) === selectedDay));
  button.addEventListener('click', () => {
    selectedDay = Number(button.dataset.day);
    dayButtons.forEach(day => {
      const active = day === button;
      day.classList.toggle('calendar__day--selected', active);
      day.setAttribute('aria-pressed', String(active));
    });
    const weekday = weekdays[new Date(2026, 5, selectedDay).getDay()];
    dateTitle.textContent = `${weekday}, ${selectedDay} июня`;
    selectedTime = null;
    timeButtons.forEach(time => {
      time.classList.remove('slots__time--selected');
      time.setAttribute('aria-pressed', 'false');
    });
    updateStatus();
  });
});

timeButtons.forEach(button => {
  button.setAttribute('aria-pressed', 'false');
  button.addEventListener('click', () => {
    selectedTime = button.textContent.trim();
    timeButtons.forEach(time => {
      const active = time === button;
      time.classList.toggle('slots__time--selected', active);
      time.setAttribute('aria-pressed', String(active));
    });
    updateStatus();
  });
});

nextButton.addEventListener('click', () => {
  if (selectedTime) alert(`Вы выбрали ${selectedDay} июня 2026 года, ${selectedTime}.\nЭто демонстрационная страница.`);
});
