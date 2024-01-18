import { format } from 'date-fns';

export function formatDateTime(date) {
  return format(date, 'yyyy-MM-dd HH:mm:ss');
}

export function formatDate(date) {
  return format(date, 'yyyy-MM-dd');
}

export function formatDateWeekTime(date) {
  return format(date, 'yyyy-MM-dd eee HH:mm:ss');
}

export function formatDateWeek(date) {
  return format(date, 'yyyy-MM-dd eee');
}

export function formatTime(date) {
  return format(date, ' HH:mm:ss');
}

export function getTimezoneOffset() {
  return new Date().getTimezoneOffset();
}

export function formatTimezoneDate(timestamp, timezoneOffset) {
  const data = getTimezoneData(timestamp, timezoneOffset);
  return `${data.year}-${data.month}-${data.day}`;
}

export function formatTimezoneDateTime(timestamp, timezoneOffset) {
  const data = getTimezoneData(timestamp, timezoneOffset);
  return `${data.year}-${data.month}-${data.day} ${data.hour}:${data.minute}:${data.second}`;
}

export function formatDays(days) {
  // Constants
  const daysPerYear = 365;
  const daysPerMonth = 30; // Approximation

  // Calculating years, months, and days
  const years = Math.floor(days / daysPerYear);
  const months = Math.floor((days % daysPerYear) / daysPerMonth);
  const remainingDays = days - years * daysPerYear - months * daysPerMonth;

  // Building the result string
  let result = '';
  if (years > 0) result += `${years} year${years > 1 ? 's' : ''} `;
  if (months > 0) result += `${months} month${months > 1 ? 's' : ''} `;
  if (remainingDays > 0) result += `${remainingDays} day${remainingDays > 1 ? 's' : ''}`;

  return result.trim();
}

function getTimezoneData(timestamp, timezoneOffset) {
  const offsetMilliseconds = timezoneOffset * 60000;
  const localDate = new Date(timestamp - offsetMilliseconds);
  const isoString = localDate.toISOString();

  const [datePart, timePart] = isoString.split('T');

  const [year, month, day] = datePart.split('-');

  const [hour, minute, secondsPart] = timePart.split(':');
  const second = secondsPart.split('.')[0];

  return {
    year,
    month,
    day,
    hour,
    minute,
    second,
  };
}
