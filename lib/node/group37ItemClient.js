import getUTCTimeNumber from '../js/getUTCTimeNumber';
import { uniqBy } from '../js/uniq';
import dbClient from './dbClient';
import { generateId } from './idUtils';

const sortKeys = {
  item: 'group37_item_',
};

const group37ItemClient = {
  async getItems(groupId, { startTime, endTime, startKey }) {
    const limit = 15;
    const { items, lastEvaluatedKey } = await dbClient.list(groupId, sortKeys.item, {
      startTime,
      endTime: startTime ? endTime || getUTCTimeNumber() : undefined,
      limit,
      limitStartKey: startKey ? { id: groupId, sortKey: startKey } : undefined,
    });

    return {
      items: items.filter(i => i),
      lastEvaluatedKey,
      limit,
    };
  },
  async getItem(groupId, itemId) {
    const item = await dbClient.get(groupId, itemId);
    return item;
  },
  async createItem(groupId, { createdAt, sourceId, sourceSortKey }) {
    const sortKey = generateId(sortKeys.item, createdAt);
    const data = {
      id: groupId,
      sortKey,
      createdAt,

      sourceId,
      sourceSortKey,
    };
    await dbClient.create(data);

    const sourceObj = await dbClient.get(sourceId, sourceSortKey);
    if (sourceObj) {
      const newGroups = uniqBy(
        [...(sourceObj.groups || []), { id: groupId, itemId: sortKey }],
        'itemId'
      );
      await dbClient.update(sourceId, sourceSortKey, { groups: newGroups });
    }

    return data;
  },
  async deleteItem(groupId, itemId) {
    const item = await group37ItemClient.getItem(groupId, itemId);
    const sourceObj = await dbClient.get(item.sourceId, item.sourceSortKey);
    if (sourceObj) {
      const newGroups = (sourceObj.groups || []).filter(group => group.itemId !== itemId);
      await dbClient.update(item.sourceId, item.sourceSortKey, { groups: newGroups });
    }

    await dbClient.delete(groupId, itemId);

    return { id: groupId, itemId };
  },
};

export default group37ItemClient;
