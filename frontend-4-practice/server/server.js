import { getToday, getSlotsForDate } from './database.js';

const DELAY_MS = 650; // Искусственная задержка для демонстрации загрузки.

function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

export default function mockBookingServer() {
  return {
    name: 'mock-booking-api',
    configureServer(server) {
      server.middlewares.use('/api', async (req, res, next) => {
        const url = new URL(req.url ?? '/', 'http://localhost');
        if (req.method !== 'GET') return json(res, 405, { error: 'Метод не поддерживается' });
        if (url.pathname !== '/booking/today' && url.pathname !== '/slots') return next();
        await new Promise(resolve => setTimeout(resolve, DELAY_MS));
        // Для проверки ошибки откройте /api/slots?day=...&month=...&year=...&fail=1
        if (url.searchParams.get('fail') === '1') return json(res, 500, { error: 'Ошибка сервера (тест)' });
        if (url.pathname === '/booking/today') return json(res, 200, getToday());
        const day = Number(url.searchParams.get('day'));
        const month = Number(url.searchParams.get('month'));
        const year = Number(url.searchParams.get('year'));
        const valid = url.searchParams.has('day') && url.searchParams.has('month') && url.searchParams.has('year') &&
          Number.isInteger(day) && Number.isInteger(month) && Number.isInteger(year) &&
          year >= 2000 && year <= 2100 && month >= 0 && month <= 11 && day >= 1 &&
          new Date(year, month, day).getFullYear() === year &&
          new Date(year, month, day).getMonth() === month &&
          new Date(year, month, day).getDate() === day;
        if (!valid) return json(res, 400, { error: 'Некорректная дата' });
        return json(res, 200, { date: { day, month, year }, slots: getSlotsForDate(day, month, year) });
      });
    }
  };
}
