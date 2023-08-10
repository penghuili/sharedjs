import { call, fork, put, takeLatest } from 'redux-saga/effects';

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

export const defaultId = 'defaultId';

export function createDataSelectors(domain) {
  return {
    getData: (state, id = defaultId) => safeGet(state, [domain, 'data', id], null),
    getItems: (state, id = defaultId) => safeGet(state, [domain, 'data', id, 'items'], []),
    getItem: (state, id = defaultId, itemId) =>
      getBySortKey(state, [domain, 'data', id, 'items'], itemId),
    getStartKey: (state, id) => safeGet(state, [domain, 'data', id, 'startKey']),
    hasMore: (state, id) => safeGet(state, [domain, 'data', id, 'hasMore']),
    getStandaloneItem: (state, id = defaultId) => safeGet(state, [domain, 'data', id, 'item']),
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
  };

  const selectors = {
    isPending: (state, id = defaultId) => safeGet(state, [domain, name, id, 'isPending'], false),
    isSuccessful: (state, id = defaultId) =>
      safeGet(state, [domain, name, id, 'isSuccessful'], false),
    getError: (state, id = defaultId) => safeGet(state, [domain, name, id, 'error'], null),
  };

  return {
    actions,
    selectors,
    reducer: (state = {}, action) => {
      switch (action.type) {
        case actions.started.type: {
          const safeId = action?.payload?.id || defaultId;
          const updatedState = safeSet(state, [name, safeId], {
            isPending: true,
            isSuccessful: false,
            error: null,
          });
          return onReducerStarted(updatedState, action.payload);
        }
        case actions.succeeded.type: {
          const safeId = action?.payload?.payload?.id || defaultId;
          const updatedState = safeSet(state, [name, safeId], {
            isSuccessful: true,
            isPending: false,
            error: null,
          });

          return onReducerSucceeded(updatedState, action.payload);
        }
        case actions.failed.type: {
          const safeId = action?.payload?.payload?.id || defaultId;
          const udpatedState = safeSet(state, [name, safeId], {
            error: null,
            isPending: false,
            isSuccessful: false,
          });
          return onReducerFailed(udpatedState, action.payload);
        }
        default:
          return state;
      }
    },
    saga: function* () {
      yield takeLatest(actions.requested.type, function* ({ payload }) {
        if (!request) {
          return;
        }

        let preRequestResult;
        if (preRequest) {
          const { continueCall, result } = yield call(preRequest, payload);
          if (!continueCall) {
            return;
          }

          preRequestResult = result;
        }

        yield put(actions.started.action(payload));
        const { data, error } = yield call(request, payload, preRequestResult);
        if (error) {
          yield put(actions.failed.action({ error, payload }));
        } else {
          yield put(actions.succeeded.action({ data, payload }));
          if (payload?.goBack) {
            yield call(routeHelpers.goBack);
          }
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

export function updateItems(domain, state, { payload, data }) {
  const dataSelectors = createDataSelectors(domain);
  const safeId = payload?.id || defaultId;
  const currentStartKey = dataSelectors.getStartKey(state, safeId);
  if (currentStartKey) {
    const { items, startKey, hasMore } = data;
    const currentItems = safeGet(state, ['data', safeId, 'items'], []);
    const newItems = uniqBy([...currentItems, ...items], 'sortKey');
    return safeSet(state, ['data', safeId], {
      items: newItems,
      startKey,
      hasMore,
    });
  }

  return safeSet(state, ['data', safeId], {
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
    preFetchItem,
    fetchItem,
    preCreateItem,
    createItem,
    preUpdateItem,
    updateItem,
    preDeleteItem,
    deleteItem,
  }
) {
  const {
    actions: fetchItemsActions,
    reducer: fetchItemsReducer,
    selectors: fetchItemsSelectors,
    saga: fetchItemsSaga,
  } = createRequest(domain, 'fetchItems', {
    onReducerSucceeded: (state, payload) => updateItems(domain, state, payload),
    preRequest: preFetchItems,
    request: fetchItems,
  });

  const {
    actions: fetchItemActions,
    reducer: fetchItemReducer,
    selectors: fetchItemSelectors,
    saga: fetchItemSaga,
  } = createRequest(domain, 'fetchItem', {
    onReducerStarted: (state, payload) =>
      safeSet(state, ['data', payload.id || defaultId, 'item'], null),
    onReducerSucceeded: (state, { payload, data }) =>
      safeSet(state, ['data', payload.id || defaultId, 'item'], data),
    preRequest: preFetchItem,
    request: fetchItem,
  });

  const {
    actions: createItemActions,
    reducer: createItemReducer,
    selectors: createItemSelectors,
    saga: createItemSaga,
  } = createRequest(domain, 'createItem', {
    onReducerSucceeded: (state, { data, payload: { id } }) => {
      const safeId = id || defaultId;
      const isLoaded = safeGet(state, ['fetchItems', safeId, 'isSuccessful'], false);
      return isLoaded ? prepend(state, ['data', safeId, 'items'], data) : state;
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
    onReducerSucceeded: (state, { data, payload: { id, childId, reorder } }) => {
      const safeId = id || defaultId;
      const newState = updateBySortKey(state, ['data', safeId, 'items'], childId, data);
      if (reorder) {
        const newItems = orderByPosition(safeGet(newState, ['data', safeId, 'items'], []));
        return safeSet(newState, ['data', safeId, 'items'], newItems);
      }
      return newState;
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
    onReducerSucceeded: (state, { payload: { id, childId } }) => {
      const safeId = id || defaultId;
      return removeBySortKey(state, ['data', safeId, 'items'], childId);
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
