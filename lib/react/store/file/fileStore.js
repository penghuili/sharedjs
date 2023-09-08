import { call, put, select } from 'redux-saga/effects';

import { groupByDate, safeGet, safeSet } from '../../../js/object';
import { sharedActionCreators } from '../sharedActions';
import {
  createDataSelectors,
  createGeneralStore,
  createRequest,
  defaultId,
  mergeReducers,
  mergeSagas,
} from '../storeHelpers';
import {
  deleteFile,
  downloadFile,
  downloadThumbnail,
  fetchFile,
  fetchFiles,
  fetchSettings,
  uploadFile,
} from './fileNetwork';

export const fileDomain = 'file';

const dataSelectors = createDataSelectors(fileDomain);

export function regroupFiles(state) {
  const items = safeGet(state, ['data', defaultId, 'items'], []);
  const groupItems = groupByDate(items);
  return safeSet(state, ['data', defaultId], {
    groupItems,
  });
}

const { actions, selectors, reducer, saga } = createGeneralStore(fileDomain, {
  preFetchItems: function* () {
    const files = yield select(dataSelectors.getItems);
    const startKey = yield select(dataSelectors.getStartKey);
    if (files.length && !startKey) {
      return { continueCall: false };
    }
    return { continueCall: true };
  },
  fetchItems: async ({ startKey }) => {
    return fetchFiles(startKey);
  },
  fetchItem: async ({ itemId }) => {
    return fetchFile(itemId);
  },
  onFetchItemsSucceeded: regroupFiles,
  createItem: function* ({ file }) {
    const result = yield call(uploadFile, file);

    if (result.data) {
      yield put(sharedActionCreators.setToast('Image is uploaded.'));
    }

    return result;
  },
  onCreateItemSucceeded: regroupFiles,
  deleteItem: async ({ itemId }) => {
    return deleteFile(itemId);
  },
  onDeleteItemSucceeded: regroupFiles,
});

const getFile = (state, fileId) => {
  return safeGet(state, [fileDomain, 'data', 'files', fileId]);
};
const {
  actions: downloadFileActions,
  selectors: downloadFileSelectors,
  reducer: downloadFileReducer,
  saga: downloadFileSaga,
} = createRequest(fileDomain, 'downloadFile', {
  watchEvery: true,
  onReducerSucceeded: (state, { payload, data }) => {
    const newState = safeSet(state, ['data', 'files', payload.fileId], data);
    return newState;
  },
  preRequest: function* ({ fileId }) {
    const file = yield select(getFile, fileId);
    return { continueCall: !file };
  },
  request: async ({ fileId }) => {
    return downloadFile(fileId);
  },
});

const getThumbnail = (state, fileId) => {
  return safeGet(state, [fileDomain, 'data', 'thumbnail', fileId]);
};
const {
  actions: downloadThumbnailActions,
  selectors: downloadThumbnailSelectors,
  reducer: downloadThumbnailReducer,
  saga: downloadThumbnailSaga,
} = createRequest(fileDomain, 'downloadThumbnail', {
  watchEvery: true,
  onReducerSucceeded: (state, { payload, data }) => {
    const newState = safeSet(state, ['data', 'thumbnail', payload.fileId], data);
    return newState;
  },
  preRequest: function* ({ fileId }) {
    const file = yield select(getThumbnail, fileId);
    return { continueCall: !file };
  },
  request: async ({ fileId }) => {
    return downloadThumbnail(fileId);
  },
});

const getSettings = state => {
  return safeGet(state, [fileDomain, 'data', 'settings']);
};
const {
  actions: fetchSettingsActions,
  selectors: fetchSettingsSelectors,
  reducer: fetchSettingsReducer,
  saga: fetchSettingsSaga,
} = createRequest(fileDomain, 'fetchSettings', {
  onReducerSucceeded: (state, { data }) => {
    const newState = safeSet(state, ['data', 'settings'], data);
    return newState;
  },
  request: async () => {
    return fetchSettings();
  },
});

export const fileActions = {
  fetchItemsRequested: actions.fetchItems.requested.action,
  fetchItemRequested: actions.fetchItem.requested.action,
  createRequested: actions.createItem.requested.action,
  deleteRequested: actions.deleteItem.requested.action,
  downloadFileRequested: downloadFileActions.requested.action,
  downloadThumbnailRequested: downloadThumbnailActions.requested.action,
  fetchSettingsRequested: fetchSettingsActions.requested.action,
};

export const fileSelectors = {
  ...selectors,
  downloadFile: downloadFileSelectors,
  downloadThumbnail: downloadThumbnailSelectors,
  fetchSettings: fetchSettingsSelectors,
  data: {
    ...dataSelectors,
    getGroupItems: state => safeGet(state, [fileDomain, 'data', defaultId, `groupItems`]),
    getFile,
    getThumbnail,
    getSettings,
  },
};

export const fileReducer = mergeReducers([
  reducer,
  downloadFileReducer,
  downloadThumbnailReducer,
  fetchSettingsReducer,
]);

export const fileSagas = mergeSagas([
  saga,
  downloadFileSaga,
  downloadThumbnailSaga,
  fetchSettingsSaga,
]);
