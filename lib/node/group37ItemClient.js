import asyncForEach from '../js/asyncForEach';
import getUTCTimeNumber from '../js/getUTCTimeNumber';
import { uniqBy } from '../js/uniq';
import dbClient from './dbClient';
import { generateId } from './idUtils';

const sortKeys = {
  item: 'group37_item_',
};

function getNoGroupSortKeyFromGroupId(groupId) {
  const groupIdPrefix = groupId.split('_').slice(0, 2).join('_');
  return `${groupIdPrefix}_no_group`;
}

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
    let newSource = sourceObj;
    if (sourceObj) {
      const noGroupSortKey = getNoGroupSortKeyFromGroupId(groupId);
      const currentGroups = sourceObj.groups || [];
      let newGroups = [];
      if (groupId === noGroupSortKey) {
        await asyncForEach(currentGroups, async group => {
          await dbClient.delete(group.id, group.itemId);
        });
        newGroups = [{ id: groupId, itemId: sortKey }];
      } else {
        const noGroupItem = currentGroups.find(g => g.id === noGroupSortKey);
        if (noGroupItem) {
          await dbClient.delete(noGroupItem.id, noGroupItem.itemId);
        }
        newGroups = uniqBy(
          [...currentGroups, { id: groupId, itemId: sortKey }].filter(i => i.id !== noGroupSortKey),
          'itemId'
        );
      }

      newSource = await dbClient.update(sourceId, sourceSortKey, { groups: newGroups });
    }

    return { item: data, source: newSource };
  },
  async deleteItem(groupId, itemId, force) {
    const item = await group37ItemClient.getItem(groupId, itemId);
    const sourceObj = await dbClient.get(item.sourceId, item.sourceSortKey);
    let newSource = sourceObj;
    if (sourceObj) {
      let newGroups = (sourceObj.groups || []).filter(group => group.itemId !== itemId);
      if (!newGroups.length && !force) {
        const noGroupSortKey = getNoGroupSortKeyFromGroupId(groupId);

        const newItem = await group37ItemClient.createItem(noGroupSortKey, {
          createdAt: sourceObj.createdAt,
          sourceId: sourceObj.id,
          sourceSortKey: sourceObj.sortKey,
        });

        newGroups = [{ id: noGroupSortKey, itemId: newItem.item.sortKey }];
      }
      newSource = await dbClient.update(item.sourceId, item.sourceSortKey, {
        groups: newGroups,
      });
    }

    await dbClient.delete(groupId, itemId);

    return { item: { id: groupId, sortKey: itemId }, source: newSource };
  },
};

export default group37ItemClient;
