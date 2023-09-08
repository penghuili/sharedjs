import { select } from 'redux-saga/effects';

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
import { safeGet, safeSet } from '../../../js/object';

export function createGroupStore(domain) {
  const dataSelectors = createDataSelectors(domain);

  const { actions, selectors, reducer, saga } = createGeneralStore(domain, {
    preFetchItems: function* () {
      const files = yield select(dataSelectors.getItems);
      if (files.length) {
        return { continueCall: false };
      }
      return { continueCall: true };
    },
    fetchItems: async ({ prefix }) => {
      return fetchGroups(prefix);
    },
    onFetchItemsSucceeded: state => {
      const items = safeGet(state, ['data', defaultId, 'items'], []);
      const groupsObj = items.reduce((acc, group) => {
        acc[group.sortKey] = group;
        return acc;
      }, {});

      return safeSet(state, ['data', defaultId, 'groupsObj'], groupsObj);
    },
    fetchItem: async ({ itemId }) => {
      return fetchGroup(itemId);
    },
    createItem: ({ title, sortKeyPrefix }) => {
      return createGroup(title, sortKeyPrefix);
    },
    updateItem: async ({ itemId, title, position }) => {
      return updateGroup(itemId, { title, position });
    },
    deleteItem: async ({ itemId }) => {
      return deleteGroup(itemId);
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
      getGroupsObj: state => safeGet(state, [domain, 'data', defaultId, 'groupsObj']),
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
