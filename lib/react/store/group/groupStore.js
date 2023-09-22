import { put, select, take } from 'redux-saga/effects';

import { getNoGroupSortKey } from '../../../js/apps';
import { safeGet, safeSet } from '../../../js/object';
import {
  createDataSelectors,
  createGeneralStore,
  createRequest,
  defaultId,
  mergeReducers,
  mergeSagas,
} from '../storeHelpers';
import {
  createGroup,
  createGroupItem,
  deleteGroup,
  deleteGroupItem,
  fetchGroup,
  fetchGroups,
  updateGroup,
} from './groupNetwork';
import { LocalStorage } from '../../../js/LocalStorage';

function groupItems(state, sortKeyPrefix) {
  const items = safeGet(state, ['data', defaultId, 'items'], []);

  const noGroupSortKey = getNoGroupSortKey(sortKeyPrefix);
  let noGroupItem = null;
  const normalItems = [];
  const primaryItems = [];
  const secondaryItems = [];

  items.forEach(item => {
    if (item.sortKey === noGroupSortKey) {
      noGroupItem = item;
    } else {
      normalItems.push(item);
      if (item.isSecondary) {
        secondaryItems.push(item);
      } else {
        primaryItems.push(item);
      }
    }
  });

  const groupsObj = items.reduce((acc, group) => {
    if (group.sortKey !== noGroupSortKey) {
      acc[group.sortKey] = group;
    }
    return acc;
  }, {});

  return safeSet(state, ['data', defaultId], {
    items: normalItems,
    groupsObj,
    primaryItems,
    secondaryItems,
    noGroupItem,
  });
}

export function createGroupStore(domain, sortKeyPrefix) {
  const dataSelectors = createDataSelectors(domain);

  const { actions, selectors, reducer, saga } = createGeneralStore(domain, {
    preFetchItems: function* (payload) {
      const files = yield select(dataSelectors.getItems);
      if (files.length) {
        return { continueCall: false };
      }

      const cachedGroups = LocalStorage.get(domain);
      if (cachedGroups?.length) {
        yield put(actions.fetchItems.succeeded.action({ payload, data: cachedGroups }));
      }

      return { continueCall: true };
    },
    fetchItems: async () => {
      const result = await fetchGroups(sortKeyPrefix);
      if (
        result?.data?.items &&
        !result.data.items.find(item => item.sortKey === getNoGroupSortKey(sortKeyPrefix))
      ) {
        const { data } = await createGroup('Ungrouped', sortKeyPrefix, true);
        if (data) {
          result.data.items.unshift(data);
        }
      }
      if (result?.data?.items) {
        LocalStorage.set(domain, result.data.items);
      }

      return result;
    },
    onFetchItemsSucceeded: state => {
      return groupItems(state, sortKeyPrefix);
    },
    fetchItem: async ({ itemId }) => {
      return fetchGroup(itemId);
    },
    createItem: async ({ title, onSucceeded }) => {
      const result = await createGroup(title, sortKeyPrefix);
      if (onSucceeded && result.data) {
        onSucceeded(result.data);
      }

      return result;
    },
    onCreateItemSucceeded: state => {
      return groupItems(state, sortKeyPrefix);
    },
    preUpdateItem: function* ({ itemId }) {
      let group = yield select(dataSelectors.getStandaloneItem);
      if (!group) {
        yield put({ type: `${domain}/fetchItem/REQUESTED`, payload: { itemId } });
        yield take(`${domain}/fetchItem/SUCCEEDED`);
        group = yield select(dataSelectors.getStandaloneItem);
      }
      return { continueCall: !!group, result: group };
    },
    updateItem: async ({ itemId, title, position, isSecondary, onSucceeded }, group) => {
      const result = await updateGroup(
        itemId,
        { title, position, isSecondary },
        group.decryptedPassword
      );
      if (onSucceeded && result.data) {
        onSucceeded(result.data);
      }

      return result;
    },
    onUpdateItemSucceeded: state => {
      return groupItems(state, sortKeyPrefix);
    },
    deleteItem: async ({ itemId }) => {
      return deleteGroup(itemId);
    },
    onDeleteItemSucceeded: state => {
      return groupItems(state, sortKeyPrefix);
    },
  });

  const {
    actions: createGroupItemActions,
    selectors: createGroupItemSelectors,
    reducer: createGroupItemReducer,
    saga: createGroupItemSaga,
  } = createRequest(domain, 'createGroupItem', {
    watchEvery: true,
    request: async ({ id, createdAt, sourceId, sourceSortKey }) => {
      return createGroupItem(id, { createdAt, sourceId, sourceSortKey });
    },
  });

  const {
    actions: deleteGroupItemActions,
    selectors: deleteGroupItemSelectors,
    reducer: deleteGroupItemReducer,
    saga: deleteGroupItemSaga,
  } = createRequest(domain, 'deleteGroupItem', {
    watchEvery: true,
    request: async ({ id, itemId }) => {
      return deleteGroupItem(id, itemId);
    },
  });

  const groupActions = {
    fetchItemsRequested: actions.fetchItems.requested.action,
    fetchItemRequested: actions.fetchItem.requested.action,
    createRequested: actions.createItem.requested.action,
    updateRequested: actions.updateItem.requested.action,
    deleteRequested: actions.deleteItem.requested.action,
    createGroupItemRequested: createGroupItemActions.requested.action,
    createGroupItemSucceeded: createGroupItemActions.succeeded.action,
    deleteGroupItemRequested: deleteGroupItemActions.requested.action,
    deleteGroupItemSucceeded: deleteGroupItemActions.succeeded.action,
  };

  const groupSelectors = {
    ...selectors,
    createGroupItem: createGroupItemSelectors,
    deleteGroupItem: deleteGroupItemSelectors,
    data: {
      ...dataSelectors,
      getPrimaryItems: state => safeGet(state, [domain, 'data', defaultId, 'primaryItems'], []),
      getSecondaryItems: state => safeGet(state, [domain, 'data', defaultId, 'secondaryItems'], []),
      getGroupsObj: state => safeGet(state, [domain, 'data', defaultId, 'groupsObj']),
      getNoGroupItem: state => safeGet(state, [domain, 'data', defaultId, 'noGroupItem']),
    },
  };

  const groupReducer = mergeReducers([reducer, createGroupItemReducer, deleteGroupItemReducer]);

  const groupSagas = mergeSagas([saga, createGroupItemSaga, deleteGroupItemSaga]);

  return {
    actions: groupActions,
    selectors: groupSelectors,
    reducer: groupReducer,
    saga: groupSagas,
  };
}
