import { accessTokenThreshold } from './constants';

export const sharedLocalStorageKeys = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  accessTokenExpiresAt: 'accessTokenExpiresAt',
  tempToken: 'tempToken',
  publicKey: 'publicKey',
  privateKey: 'privateKey',

  themeMode: 'themeMode',
  redirectUrl: 'redirectUrl',
  pdfFileContent: 'pdfFileContent',
};

export const LocalStorage = {
  get(key) {
    return JSON.parse(localStorage.getItem(key));
  },
  set(key, value) {
    if (typeof value === 'undefined') {
      localStorage.setItem(key, JSON.stringify(null));
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },
  remove(key) {
    localStorage.removeItem(key);
  },
  clear() {
    localStorage.clear();
  },

  resetTokens() {
    LocalStorage.remove(sharedLocalStorageKeys.accessToken);
    LocalStorage.remove(sharedLocalStorageKeys.refreshToken);
    LocalStorage.remove(sharedLocalStorageKeys.accessTokenExpiresAt);
    LocalStorage.remove(sharedLocalStorageKeys.publicKey);
    LocalStorage.remove(sharedLocalStorageKeys.privateKey);
  },
  saveTokens({ accessToken, refreshToken, expiresIn, tempToken, publicKey, privateKey }) {
    LocalStorage.set(sharedLocalStorageKeys.accessToken, accessToken);
    LocalStorage.set(sharedLocalStorageKeys.refreshToken, refreshToken);
    LocalStorage.set(
      sharedLocalStorageKeys.accessTokenExpiresAt,
      Date.now() + (expiresIn - accessTokenThreshold) * 1000
    );
    LocalStorage.set(sharedLocalStorageKeys.tempToken, tempToken);
    if (publicKey && privateKey) {
      LocalStorage.set(sharedLocalStorageKeys.publicKey, publicKey);
      LocalStorage.set(sharedLocalStorageKeys.privateKey, privateKey);
    }
  },
};
