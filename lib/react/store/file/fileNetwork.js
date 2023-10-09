import streamSaver from 'streamsaver';

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
import { addFilesToPost } from './filePostNetwork';

// TODO: why this doesn't work? I have to use the github version
// streamSaver.mitm = `${process.env.REACT_APP_ASSETS_FOR_CODE}/streamsave-sw.js`;

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

export async function uploadFile(file, note, postId, startItemId) {
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
    });
    const decrypted = await decryptFileContent(data);

    let post = null;
    if (postId) {
      const { data } = await addFilesToPost(postId, [fileId], startItemId);
      post = data;
    }

    return { data: { file: decrypted, post }, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function downloadThumbnail(fileId, fileMeta) {
  try {
    const {
      data: { thumbnailUrl },
    } = await fetchUrlsForDownload(fileId);
    if (!thumbnailUrl) {
      return { data: null, error: new Error('Thumbnail not found') };
    }

    const response = await fetch(thumbnailUrl);
    const unit8Array = await fetchResponseToUnit8Array(response);
    const decryptedFile = await decryptFile(unit8Array, fileMeta.decryptedPassword);
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

    const { data: fileMeta } = await fetchFile(fileId);
    const decryptedPassword = await decryptMessage(
      LocalStorage.get(sharedLocalStorageKeys.privateKey),
      fileMeta.password
    );

    const fileStream = streamSaver.createWriteStream(fileMeta.fileName);
    const writer = fileStream.getWriter();
    await asyncForEach(urls, async url => {
      const response = await fetch(url);
      const unit8Array = await fetchResponseToUnit8Array(response);
      const decryptedChunk = await decryptFile(unit8Array, decryptedPassword);
      writer.write(new Uint8Array(decryptedChunk));
    });
    writer.close();

    return { data: { success: true }, error: null };
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
