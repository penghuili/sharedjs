import getUTCTimeNumber from '../js/getUTCTimeNumber';
import dbClient from './dbClient';
import { generateId } from './idUtils';

const sortKeys = {
  item: 'group37_item_',
};

const group37ItemClient = {
  async getItems(groupId, { startTime, endTime, startKey }) {
    if (startTime) {
      const { items } = await dbClient.list(groupId, sortKeys.item, {
        startTime,
        endTime: endTime || getUTCTimeNumber(),
      });

      return {
        items,
      };
    }

    const limit = 15;
    const { items, lastEvaluatedKey } = await dbClient.list(groupId, sortKeys.item, {
      limit,
      limitStartKey: startKey ? { id: groupId, sortKey: startKey } : undefined,
    });

    return {
      items,
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

    return data;
  },
  async deleteItem(groupId, itemId) {
    await dbClient.delete(groupId, itemId);

    return { id: itemId };
  },
};

export default group37ItemClient;
