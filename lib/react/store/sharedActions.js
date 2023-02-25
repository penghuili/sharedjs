export const sharedActionTypes = {
  SET_THEME_MODE: 'shared/SET_THEME_MODE',
  SET_TOAST: 'app/SET_TOAST',
  GO_BACK: 'shared/GO_BACK',
  NAVIGATE: 'shared/NAVIGATE',
  RESET: 'app/RESET',
  CHNAGE_THEME_MODE_PRESSED: 'shared/CHNAGE_THEME_MODE_PRESSED',

  // auth
  IS_CHECKING_REFRESH_TOKEN: 'shared/IS_CHECKING_REFRESH_TOKEN',
  IS_LOGGED_IN: 'shared/IS_LOGGED_IN',
  IS_LOADING_AUTH: 'shared/IS_LOADING_AUTH',
  SET_AUTH_ERROR: 'shared/SET_AUTH_ERROR',
  SIGN_UP_PRESSED: 'shared/SIGN_UP_PRESSED',
  SIGN_IN_PRESSED: 'shared/SIGN_IN_PRESSED',
  LOG_OUT_PRESSED: 'shared/LOG_OUT_PRESSED',
  LOG_OUT_FROM_ALL_DEVICES_PRESSED: 'shared/LOG_OUT_FROM_ALL_DEVICES_PRESSED',

  // account
  IS_LOADING_ACCOUNT: 'shared/IS_LOADING_ACCOUNT',
  SET_USER_DATA: 'shared/SET_USER_DATA',
  FETCH_ACCOUNT_REQUESTED: 'shared/FETCH_ACCOUNT_REQUESTED',
  DELETE_ACCOUNT_PRESSED: 'shared/DELETE_ACCOUNT_PRESSED',
  CHANGE_PASSWORD_PRESSED: 'shared/CHANGE_PASSWORD_PRESSED',
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
  navigate(path) {
    return { type: sharedActionTypes.NAVIGATE, payload: { path } };
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
  logOutPressed() {
    return { type: sharedActionTypes.LOG_OUT_PRESSED };
  },
  logOutFromAllDevicesPressed() {
    return { type: sharedActionTypes.LOG_OUT_FROM_ALL_DEVICES_PRESSED };
  },

  isLoadingAccount(loading) {
    return { type: sharedActionTypes.IS_LOADING_ACCOUNT, payload: { loading } };
  },
  setUserData({ userId, username, createdAt, botPublicKey }) {
    return {
      type: sharedActionTypes.SET_USER_DATA,
      payload: { userId, username, createdAt, botPublicKey },
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
};
