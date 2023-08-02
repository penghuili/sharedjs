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
