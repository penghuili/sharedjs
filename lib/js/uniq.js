import lodashUniqBy from 'lodash.uniqby';

export function uniqBy(items, field) {
  return lodashUniqBy(items, item => item[field]);
}
