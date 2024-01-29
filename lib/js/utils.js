export function add0(num) {
  return num < 10 ? `0${num}` : `${num}`;
}

export function floorTo(value, multiple) {
  return Math.floor(value / multiple) * multiple;
}

export function toFixed(value, digits) {
  return +value.toFixed(digits);
}
