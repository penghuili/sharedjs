export let logo = null;
export let app = null;
export let privacyUrl = 'https://encrypt37.com/privacy/';
export let termsUrl = 'https://encrypt37.com/terms/';
export let showOneAccountForAll = true;

function initShared({
  logo: appLogo,
  app: appApp,
  privacyUrl: appPrivacyUrl,
  termsUrl: appTermsUrl,
  showOneAccountForAll: appShowOneAccountForAll = true,
}) {
  logo = appLogo;
  app = appApp;
  privacyUrl = appPrivacyUrl;
  termsUrl = appTermsUrl;
  showOneAccountForAll = appShowOneAccountForAll;
}

export default initShared;
