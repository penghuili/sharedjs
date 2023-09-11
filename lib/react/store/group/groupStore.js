import { put, select, take } from 'redux-saga/effects';

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

function setGroupsObj(state) {
  const items = safeGet(state, ['data', defaultId, 'items'], []);
  const groupsObj = items.reduce((acc, group) => {
    acc[group.sortKey] = group;
    return acc;
  }, {});

  return safeSet(state, ['data', defaultId, 'groupsObj'], groupsObj);
}

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
      return setGroupsObj(state);
    },
    fetchItem: async ({ itemId }) => {
      return fetchGroup(itemId);
    },
    createItem: ({ title, sortKeyPrefix }) => {
      return createGroup(title, sortKeyPrefix);
    },
    onCreateItemSucceeded: state => {
      return setGroupsObj(state);
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
    updateItem: async ({ itemId, title, position, onSucceeded }, group) => {
      const result = await updateGroup(itemId, { title, position }, group.decryptedPassword);
      if (onSucceeded && result.data) {
        onSucceeded(result.data);
      }

      return result;
    },
    onUpdateItemSucceeded: state => {
      return setGroupsObj(state);
    },
    deleteItem: async ({ itemId }) => {
      return deleteGroup(itemId);
    },
    onDeleteItemSucceeded: state => {
      return setGroupsObj(state);
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
