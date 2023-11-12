import { call, fork, put, takeEvery, takeLatest } from 'redux-saga/effects';
import {
  getBySortKey,
  prepend,
  removeBySortKey,
  safeGet,
  safeSet,
  updateBySortKey,
} from '../../js/object';
import { orderByPosition } from '../../js/position';
import { uniqBy } from '../../js/uniq';
import { routeHelpers } from '../routeHelpers';
import { sharedActionTypes } from './sharedActions';

export const defaultId = 'defaultId';

export function updateStandaloneItemAndItems(state, item, id) {
  if (!item) {
    return state;
  }
  const safeId = id || defaultId;
  const updatedItem = safeSet(state, [safeId, 'data', 'item'], item);
  const updatedItems = updateBySortKey(updatedItem, [safeId, 'data', 'items'], item.sortKey, item);
  return updatedItems;
}

export function createDataSelectors(domain) {
  return {
    getData: (state, id = defaultId) => safeGet(state, [domain, id, 'data'], null),
    getItems: (state, id = defaultId) => safeGet(state, [domain, id, 'data', 'items'], []),
    getItem: (state, id = defaultId, itemId) =>
      getBySortKey(state, [domain, id, 'data', 'items'], itemId),
    getStartKey: (state, id = defaultId) => safeGet(state, [domain, id, 'data', 'startKey']),
    hasMore: (state, id = defaultId) => safeGet(state, [domain, id, 'data', 'hasMore']),
    getStandaloneItem: (state, id = defaultId) => safeGet(state, [domain, id, 'data', 'item']),
  };
}

export function createRequest(
  domain,
  name,
  {
    onReducerStarted = state => state,
    onReducerSucceeded = state => state,
    onReducerFailed = state => state,
    preRequest,
    request,
    watchEvery = false,
  } = {}
) {
  const actions = {
    requested: {
      type: `${domain}/${name}/REQUESTED`,
      action: (payload = {}) => {
        return { type: `${domain}/${name}/REQUESTED`, payload };
      },
    },
    started: {
      type: `${domain}/${name}/STARTED`,
      action: (payload = {}) => ({ type: `${domain}/${name}/STARTED`, payload }),
    },
    succeeded: {
      type: `${domain}/${name}/SUCCEEDED`,
      action: (payload = {}) => ({ type: `${domain}/${name}/SUCCEEDED`, payload }),
    },
    failed: {
      type: `${domain}/${name}/FAILED`,
      action: (payload = {}) => ({ type: `${domain}/${name}/FAILED`, payload }),
    },
    finished: {
      type: `${domain}/${name}/FINISHED`,
      action: (payload = {}) => ({ type: `${domain}/${name}/FINISHED`, payload }),
    },
  };

  const selectors = {
    isPending: (state, id = defaultId) => safeGet(state, [domain, id, name, 'isPending'], false),
    isSuccessful: (state, id = defaultId) =>
      safeGet(state, [domain, id, name, 'isSuccessful'], false),
    getError: (state, id = defaultId) => safeGet(state, [domain, id, name, 'error'], null),
  };

  return {
    actions,
    selectors,
    reducer: (state = {}, action) => {
      switch (action.type) {
        case actions.started.type: {
          const safeId = action?.payload?.id || defaultId;
          const updatedState = safeSet(state, [safeId, name], {
            isSuccessful: false,
            isPending: true,
            error: null,
          });
          return onReducerStarted(updatedState, action.payload);
        }
        case actions.succeeded.type: {
          const safeId = action?.payload?.payload?.id || defaultId;
          const updatedState = safeSet(state, [safeId, name, 'isSuccessful'], true);

          return onReducerSucceeded(updatedState, action.payload);
        }
        case actions.failed.type: {
          const safeId = action?.payload?.payload?.id || defaultId;
          const udpatedState = safeSet(state, [safeId, name, 'error'], action?.payload?.error);
          return onReducerFailed(udpatedState, action.payload);
        }
        case actions.finished.type: {
          const safeId = action?.payload?.id || defaultId;
          const updatedState = safeSet(state, [safeId, name, 'isPending'], false);
          return updatedState;
        }
        case sharedActionTypes.RESET:
          return {};
        default:
          return state;
      }
    },
    saga: function* () {
      const sagaFn = watchEvery ? takeEvery : takeLatest;
      yield sagaFn(actions.requested.type, function* ({ payload }) {
        if (!request) {
          return;
        }

        yield put(actions.started.action(payload));
        let preRequestResult;
        if (preRequest) {
          const { continueCall, result } = yield call(preRequest, payload);
          if (!continueCall) {
            yield put(actions.finished.action(payload));
            return;
          }

          preRequestResult = result;
        }

        const { data, error } = yield call(request, payload, preRequestResult);
        if (error) {
          yield put(actions.failed.action({ error, payload }));
        } else {
          if (!payload?.notUpdateStore) {
            yield put(actions.succeeded.action({ data, payload }));
          }
        }

        yield put(actions.finished.action(payload));

        if (!error && payload?.goBack) {
          yield call(routeHelpers.goBack);
        }
      });
    },
  };
}

export function mergeReducers(reducers) {
  return (state = {}, action) => {
    let newState = state;
    reducers.forEach(reducer => {
      newState = reducer(newState, action);
    });

    return newState;
  };
}

