import { format } from 'date-fns';

export function formatDateTime(date) {
  return format(date, 'yyyy-MM-dd HH:mm:ss');
}

export function formatDate(date) {
  return format(date, 'yyyy-MM-dd');
}

export function formatDateWeekTime(date) {
  return  format(date, 'yyyy-MM-dd eee HH:mm:ss');
}

export function formatDateWeek(date) {
  return  format(date, 'yyyy-MM-dd eee');
}

export function formatTime(date) {
  return  format(date, ' HH:mm:ss');
}
