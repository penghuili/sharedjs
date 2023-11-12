export function getUTCTimeNumber(date = new Date()) {
  return date
    .toISOString()
    .replace(/[^0-9]/g, '')
    .slice(0, 14);
}
