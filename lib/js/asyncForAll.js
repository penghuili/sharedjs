export async function asyncForAll(arr, asyncFunc, batchSize = 50) {
  if (!arr?.length) {
    return [];
  }

  if (batchSize) {
    const chunksCount = Math.ceil(arr.length / batchSize);
    let currentChunkCount = 0;
    let results = [];
    while (currentChunkCount < chunksCount) {
      const chunk = arr.slice(currentChunkCount * batchSize, (currentChunkCount + 1) * batchSize);
      const requests = chunk.map((item, index) =>
        asyncFunc(item, index + currentChunkCount * batchSize)
      );
      const responses = await Promise.all(requests);
      results = results.concat(responses);
      currentChunkCount++;
    }

    return results;
  }

  const requests = arr.map((item, index) => asyncFunc(item, index));
  const results = await Promise.all(requests);
  return results;
}
