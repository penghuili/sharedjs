import { asyncForAll } from '../js/asyncForAll';
import { removeUndefinedFromObject } from './removeUndefinedFromObject';

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  DeleteCommand,
} = require('@aws-sdk/lib-dynamodb');

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(ddbClient);

export const dbClient = {
  async get(id, sortKey) {
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: { id, sortKey },
    };
    const command = new GetCommand(params);
    const response = await docClient.send(command);

    return response.Item;
  },
  // startTime: 20210805144159
  // endTime: 20210805144159
  async list(
    id,
    sortKeyPrefix,
    { limit, limitStartKey, startTime, endTime, query, filterString } = {}
  ) {
    let KeyConditionExpression = 'id = :id';
    let ExpressionAttributeValues = {
      ':id': id,
    };

    if (sortKeyPrefix && startTime && endTime) {
      KeyConditionExpression = 'id = :id and sortKey between :startTime and :endTime';
      ExpressionAttributeValues = {
        ':id': id,
        ':startTime': `${sortKeyPrefix}${startTime}`,
        ':endTime': `${sortKeyPrefix}${endTime}`,
      };
    } else if (sortKeyPrefix) {
      KeyConditionExpression = 'id = :id and begins_with(sortKey, :sortKeyPrefix)';
      ExpressionAttributeValues = {
        ':id': id,
        ':sortKeyPrefix': sortKeyPrefix,
      };
    }

    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      KeyConditionExpression,
      ExpressionAttributeValues,
      ScanIndexForward: false,
    };
    if (query && filterString) {
      const queryExpression = {};
      Object.keys(query).forEach(key => {
        queryExpression[`:${key}`] = query[key];
      });
      const attributeNames = {};
      Object.keys(query).forEach(key => {
        attributeNames[`#${key}`] = key;
      });

      params.ExpressionAttributeValues = {
        ...params.ExpressionAttributeValues,
        ...queryExpression,
      };
      params.ExpressionAttributeNames = attributeNames;
      params.FilterExpression = filterString;
    }

    if (limit) {
      params.Limit = limit;
      params.ExclusiveStartKey = limitStartKey;
    }

    const command = new QueryCommand(params);
    const response = await docClient.send(command);

    return {
      items: response.Items,
      lastEvaluatedKey: response.LastEvaluatedKey,
    };
  },
  async create(item) {
    const updatedItem = removeUndefinedFromObject({
      ...item,
      createdAt: item.createdAt || Date.now(),
    });
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Item: updatedItem,
    };

    const command = new PutCommand(params);
    await docClient.send(command);

    return updatedItem;
  },
  async update(id, sortKey, item) {
    const current = await dbClient.get(id, sortKey);
    const updatedItem = {
      ...(current || {}),
      ...removeUndefinedFromObject(item),
      id,
      sortKey,
      updatedAt: Date.now(),
    };

    return dbClient.create(updatedItem);
  },
  async delete(id, sortKey) {
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: { id, sortKey },
    };
    const command = new DeleteCommand(params);
    await docClient.send(command);

    return { id, sortKey };
  },
  async deleteWithPrefix(id, sortKeyPrefix) {
    await dbClient.batch(id, sortKeyPrefix, async (itemId, item) => {
      await dbClient.delete(itemId, item.sortKey);
    });
  },
  async batch(id, sortKeyPrefix, callback) {
    const limit = 100;
    let startKey;
    let resultCount = limit;
    while (resultCount >= limit) {
      // eslint-disable-next-line no-await-in-loop
      const { items, lastEvaluatedKey } = await dbClient.list(id, sortKeyPrefix, {
        limit,
        limitStartKey: startKey ? { id, sortKey: startKey } : undefined,
      });
      resultCount = items.length;
      startKey = lastEvaluatedKey?.sortKey;
      if (resultCount) {
        // eslint-disable-next-line no-await-in-loop
        await asyncForAll(items, async item => {
          await callback(id, item);
        });
      }
    }
  },
};
