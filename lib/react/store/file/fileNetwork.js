import apps from '../../../js/apps';
import asyncForEach from '../../../js/asyncForEach';
import {
  CHUNK_SIZE,
  decryptFile,
  decryptMessage,
  decryptMessageSymmetric,
  encryptFile,
  encryptMessage,
  encryptMessageSymmetric,
} from '../../../js/encryption';
import generatePassword from '../../../js/generatePassword';
import { LocalStorage, sharedLocalStorageKeys } from '../../../js/LocalStorage';
import {
  blobToUnit8Array,
  fetchResponseToUnit8Array,
  generateImageThumbnail,
  inputFileToUnit8Array,
  isImage,
} from '../../file';
import HTTP from '../../HTTP';

async function fetchUrlsForUpload(count) {
  try {
    const { urls, thumbnailUrl, fileId } = await HTTP.get(
      apps.file37.name,
      `/v1/upload-url?count=${count}`
    );

    return { data: { urls, thumbnailUrl, fileId }, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

async function fetchUrlsForDownload(fileId) {
  try {
    const { urls, thumbnailUrl } = await HTTP.get(apps.file37.name, `/v1/download-url/${fileId}`);

    return { data: { urls, thumbnailUrl }, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function fetchFiles({ startKey, groupId, startTime, endTime }) {
  try {
    const startKeyQuery = startKey ? `startKey=${startKey}` : '';
    const groupIdQuery = groupId ? `groupId=${groupId}` : '';
    const startTimeQuery = startTime ? `startTime=${startTime}` : '';
    const endTimeQuery = endTime ? `endTime=${endTime}` : '';
    const queryString = [startKeyQuery, groupIdQuery, startTimeQuery, endTimeQuery]
      .filter(q => q)
      .join('&');
    const {
      items,
      startKey: newStartKey,
      limit,
    } = await HTTP.get(apps.file37.name, `/v1/files${queryString ? `?${queryString}` : ''}`);

    const decryptedItems = [];
    await asyncForEach(items, async item => {
      const decryptedItem = await decryptFileContent(item);
      decryptedItems.push(decryptedItem);
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

export async function fetchFile(fileId) {
  try {
    const file = await HTTP.get(apps.file37.name, `/v1/files/${fileId}`);

    const decrypted = await decryptFileContent(file);

    return {
      data: decrypted,
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateFile(fileId, { note }, decryptedPassword) {
  try {
    const encryptedNote = note ? await encryptMessageSymmetric(decryptedPassword, note) : undefined;
    const file = await HTTP.put(apps.file37.name, `/v1/files/${fileId}`, { note: encryptedNote });

    const decrypted = await decryptFileContent(file);

    return {
      data: decrypted,
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export async function uploadFile(file, note, groupIds) {
  try {
    const count = Math.ceil(file.size / CHUNK_SIZE);
    const {
      data: { urls, thumbnailUrl, fileId },
    } = await fetchUrlsForUpload(count);

    const password = generatePassword(20, true);

    await asyncForEach(urls, async (url, index) => {
      const chunk = file.slice(index * CHUNK_SIZE, (index + 1) * CHUNK_SIZE);
      const unit8Array = await inputFileToUnit8Array(chunk);
      const encryptedChunk = await encryptFile(unit8Array, password);

      await fetch(url, {
        method: 'PUT',
        body: encryptedChunk,
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      });
    });
    let thumbnail = false;
    if (isImage(file.type)) {
      const thumbnailBlob = await generateImageThumbnail(file);
      const thumbnailUnit8Array = await blobToUnit8Array(thumbnailBlob);
      const encryptedThumbnail = await encryptFile(thumbnailUnit8Array, password);

      await fetch(thumbnailUrl, {
        method: 'PUT',
        body: encryptedThumbnail,
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      });
      thumbnail = true;
    }

    const encryptedFileName = await encryptMessageSymmetric(password, file.name);
    const encryptedNote = note ? await encryptMessageSymmetric(password, note) : undefined;
    const encryptedPassword = await encryptMessage(
      LocalStorage.get(sharedLocalStorageKeys.publicKey),
      password
    );
    const data = await HTTP.post(apps.file37.name, `/v1/files`, {
      fileId,
      password: encryptedPassword,
      fileName: encryptedFileName,
      count,
      thumbnail,
      mimeType: file.type,
      size: file.size,
      lastModified: file.lastModified ? new Date(file.lastModified).getTime() : undefined,
      note: encryptedNote,
      groupIds,
    });
    const decrypted = await decryptFileContent(data);
    return { data: decrypted, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function downloadThumbnail(fileId) {
  try {
    const {
      data: { thumbnailUrl },
    } = await fetchUrlsForDownload(fileId);
    if (!thumbnailUrl) {
      return { data: null, error: new Error('Thumbnail not found') };
    }

    const fileMeta = await HTTP.get(apps.file37.name, `/v1/files/${fileId}`);
    const decryptedPassword = await decryptMessage(
      LocalStorage.get(sharedLocalStorageKeys.privateKey),
      fileMeta.password
    );

    const response = await fetch(thumbnailUrl);
    const unit8Array = await fetchResponseToUnit8Array(response);
    const decryptedFile = await decryptFile(unit8Array, decryptedPassword);
    const blob = new Blob([decryptedFile], { type: fileMeta.mimeType });
    const objectUrl = URL.createObjectURL(blob);

    return { data: { url: objectUrl, fileName: fileMeta.fileName }, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function downloadFile(fileId) {
  try {
    const {
      data: { urls },
    } = await fetchUrlsForDownload(fileId);

    const fileMeta = await HTTP.get(apps.file37.name, `/v1/files/${fileId}`);
    const decryptedPassword = await decryptMessage(
      LocalStorage.get(sharedLocalStorageKeys.privateKey),
      fileMeta.password
    );

    const { writable, readable } = new TransformStream();
    const writer = writable.getWriter();
    await asyncForEach(urls, async url => {
      const response = await fetch(url);
      const unit8Array = await fetchResponseToUnit8Array(response);
      const decryptedChunk = await decryptFile(unit8Array, decryptedPassword);
      writer.write(new Uint8Array(decryptedChunk));
    });

    writer.close();

    const blob = await new Response(readable).blob();
    const objectUrl = URL.createObjectURL(blob);

    return { data: { url: objectUrl, fileName: fileMeta.fileName }, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function deleteFile(fileId) {
  try {
    await HTTP.delete(apps.file37.name, `/v1/files/${fileId}`);

    return { data: { fileId }, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function fetchSettings() {
  try {
    const settings = await HTTP.get(apps.file37.name, `/v1/settings`);

    return {
      data: settings,
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

async function decryptFileContent(file) {
  const decryptedPassword = await decryptMessage(
    LocalStorage.get(sharedLocalStorageKeys.privateKey),
    file.password
  );

  const decryptedFileName = await decryptMessageSymmetric(decryptedPassword, file.fileName);
  const decryptedNote = file.note
    ? await decryptMessageSymmetric(decryptedPassword, file.note)
    : null;

  return { ...file, fileName: decryptedFileName, note: decryptedNote, decryptedPassword };
}
