import ShortId from 'short-unique-id';

const sid = new ShortId({ length: 11 });

export function generateShortId() {
  return sid.rnd();
}
