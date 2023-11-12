export async function asyncForEach(arr, asyncFunc) {
  if (!arr?.length) {
    return;
  }

  for (let index = 0; index < arr.length; index += 1) {
    await asyncFunc(arr[index], index, arr);
  }
}
