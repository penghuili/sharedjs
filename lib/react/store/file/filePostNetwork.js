import { LocalStorage, sharedLocalStorageKeys } from '../../../js/LocalStorage';
import apps from '../../../js/apps';
import asyncForEach from '../../../js/asyncForEach';
import {
  decryptMessage,
  decryptMessageSymmetric,
  encryptMessage,
  encryptMessageSymmetric,
} from '../../../js/encryption';
import generatePassword from '../../../js/generatePassword';
import HTTP from '../../HTTP';
import { objectToQueryString } from '../../routeHelpers';
import { decryptFileContent } from './fileNetwork';

export async function fetchPosts({ startKey, groupId, startTime, endTime }) {
  try {
    const queryString = objectToQueryString({
      startKey,
      groupId,
      startTime,
      endTime,
    });

    const {
      items,
      startKey: newStartKey,
      limit,
    } = await HTTP.get(apps.file37.name, `/v1/posts${queryString ? `?${queryString}` : ''}`);

    const decryptedItems = [];
    await asyncForEach(items, async item => {
      try {
        const decryptedItem = await decryptPostContent(item);
        decryptedItems.push(decryptedItem);
      } catch (e) {
        console.error(e, item);
      }
    });

    return {
      data: {
        items: decryptedItems,
        startKey: newStartKey,
        hasMore: decryptedItems.length >= limit,
      },
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export async function fetchPost(postId) {
  try {
    const post = await HTTP.get(apps.file37.name, `/v1/posts/${postId}`);

    const decrypted = await decryptPostContent(post);

    return {
      data: decrypted,
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export async function createPost({ date, note, files, groups }) {
  try {
    const password = generatePassword(20, true);
    const encryptedNote = note ? await encryptMessageSymmetric(password, note) : undefined;
    const encryptedPassword = await encryptMessage(
      LocalStorage.get(sharedLocalStorageKeys.publicKey),
      password
    );
    const post = await HTTP.post(apps.file37.name, `/v1/posts`, {
      password: encryptedPassword,
      date,
      note: encryptedNote,
      files,
      groups,
    });

    const decrypted = await decryptPostContent(post);

    return {
      data: decrypted,
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updatePost(postId, { note }, decryptedPassword) {
  try {
    const encryptedNote = note ? await encryptMessageSymmetric(decryptedPassword, note) : undefined;
    const post = await HTTP.put(apps.file37.name, `/v1/posts/${postId}`, { note: encryptedNote });

    const decrypted = await decryptPostContent(post);

    return {
      data: decrypted,
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export async function addFilesToPost(postId, files, startItemId) {
  try {
    const post = await HTTP.put(apps.file37.name, `/v1/posts/${postId}/files`, {
      files,
      startFile: startItemId,
    });

    const decrypted = await decryptPostContent(post);

    return {
      data: decrypted,
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export async function removeFileFromPost(postId, fileId) {
  try {
    const post = await HTTP.delete(apps.file37.name, `/v1/posts/${postId}/files/${fileId}`);

    const decrypted = await decryptPostContent(post);

    return {
      data: decrypted,
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export async function deletePost(postId) {
  try {
    await HTTP.delete(apps.file37.name, `/v1/posts/${postId}`);

    return { data: { id: postId }, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

async function decryptPostContent(post) {
  const decryptedPostPassword = await decryptMessage(
    LocalStorage.get(sharedLocalStorageKeys.privateKey),
    post.password
  );

  const decryptedNote = post.note
    ? await decryptMessageSymmetric(decryptedPostPassword, post.note)
    : null;

  const items = [];
  if (post.items?.length) {
    await asyncForEach(post.items, async item => {
      if (item.type === 'note') {
        const note = item.note;
        const decryptedNotePassword = await decryptMessage(
          LocalStorage.get(sharedLocalStorageKeys.privateKey),
          note.password
        );
        const decryptedNote = note.note
          ? await decryptMessageSymmetric(decryptedNotePassword, note.note)
          : null;

        items.push({
          ...item,
          note: {
            ...note,
            note: decryptedNote,
            decryptedPassword: decryptedNotePassword,
          },
        });
      } else {
        if (item.fileMeta) {
          const decryptedFileMeta = await decryptFileContent(item.fileMeta);
          items.push({
            ...item,
            fileMeta: decryptedFileMeta,
          });
        } else {
          items.push(item);
        }
      }
    });
  }

  return { ...post, note: decryptedNote, decryptedPassword: decryptedPostPassword, items };
}
