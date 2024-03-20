export let logo = null;
export let app = null;
export let encryptionUrl = null;
export let privacyUrl = null;
export let termsUrl = null;
export let hasSettings = true;
export let isFreeApp = false;
export let showOneAccountForAll = true;

function initShared({
  logo: appLogo,
  app: appApp,
  encryptionUrl: appEncryptionUrl = 'https://peng37.com/encryption/',
  privacyUrl: appPrivacyUrl = 'https://peng37.com/privacy/',
  termsUrl: appTermsUrl = 'https://peng37.com/terms/',
  hasSettings: appHasSettings = true,
  isFreeApp: appIsFreeApp = false,
  showOneAccountForAll: appShowOneAccountForAll = true,
}) {
  logo = appLogo;
  app = appApp;
  encryptionUrl = appEncryptionUrl;
  privacyUrl = appPrivacyUrl;
  termsUrl = appTermsUrl;
  hasSettings = appHasSettings;
  isFreeApp = appIsFreeApp;
  showOneAccountForAll = appShowOneAccountForAll;
}

export default initShared;
