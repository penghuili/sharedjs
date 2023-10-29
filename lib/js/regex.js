export function onlyKeepNumbers(value) {
  return value.replace(/\D/g, '');
}

export function isValidUsername(value) {
  return !/[^a-z0-9]/.test(value);
}
