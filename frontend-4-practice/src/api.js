async function getJSON(url, signal) {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    let message = `Ошибка сервера (${response.status})`;
    try { const data = await response.json(); message = data.error || message; } catch { /* Не JSON */ }
    throw new Error(message);
  }
  return response.json();
}

export function fetchToday(signal) {
  return getJSON('/api/booking/today', signal);
}

export function fetchSlots(date, signal) {
  const params = new URLSearchParams({ day: date.day, month: date.month, year: date.year });
  return getJSON(`/api/slots?${params}`, signal);
}
