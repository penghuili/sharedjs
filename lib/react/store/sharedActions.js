export const sharedActionTypes = {
  SET_THEME_MODE: 'shared/SET_THEME_MODE',
  SET_TOAST: 'shared/SET_TOAST',
  GO_BACK: 'shared/GO_BACK',
  NAVIGATE: 'shared/NAVIGATE',
  RESET: 'shared/RESET',
  CHNAGE_THEME_MODE_PRESSED: 'shared/CHNAGE_THEME_MODE_PRESSED',

  // auth
  IS_CHECKING_REFRESH_TOKEN: 'shared/IS_CHECKING_REFRESH_TOKEN',
  IS_LOGGED_IN: 'shared/IS_LOGGED_IN',
  IS_LOADING_AUTH: 'shared/IS_LOADING_AUTH',
  SET_AUTH_ERROR: 'shared/SET_AUTH_ERROR',
  SIGN_UP_PRESSED: 'shared/SIGN_UP_PRESSED',
  SIGN_IN_PRESSED: 'shared/SIGN_IN_PRESSED',
  SKIP_2FA_PRESSED: 'shared/SKIP_2FA_PRESSED',
  VERIFY_2FA_PRESSED: 'shared/VERIFY_2FA_PRESSED',
  GENERATE_2FA_SECRET_PRESSED: 'shared/GENERATE_2FA_SECRET_PRESSED',
  SET_2FA_URI: 'shared/SET_2FA_URI',
  ENABLE_2FA_PRESSED: 'shared/ENABLE_2FA_PRESSED',
  DISABLE_2FA_PRESSED: 'shared/DISABLE_2FA_PRESSED',
  LOG_OUT_PRESSED: 'shared/LOG_OUT_PRESSED',
  LOG_OUT_FROM_ALL_DEVICES_PRESSED: 'shared/LOG_OUT_FROM_ALL_DEVICES_PRESSED',

  // account
  IS_LOADING_ACCOUNT: 'shared/IS_LOADING_ACCOUNT',
  SET_USER_DATA: 'shared/SET_USER_DATA',
  FETCH_ACCOUNT_REQUESTED: 'shared/FETCH_ACCOUNT_REQUESTED',
  DELETE_ACCOUNT_PRESSED: 'shared/DELETE_ACCOUNT_PRESSED',
  CHANGE_PASSWORD_PRESSED: 'shared/CHANGE_PASSWORD_PRESSED',

  FETCH_SETTINGS_REQUESTED: 'shared/FETCH_SETTINGS_REQUESTED',
  FETCH_SETTINGS_FINISHED: 'shared/FETCH_SETTINGS_FINISHED',
  TRY_PRESSED: 'shared/TRY_PRESSED',
  IS_TRYING: 'shared/IS_TRYING',
  TRY_SUCCEEDED: 'shared/TRY_SUCCEEDED',
  IS_LOADING_SETTINGS: 'shared/IS_LOADING_SETTINGS',
  SET_SETTINGS: 'shared/SET_SETTINGS',
};

export const sharedActionCreators = {
  setThemeMode(themeMode) {
    return { type: sharedActionTypes.SET_THEME_MODE, payload: { themeMode } };
  },
  setToast(message, type) {
    return { type: sharedActionTypes.SET_TOAST, payload: { message, type } };
  },
  reset() {
    return { type: sharedActionTypes.RESET };
  },
  goBack() {
    return { type: sharedActionTypes.GO_BACK };
  },
  navigate(path, isReplace) {
    return { type: sharedActionTypes.NAVIGATE, payload: { path, isReplace } };
  },
  changeThemeModePressed(themeMode) {
    return { type: sharedActionTypes.CHNAGE_THEME_MODE_PRESSED, payload: { themeMode } };
  },

  isCheckingRefreshToken(isChecking) {
    return { type: sharedActionTypes.IS_CHECKING_REFRESH_TOKEN, payload: { isChecking } };
  },
  isLoggedIn(loggedIn) {
    return {
      type: sharedActionTypes.IS_LOGGED_IN,
      payload: { loggedIn },
    };
  },
  isLoadingAuth(loading) {
    return {
      type: sharedActionTypes.IS_LOADING_AUTH,
      payload: { loading },
    };
  },
  setAuthError(errorMessage) {
    return {
      type: sharedActionTypes.SET_AUTH_ERROR,
      payload: { errorMessage },
    };
  },
  signUpPressed(username, password) {
    return { type: sharedActionTypes.SIGN_UP_PRESSED, payload: { username, password } };
  },
  signInPressed(username, password) {
    return { type: sharedActionTypes.SIGN_IN_PRESSED, payload: { username, password } };
  },
  verify2FAPressed(code) {
    return { type: sharedActionTypes.VERIFY_2FA_PRESSED, payload: { code } };
  },
  skip2FAPressed() {
    return { type: sharedActionTypes.SKIP_2FA_PRESSED };
  },
  generate2FASecretPressed() {
    return { type: sharedActionTypes.GENERATE_2FA_SECRET_PRESSED };
  },
  set2FAUri(uri) {
    return { type: sharedActionTypes.SET_2FA_URI, payload: { uri } };
  },
  enable2FAPressed(code) {
    return { type: sharedActionTypes.ENABLE_2FA_PRESSED, payload: { code } };
  },
  disable2FAPressed(code) {
    return { type: sharedActionTypes.DISABLE_2FA_PRESSED, payload: { code } };
  },
  logOutPressed() {
    return { type: sharedActionTypes.LOG_OUT_PRESSED };
  },
  logOutFromAllDevicesPressed() {
    return { type: sharedActionTypes.LOG_OUT_FROM_ALL_DEVICES_PRESSED };
  },

  isLoadingAccount(value) {
    return { type: sharedActionTypes.IS_LOADING_ACCOUNT, payload: { value } };
  },
  setUserData({
    userId,
    username,
    twoFactorChecked,
    twoFactorEnabled,
    twoFactorUri,
    createdAt,
    botPublicKey,
  }) {
    return {
      type: sharedActionTypes.SET_USER_DATA,
      payload: {
        userId,
        username,
        twoFactorChecked,
        twoFactorEnabled,
        twoFactorUri,
        createdAt,
        botPublicKey,
      },
    };
  },
  fetchAccountRequested() {
    return { type: sharedActionTypes.FETCH_ACCOUNT_REQUESTED };
  },
  deleteAccountPressed() {
    return { type: sharedActionTypes.DELETE_ACCOUNT_PRESSED };
  },
  changePasswordPressed(currentPassword, newPassword) {
    return {
      type: sharedActionTypes.CHANGE_PASSWORD_PRESSED,
      payload: { currentPassword, newPassword },
    };
  },
  fetchSettingsRequested(app, silent) {
    return { type: sharedActionTypes.FETCH_SETTINGS_REQUESTED, payload: { app, silent } };
  },
  fetchSettingsFinished(app) {
    return { type: sharedActionTypes.FETCH_SETTINGS_FINISHED, payload: { app } };
  },
  tryPressed(app) {
    return {
      type: sharedActionTypes.TRY_PRESSED,
      payload: { app },
    };
  },
  isTrying(value) {
    return {
      type: sharedActionTypes.IS_TRYING,
      payload: { value },
    };
  },
  trySucceeded(app) {
    return {
      type: sharedActionTypes.TRY_SUCCEEDED,
      payload: { app },
    };
  },
  isLoadingSettings(value) {
    return { type: sharedActionTypes.IS_LOADING_SETTINGS, payload: { value } };
  },
  setSettings(settings) {
    return {
      type: sharedActionTypes.SET_SETTINGS,
      payload: { settings },
    };
  },
};
