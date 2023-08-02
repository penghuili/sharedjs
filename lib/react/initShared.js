export let logo = null;
export let app = null;
export let showTerms = false;

function initShared({ logo: appLogo, app: appApp, showTerms: appShowTerms }) {
  logo = appLogo;
  app = appApp;
  showTerms = appShowTerms;
}

export default initShared;
