export let logo = null;
export let app = null;
export let encryptionUrl = null;
export let privacyUrl = null;
export let termsUrl = null;

function initShared({
  logo: appLogo,
  app: appApp,
  encryptionUrl: appEncryptionUrl = 'https://peng37.com/encryption/',
  privacyUrl: appPrivacyUrl = 'https://peng37.com/privacy/',
  termsUrl: appTermsUrl = 'https://peng37.com/terms/',
}) {
  logo = appLogo;
  app = appApp;
  encryptionUrl = appEncryptionUrl;
  privacyUrl = appPrivacyUrl;
  termsUrl = appTermsUrl;
}

export default initShared;
