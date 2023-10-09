import { call, put, select, take } from 'redux-saga/effects';

import { safeGet, safeSet } from '../../../js/object';
import {
  createDataSelectors,
  createGeneralStore,
  createRequest,
  defaultId,
  mergeReducers,
  mergeSagas,
} from '../storeHelpers';
import { downloadFile, downloadThumbnail, fetchFile, updateFile, uploadFile } from './fileNetwork';
import { removeFileFromPost } from './filePostNetwork';

export const fileDomain = 'file';

const dataSelectors = {
  ...createDataSelectors(fileDomain),
  getItem: (state, fileId) => safeGet(state, [fileDomain, 'data', defaultId, 'fileMetas', fileId]),
};

const { actions, selectors, reducer, saga } = createGeneralStore(fileDomain, {
  preFetchItem: function* ({ itemId }) {
    const file = yield select(dataSelectors.getItem, itemId);
    if (file) {
      return { continueCall: false };
    }
    return { continueCall: true };
  },
  fetchItem: async ({ itemId }) => {
    return fetchFile(itemId);
  },
  onFetchItemSucceeded: (state, { payload, data }) => {
    const newState = safeSet(state, ['data', defaultId, 'fileMetas', payload.itemId], data);
    return newState;
  },
  createItem: function* ({ postId, startItemId, file, note, onSucceeded }) {
    const result = yield call(uploadFile, file, note, postId, startItemId);

    if (result.data) {
      if (onSucceeded) {
        onSucceeded(result.data);
      }
    }

    return result;
  },
  onCreateItemSucceeded: (state, { payload, data: { file } }) => {
    const newState = safeSet(state, ['data', defaultId, 'fileMetas', payload.itemId], file);
    return newState;
  },
  preUpdateItem: function* ({ itemId, note }) {
    let file = yield select(dataSelectors.getItem, itemId);
    if (!file) {
      yield put({ type: `${fileDomain}/fetchItem/REQUESTED`, payload: { itemId } });
      yield take(`${fileDomain}/fetchItem/SUCCEEDED`);
      file = yield select(dataSelectors.getStandaloneItem);
    }

    return { continueCall: !!file && file.note !== note, result: file };
  },
  updateItem: async ({ itemId, note }, file) => {
    return updateFile(itemId, { note }, file.decryptedPassword);
  },
  onUpdateItemSucceeded: (state, { payload, data }) => {
    const newState = safeSet(state, ['data', defaultId, 'fileMetas', payload.itemId], data);
    return newState;
  },
  deleteItem: async ({ itemId, fileId, onSucceeded }) => {
    const result = await removeFileFromPost(itemId, [fileId]);
    if (onSucceeded && result.data) {
      onSucceeded(itemId);
    }

    return result;
  },
  onDeleteItemSucceeded: (state, { payload }) => {
    const newState = safeSet(state, ['data', defaultId, 'fileMetas', payload.itemId], null);
    return newState;
  },
});

const getRawFile = (state, fileId) => {
  return safeGet(state, [fileDomain, 'data', 'rawFiles', fileId]);
};
const {
  actions: downloadFileActions,
  selectors: downloadFileSelectors,
  reducer: downloadFileReducer,
  saga: downloadFileSaga,
} = createRequest(fileDomain, 'downloadFile', {
  watchEvery: true,
  onReducerSucceeded: (state, { payload, data }) => {
    const newState = safeSet(state, ['data', 'rawFiles', payload.fileId], data);
    return newState;
  },
  preRequest: function* ({ fileId }) {
    const file = yield select(getRawFile, fileId);
    return { continueCall: !file };
  },
  request: async ({ fileId, onSucceeded }) => {
    const result = await downloadFile(fileId);
    if (onSucceeded && result.data) {
      onSucceeded(result.data);
    }

    return result;
  },
});

const getThumbnail = (state, fileId) => {
  return safeGet(state, [fileDomain, 'data', 'thumbnails', fileId]);
};
const {
  actions: downloadThumbnailActions,
  selectors: downloadThumbnailSelectors,
  reducer: downloadThumbnailReducer,
  saga: downloadThumbnailSaga,
} = createRequest(fileDomain, 'downloadThumbnail', {
  watchEvery: true,
  onReducerSucceeded: (state, { payload, data }) => {
    const newState = safeSet(state, ['data', 'thumbnails', payload.fileId], data);
    return newState;
  },
  preRequest: function* ({ fileId }) {
    const file = yield select(getThumbnail, fileId);
    return { continueCall: !file };
  },
  request: async ({ fileId, fileMeta }) => {
    return downloadThumbnail(fileId, fileMeta);
  },
});

export const fileActions = {
  fetchItemsRequested: actions.fetchItems.requested.action,
  fetchItemRequested: actions.fetchItem.requested.action,
  createRequested: actions.createItem.requested.action,
  updateRequested: actions.updateItem.requested.action,
  deleteRequested: actions.deleteItem.requested.action,
  downloadFileRequested: downloadFileActions.requested.action,
  downloadThumbnailRequested: downloadThumbnailActions.requested.action,
};

export const fileSelectors = {
  ...selectors,
  downloadFile: downloadFileSelectors,
  downloadThumbnail: downloadThumbnailSelectors,
  data: {
    ...dataSelectors,
    getItem: (state, fileId) =>
      safeGet(state, [fileDomain, 'data', defaultId, 'fileMetas', fileId]),
    getGroupItems: state => safeGet(state, [fileDomain, 'data', defaultId, `groupItems`]),
    getRawFile,
    getThumbnail,
  },
};

export const fileReducer = mergeReducers([reducer, downloadFileReducer, downloadThumbnailReducer]);

export const fileSagas = mergeSagas([saga, downloadFileSaga, downloadThumbnailSaga]);
