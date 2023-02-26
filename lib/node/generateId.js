import tokenClient from './tokenClient';

export function getUTCTimeNumber(date = new Date()) {
  return date
    .toISOString()
    .replace(/[^0-9]/g, '')
    .slice(0, 14);
}

export function generateId(prefix, timestamp = Date.now()) {
  return `${prefix}${getUTCTimeNumber(
    new Date(timestamp)
  )}_${tokenClient.shortId()}`;
}
