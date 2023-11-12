import ShortId from 'short-unique-id';
import { v4 as uuidV4 } from 'uuid';
import { appNameToAPIName } from '../js/apps';
import { getUTCTimeNumber } from '../js/getUTCTimeNumber';
import { dbClient } from './dbClient';

const sid = new ShortId({ length: 11 });

export function generateShortId() {
  return sid();
}

export function generateId(prefix, timestamp = Date.now()) {
  return `${prefix}${getUTCTimeNumber(new Date(timestamp))}_${generateShortId()}`;
}

export function generateUUID() {
  return uuidV4();
}

export function getFullShortId(shortIdPrefix, shortId) {
  return `${shortIdPrefix}${shortId}`;
}

export async function getLongId(app, shortIdPrefix, id) {
  if (id.startsWith(appNameToAPIName[app])) {
    return id;
  }

  const item = await dbClient.get(getFullShortId(shortIdPrefix, id), appNameToAPIName[app]);
  return item?.longId;
}
