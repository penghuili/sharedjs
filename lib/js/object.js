import lodashSet from 'lodash.set';
import lodashGet from 'lodash.get';
import lodashCloneDeep from 'lodash.clonedeep';

export function safeGet(obj, path, defaultValue) {
  return lodashGet(obj, path, defaultValue);
}

export function safeSet(obj, path, value) {
  const newObj = lodashCloneDeep(obj);
  return lodashSet(newObj, path, value);
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
