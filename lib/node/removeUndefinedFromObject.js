function removeUndefinedFromObject(object) {
  return JSON.parse(JSON.stringify(object));
}

export default removeUndefinedFromObject;
