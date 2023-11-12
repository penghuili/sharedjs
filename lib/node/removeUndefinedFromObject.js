export function removeUndefinedFromObject(object) {
  return JSON.parse(JSON.stringify(object));
}
