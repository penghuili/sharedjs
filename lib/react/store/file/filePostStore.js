import { call, put, select, take } from 'redux-saga/effects';
import { sharedActionCreators } from '../sharedActions';
import {
  createDataSelectors,
  createGeneralStore,
  mergeReducers,
  updateStandaloneItemAndItems,
} from '../storeHelpers';
import { createPost, deletePost, fetchPost, fetchPosts, updatePost } from './filePostNetwork';
import { fileDomain } from './fileStore';

export const filePostDomain = 'filePost';

const dataSelectors = createDataSelectors(filePostDomain);

const { actions, selectors, reducer, saga } = createGeneralStore(filePostDomain, {
  preFetchItems: function* (payload) {
    const files = yield select(dataSelectors.getItems);
    if (!payload?.force && files.length) {
      return { continueCall: false };
    }
    return { continueCall: true };
  },
  fetchItems: async ({ startKey, groupId, startTime, endTime }) => {
    return fetchPosts({ startKey, groupId, startTime, endTime });
  },
  fetchItem: async ({ itemId }) => {
    return fetchPost(itemId);
  },
  createItem: function* ({ date, note, groups, onSucceeded }) {
    const result = yield call(createPost, { date, note, groups });

    if (result.data) {
      onSucceeded(result.data);
    }

    return result;
  },
  preUpdateItem: function* ({ itemId, note }) {
    let post = yield select(dataSelectors.getStandaloneItem);
    if (!post || post.sortKey !== itemId) {
      yield put({ type: `${filePostDomain}/fetchItem/REQUESTED`, payload: { itemId } });
      yield take(`${filePostDomain}/fetchItem/SUCCEEDED`);
      post = yield select(dataSelectors.getStandaloneItem);
    }

    return { continueCall: !!post && post.note !== note, result: post };
  },
  updateItem: function* ({ itemId, note }, post) {
    const result = yield call(updatePost, itemId, { note }, post.decryptedPassword);
    if (result.data) {
      yield put(sharedActionCreators.setToast('Post is encrypted and saved in server.'));
    }

    return result;
  },
  deleteItem: async ({ itemId, onSucceeded }) => {
    const result = await deletePost(itemId);
    if (onSucceeded && result.data) {
      onSucceeded(itemId);
    }

    return result;
  },
});

const customReducer = (state, action) => {
  switch (action.type) {
    case `${fileDomain}/createItem/SUCCEEDED`:
    case `note/createItem/SUCCEEDED`: {
      const {
        payload: {
          data: { post },
        },
      } = action;
      if (post) {
        return updateStandaloneItemAndItems(state, post);
      }
      return state;
    }

    case `${fileDomain}/deleteItem/SUCCEEDED`:
    case `note/deleteItem/SUCCEEDED`: {
      const {
        payload: { data },
      } = action;
      return updateStandaloneItemAndItems(state, data);
    }
    default:
      return state;
  }
};

export const filePostActions = {
  fetchItemsRequested: actions.fetchItems.requested.action,
  fetchItemRequested: actions.fetchItem.requested.action,
  createRequested: actions.createItem.requested.action,
  updateRequested: actions.updateItem.requested.action,
  deleteRequested: actions.deleteItem.requested.action,
};

export const filePostSelectors = {
  ...selectors,
  data: dataSelectors,
};

export const filePostReducer = mergeReducers([reducer, customReducer]);

export const filePostSagas = saga;
