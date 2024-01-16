import { LocalStorage, sharedLocalStorageKeys } from '../../../js/LocalStorage';
import { apps } from '../../../js/apps';
import { asyncForEach } from '../../../js/asyncForEach';
import {
  decryptMessageAsymmetric,
  decryptMessageSymmetric,
  encryptMessageAsymmetric,
  encryptMessageSymmetric,
} from '../../../js/encryption';
import { generatePassword } from '../../../js/generatePassword';
import HTTP from '../../HTTP';

export async function fetchGroups(prefix) {
  try {
    const groups = await HTTP.get(apps.group37, `/v1/groups?prefix=${prefix}`);

    const decryptedGroups = [];
    // I have fucking no idea why i cannot use asyncForAll here, ios safari just doesn't like it
    await asyncForEach(groups, async item => {
      const decrypted = await decryptGroupContent(item);
      decryptedGroups.push(decrypted);
    });

    return {
      data: { items: decryptedGroups },
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export async function fetchGroup(groupId) {
  try {
    const group = await HTTP.get(apps.group37, `/v1/groups/${groupId}`);

    const decrypted = await decryptGroupContent(group);

    return {
      data: decrypted,
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export async function createGroup(title, sortKeyPrefix, isNoGroup) {
  try {
    const password = generatePassword(20, true);
    const encryptedTitle = await encryptMessageSymmetric(password, title);
    const encryptedPassword = await encryptMessageAsymmetric(
      LocalStorage.get(sharedLocalStorageKeys.publicKey),
      password
    );

    const group = await HTTP.post(apps.group37, `/v1/groups`, {
      title: encryptedTitle,
      password: encryptedPassword,
      sortKeyPrefix,
      isNoGroup,
    });

    const decrypted = await decryptGroupContent(group);

    return {
      data: decrypted,
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateGroup(groupId, { title, position, isSecondary }, decryptedPassword) {
  try {
    const encryptedTitle = title
      ? await encryptMessageSymmetric(decryptedPassword, title)
      : undefined;

    const group = await HTTP.put(apps.group37, `/v1/groups/${groupId}`, {
      title: encryptedTitle,
      position,
      isSecondary,
    });

    const decrypted = await decryptGroupContent(group);

    return {
      data: decrypted,
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export async function deleteGroup(groupId) {
  try {
    const result = await HTTP.delete(apps.group37, `/v1/groups/${groupId}`);

    return {
      data: result,
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export async function createGroupItem(groupId, { createdAt, sourceId, sourceSortKey }) {
  try {
    const item = await HTTP.post(apps.group37, `/v1/groups/${groupId}/items`, {
      createdAt,
      sourceId,
      sourceSortKey,
    });

    return {
      data: item,
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export async function deleteGroupItem(groupId, itemId) {
  try {
    const result = await HTTP.delete(apps.group37, `/v1/groups/${groupId}/items/${itemId}`);

    return {
      data: result,
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

async function decryptGroupContent(group) {
  const decryptedPassword = await decryptMessageAsymmetric(
    LocalStorage.get(sharedLocalStorageKeys.privateKey),
    group.password
  );

  const decryptedTitle = await decryptMessageSymmetric(decryptedPassword, group.title);

  return { ...group, title: decryptedTitle, decryptedPassword };
}
