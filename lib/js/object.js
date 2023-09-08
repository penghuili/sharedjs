import lodashCloneDeep from 'lodash.clonedeep';
import lodashGet from 'lodash.get';
import lodashSet from 'lodash.set';

import { formatDate } from './date';

export function safeGet(obj, path, defaultValue) {
  return lodashGet(obj, path, defaultValue);
}

export function safeSet(obj, path, value) {
  const newObj = lodashCloneDeep(obj);
  const currentValue = safeGet(newObj, path);
  const newValue =
    value && typeof currentValue === 'object' && !Array.isArray(currentValue)
      ? { ...currentValue, ...value }
      : value;
  return lodashSet(newObj, path, newValue);
}

export function prepend(obj, arrayPath, value) {
  const arr = safeGet(obj, arrayPath, []);

  return safeSet(obj, arrayPath, [value, ...arr]);
}

export function getBySortKey(obj, arrayPath, sortKey) {
  const arr = safeGet(obj, arrayPath, []);

  return arr.find(i => i.sortKey === sortKey);
}

export function updateBySortKey(obj, arrayPath, sortKey, value) {
  const arr = safeGet(obj, arrayPath, []);

  return safeSet(
    obj,
    arrayPath,
    arr.map(i => (i.sortKey === sortKey ? { ...i, ...value } : i))
  );
}

export function removeBySortKey(obj, path, sortKey) {
  const arr = safeGet(obj, path, []);

  return safeSet(
    obj,
    path,
    arr.filter(i => i.sortKey !== sortKey)
  );
}

export function groupByDate(items, dateKey = 'createdAt') {
  const groups = [];
  let currentGroup = null;

  items.forEach(item => {
    const itemDate = formatDate(new Date(item[dateKey]));

    if (!currentGroup || currentGroup.date !== itemDate) {
      currentGroup = { date: itemDate, items: [] };
      groups.push(currentGroup);
    }

    currentGroup.items.push(item);
  });

  return groups;
}
