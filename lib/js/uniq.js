import uniqBy from 'lodash.uniqby';

export function uniqByKey(items, key) {
  return uniqBy(items, item => item[key]);
}
