async function scan(arr, { filters, maps } = {}) {
  if (!arr?.length) {
    return arr;
  }

  const newArr = [];
  arr.forEach((item, index) => {
    const allPass = (filters || []).every(fn => fn(item, index));
    if (allPass) {
      const updatedItem = (maps || []).reduce((newItem, fn) => fn(newItem, index), item);
      newArr.push(updatedItem);
    }
  });

  return newArr;
}

export default scan;
