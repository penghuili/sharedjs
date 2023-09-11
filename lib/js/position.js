function generatePosition(timestamp = Date.now()) {
  return `${timestamp}3`;
}

function getItemPosition(item) {
  if (!item) {
    return null;
  }
  if (item.position) {
    return item.position;
  }
  if (item.createdAt) {
    return generatePosition(item.createdAt);
  }
  return generatePosition();
}

export function calculateItemPosition(items, sourceId, targetId) {
  const sourceIndex = items.findIndex(i => i.sortKey === sourceId);
  const targetIndex = items.findIndex(i => i.sortKey === targetId);

  if (sourceIndex === targetIndex) {
    return getItemPosition(items[sourceIndex]);
  }

  let prePosition;
  let afterPosition;

  if (sourceIndex > targetIndex) {
    prePosition = getItemPosition(items[targetIndex - 1]);
    afterPosition = getItemPosition(items[targetIndex]);
  } else {
    prePosition = getItemPosition(items[targetIndex]);
    afterPosition = getItemPosition(items[targetIndex + 1]);
  }

  if (prePosition) {
    let newPosition = `${prePosition.slice(0, prePosition.length - 1)}23`;

    while (newPosition <= afterPosition) {
      newPosition = `${newPosition}3`;
    }

    return newPosition;
  }

  return generatePosition();
}

export function calculateItemPosition2(items, preIndex, afterIndex) {
  const prePosition = getItemPosition(items[preIndex]);
  const afterPosition = getItemPosition(items[afterIndex]);

  if (prePosition) {
    let newPosition = `${prePosition.slice(0, prePosition.length - 1)}23`;

    while (newPosition <= afterPosition) {
      newPosition = `${newPosition}3`;
    }

    return newPosition;
  }

  return generatePosition();
}

export function orderByPosition(items) {
  return (items || []).sort((a, b) => (getItemPosition(b) > getItemPosition(a) ? 1 : -1));
}
