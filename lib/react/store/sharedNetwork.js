import apps from '../../js/apps';
import {
  decryptMessage,
  decryptMessageSymmetric,
  encryptMessageSymmetric,
  generateKeypair,
} from '../../js/encryption';
import { LocalStorage, sharedLocalStorageKeys } from '../../js/LocalStorage';
import HTTP from '../../react/HTTP';

export async function checkRefreshToken() {
  const expiresAt = LocalStorage.get(sharedLocalStorageKeys.accessTokenExpiresAt);
  const refreshTokenInStore = LocalStorage.get(sharedLocalStorageKeys.refreshToken);
  const accessTokenInStore = LocalStorage.get(sharedLocalStorageKeys.accessToken);
  if (!refreshTokenInStore || !accessTokenInStore || !expiresAt) {
    return { data: null, error: new Error('no tokens') };
  }

  try {
    const { id, accessToken, refreshToken, expiresIn } = await HTTP.publicPost(
      apps.auth,
      `/v1/sign-in/refresh`,
      {
        refreshToken: refreshTokenInStore,
      }
    );
    return { data: { id, accessToken, refreshToken, expiresIn }, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function signUp(username, password) {
  try {
    const { publicKey, privateKey } = await generateKeypair(username);
    const encryptedPrivateKey = await encryptMessageSymmetric(password, privateKey);

    const { id: userId } = await HTTP.publicPost(apps.auth, `/v1/sign-up`, {
      username,
      publicKey,
      encryptedPrivateKey,
    });

    return { data: { userId }, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function signIn(username, password) {
  try {
    const { publicKey, encryptedPrivateKey, encryptedChallenge } = await HTTP.publicGet(
      apps.auth,
      `/v1/me-public/${username}`
    );
    const privateKey = await decryptMessageSymmetric(password, encryptedPrivateKey);
    const challenge = await decryptMessage(privateKey, encryptedChallenge);
    const tokens = await HTTP.publicPost(apps.auth, `/v1/sign-in`, {
      username,
      signinChallenge: challenge,
    });

    LocalStorage.saveTokens({ ...tokens, publicKey, privateKey });

    return { data: { userId: tokens.id }, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error };
  }
}

export async function logoutFromAllDevices() {
  try {
    await HTTP.post(apps.auth, `/v1/log-out-all`);

    LocalStorage.resetTokens();

    return { data: { success: true }, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function fetchAccount() {
  try {
    const { id, username, createdAt, updatedAt, backendPublicKey } = await HTTP.get(
      apps.auth,
      `/v1/me`
    );

    return {
      data: {
        userId: id,
        username,
        createdAt,
        updatedAt,
        botPublicKey: JSON.parse(`"${backendPublicKey}"`),
      },
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export async function deleteAccount() {
  try {
    await HTTP.delete(apps.auth, `/v1/me`);

    return { data: { success: true }, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error };
  }
}

export async function changePassword(username, currentPassword, newPassword) {
  try {
    const { encryptedPrivateKey, encryptedChallenge } = await HTTP.publicGet(
      apps.auth,
      `/v1/me-public/${username}`
    );
    const privateKey = await decryptMessageSymmetric(currentPassword, encryptedPrivateKey);
    const challenge = await decryptMessage(privateKey, encryptedChallenge);
    const updatedEncryptedPrivateKey = await encryptMessageSymmetric(newPassword, privateKey);
    const updatedUser = await HTTP.post(apps.auth, `/v1/me/password`, {
      encryptedPrivateKey: updatedEncryptedPrivateKey,
      signinChallenge: challenge,
    });

    return { data: updatedUser, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error };
  }
}