export function mergeSagas(sagas) {
  return function* () {
    for (let i = 0; i < sagas.length; i++) {
      yield fork(sagas[i]);
    }
  };
}

export function updateItems(state, { payload, data }) {
  const safeId = payload?.id || defaultId;
  if (payload?.startKey) {
    const { items, startKey, hasMore } = data;
    const currentItems = safeGet(state, [safeId, 'data', 'items'], []);
    const newItems = uniqBy([...currentItems, ...items], 'sortKey');
    return safeSet(state, [safeId, 'data'], {
      items: newItems,
      startKey,
      hasMore,
    });
  }

  return safeSet(state, [safeId, 'data'], {
    items: data.items,
    startKey: data.startKey,
    hasMore: data.hasMore,
  });
}

export function createGeneralStore(
  domain,
  {
    preFetchItems,
    fetchItems,
    onFetchItemsSucceeded = state => state,
    preFetchItem,
    fetchItem,
    onFetchItemSucceeded = state => state,
    preCreateItem,
    createItem,
    onCreateItemSucceeded = state => state,
    preUpdateItem,
    updateItem,
    onUpdateItemSucceeded = state => state,
    preDeleteItem,
    deleteItem,
    onDeleteItemSucceeded = state => state,
  }
) {
  const {
    actions: fetchItemsActions,
    reducer: fetchItemsReducer,
    selectors: fetchItemsSelectors,
    saga: fetchItemsSaga,
  } = createRequest(domain, 'fetchItems', {
    onReducerSucceeded: (state, payload) =>
      onFetchItemsSucceeded(updateItems(state, payload), payload),
    preRequest: preFetchItems,
    request: fetchItems,
  });

  const {
    actions: fetchItemActions,
    reducer: fetchItemReducer,
    selectors: fetchItemSelectors,
    saga: fetchItemSaga,
  } = createRequest(domain, 'fetchItem', {
    watchEvery: true,
    onReducerStarted: (state, payload) => {
      const safeId = payload?.id || defaultId;
      return safeSet(state, [safeId, 'data', 'item'], null);
    },
    onReducerSucceeded: (state, { payload, data }) => {
      const updatedState = updateStandaloneItemAndItems(state, data, payload?.id);
      return onFetchItemSucceeded(updatedState, { payload, data });
    },
    preRequest: preFetchItem,
    request: fetchItem,
  });

  const {
    actions: createItemActions,
    reducer: createItemReducer,
    selectors: createItemSelectors,
    saga: createItemSaga,
  } = createRequest(domain, 'createItem', {
    onReducerSucceeded: (state, { data, payload }) => {
      const safeId = payload?.id || defaultId;
      let updatedState = state;
      updatedState = prepend(state, [safeId, 'data', 'items'], data);
      if (payload?.reorder) {
        const newItems = orderByPosition(safeGet(updatedState, [safeId, 'data', 'items'], []));
        updatedState = safeSet(updatedState, [safeId, 'data', 'items'], newItems);
      }
      return onCreateItemSucceeded(updatedState, { data, payload });
    },
    preRequest: preCreateItem,
    request: createItem,
  });

  const {
    actions: updateItemActions,
    reducer: updateItemReducer,
    selectors: updateItemSelectors,
    saga: updateItemSaga,
  } = createRequest(domain, 'updateItem', {
    onReducerSucceeded: (state, { data, payload }) => {
      const { id, itemId, reorder } = payload;
      const safeId = id || defaultId;
      let newState = updateBySortKey(state, [safeId, 'data', 'items'], itemId, data);
      if (reorder) {
        const newItems = orderByPosition(safeGet(newState, [safeId, 'data', 'items'], []));
        newState = safeSet(newState, [safeId, 'data', 'items'], newItems);
      }
      return onUpdateItemSucceeded(newState, { data, payload });
    },
    preRequest: preUpdateItem,
    request: updateItem,
  });

  const {
    actions: deleteItemActions,
    reducer: deleteItemReducer,
    selectors: deleteItemSelectors,
    saga: deleteItemSaga,
  } = createRequest(domain, 'deleteItem', {
    onReducerSucceeded: (state, { payload }) => {
      const { id, itemId } = payload;
      const safeId = id || defaultId;
      const newState = removeBySortKey(state, [safeId, 'data', 'items'], itemId);
      return onDeleteItemSucceeded(newState, { payload });
    },
    preRequest: preDeleteItem,
    request: deleteItem,
  });

  return {
    actions: {
      fetchItems: fetchItemsActions,
      fetchItem: fetchItemActions,
      createItem: createItemActions,
      updateItem: updateItemActions,
      deleteItem: deleteItemActions,
    },
    selectors: {
      fetchItems: fetchItemsSelectors,
      fetchItem: fetchItemSelectors,
      createItem: createItemSelectors,
      updateItem: updateItemSelectors,
      deleteItem: deleteItemSelectors,
    },
    reducer: mergeReducers([
      fetchItemsReducer,
      fetchItemReducer,
      createItemReducer,
      updateItemReducer,
      deleteItemReducer,
    ]),
    saga: mergeSagas([
      fetchItemsSaga,
      fetchItemSaga,
      createItemSaga,
      updateItemSaga,
      deleteItemSaga,
    ]),
  };
}
