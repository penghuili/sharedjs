export async function batch(arr, asyncFunc, { batchSize = 10, onBatchSucceeded } = {}) {
  if (!arr?.length) {
    return;
  }

  let innerArr = arr.slice(0);
  let count = 0;

  while (innerArr.length) {
    const chunk = innerArr.splice(0, batchSize);
    const requests = chunk.map((item, index) => asyncFunc(item, count * batchSize + index));
    const responses = await Promise.all(requests);
    if (onBatchSucceeded) {
      await onBatchSucceeded(responses);
    }
    innerArr = innerArr.slice(batchSize);
    count++;
  }
}
