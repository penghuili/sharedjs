export let logo = null;
export let app = null;

function initShared({ logo: appLogo, app: appApp }) {
  logo = appLogo;
  app = appApp;
}

export default initShared;
