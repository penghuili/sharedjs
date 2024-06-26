import jwtDecode from 'jwt-decode';
import { LocalStorage, sharedLocalStorageKeys } from '../../js/LocalStorage';
import { apps } from '../../js/apps';
import { accessTokenThreshold } from '../../js/constants';
import {
  decryptMessageAsymmetric,
  decryptMessageSymmetric,
  encryptMessageSymmetric,
  generateKeypair,
} from '../../js/encryption';
import HTTP from '../../react/HTTP';

export async function checkRefreshToken() {
  const expiresAt = LocalStorage.get(sharedLocalStorageKeys.accessTokenExpiresAt);
  const refreshTokenInStore = LocalStorage.get(sharedLocalStorageKeys.refreshToken);
  const accessTokenInStore = LocalStorage.get(sharedLocalStorageKeys.accessToken);

  if (!refreshTokenInStore || !accessTokenInStore || !expiresAt) {
    return { isValid: false };
  }

  try {
    const decoded = jwtDecode(refreshTokenInStore);

    return { isValid: decoded.exp * 1000 - accessTokenThreshold * 1000 > Date.now() };
  } catch (error) {
    return { isValid: false };
  }
}

export async function signUp(username, email, password) {
  try {
    const { publicKey, privateKey } = await generateKeypair(username || email);
    const encryptedPrivateKey = await encryptMessageSymmetric(password, privateKey);

    const { id: userId } = await HTTP.publicPost(apps.Auth.name, `/v1/sign-up`, {
      username,
      email,
      publicKey,
      encryptedPrivateKey,
    });

    return { data: { userId }, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function signIn(username, email, password) {
  try {
    const { publicKey, encryptedPrivateKey, encryptedChallenge } = await HTTP.publicPost(
      apps.Auth.name,
      `/v1/me-public`,
      { email, username }
    );
    const privateKey = await decryptMessageSymmetric(password, encryptedPrivateKey);
    const challenge = await decryptMessageAsymmetric(privateKey, encryptedChallenge);
    const tokens = await HTTP.publicPost(apps.Auth.name, `/v1/sign-in`, {
      username,
      email,
      signinChallenge: challenge,
    });

    LocalStorage.saveTokens({ ...tokens, publicKey, privateKey });

    return { data: { userId: tokens.id, tempToken: tokens.tempToken }, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error };
  }
}

export async function verify2FA(code) {
  try {
    const tempToken = LocalStorage.get(sharedLocalStorageKeys.tempToken);

    const { id, accessToken, refreshToken, expiresIn } = await HTTP.publicPost(
      apps.Auth.name,
      `/v1/sign-in/2fa`,
      {
        tempToken,
        code,
      }
    );

    LocalStorage.saveTokens({ accessToken, refreshToken, expiresIn });
    LocalStorage.remove(sharedLocalStorageKeys.tempToken);

    return { data: { userId: id }, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function logoutFromAllDevices() {
  try {
    await HTTP.post(apps.Auth.name, `/v1/log-out-all`);

    LocalStorage.resetTokens();

    return { data: { success: true }, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function fetchAccount() {
  try {
    const {
      id,
      username,
      email,
      backendPublicKey,
      twoFactorEnabled,
      twoFactorChecked,
      twoFactorUri,
      createdAt,
      updatedAt,
    } = await HTTP.get(apps.Auth.name, `/v1/me`);

    const decryptedTwoFactorUri = twoFactorUri
      ? await decryptMessageAsymmetric(
          LocalStorage.get(sharedLocalStorageKeys.privateKey),
          twoFactorUri
        )
      : twoFactorUri;

    return {
      data: {
        userId: id,
        username,
        email,
        twoFactorChecked,
        twoFactorEnabled,
        twoFactorUri: decryptedTwoFactorUri,
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

export async function skip2FA() {
  try {
    const user = await HTTP.post(apps.Auth.name, `/v1/2fa/skip`, {});

    return { data: user, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function generate2FASecret() {
  try {
    const { uri } = await HTTP.post(apps.Auth.name, `/v1/2fa/secret`, {});

    return { data: { uri }, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function enable2FA(code) {
  try {
    const user = await HTTP.post(apps.Auth.name, `/v1/2fa/enable`, { code });

    return { data: user, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function disable2FA(code) {
  try {
    const user = await HTTP.post(apps.Auth.name, `/v1/2fa/disable`, { code });

    return { data: user, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function deleteAccount() {
  try {
    try {
      await HTTP.delete(apps['remiind.cc'].name, `/v1/me`);
    } catch (e) {
      console.log(e);
    }

    try {
      await HTTP.delete(apps.Link37.name, `/v1/me`);
    } catch (e) {
      console.log(e);
    }

    try {
      await HTTP.delete(apps.Watcher37.name, `/v1/me`);
    } catch (e) {
      console.log(e);
    }

    try {
      await HTTP.delete(apps.Encrypt37.name, `/v1/me`);
    } catch (e) {
      console.log(e);
    }

    await HTTP.delete(apps.Auth.name, `/v1/me`);

    return { data: { success: true }, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error };
  }
}

export async function changePassword(username, email, currentPassword, newPassword) {
  try {
    const { encryptedPrivateKey, encryptedChallenge } = await HTTP.publicPost(
      apps.Auth.name,
      `/v1/me-public`,
      {
        username,
        email,
      }
    );
    const privateKey = await decryptMessageSymmetric(currentPassword, encryptedPrivateKey);
    const challenge = await decryptMessageAsymmetric(privateKey, encryptedChallenge);
    const updatedEncryptedPrivateKey = await encryptMessageSymmetric(newPassword, privateKey);
    const updatedUser = await HTTP.post(apps.Auth.name, `/v1/me/password`, {
      encryptedPrivateKey: updatedEncryptedPrivateKey,
      signinChallenge: challenge,
    });

    return { data: updatedUser, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error };
  }
}

export async function fetchSettings(app) {
  try {
    const settings = await HTTP.get(app, `/v1/settings`);

    if (settings) {
      LocalStorage.set(`${app}-settings`, settings);
    }

    return { data: settings, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function tryApp(app) {
  try {
    const data = await HTTP.post(apps.Pay37.name, `/v1/try`, { app });

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
