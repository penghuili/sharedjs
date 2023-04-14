import { LocalStorage, sharedLocalStorageKeys } from '../../js/LocalStorage';
import getBrowserThemeMode from '../../react-pure/getBrowserThemeMode';
import { sharedActionTypes } from './sharedActions';

export const toastTypes = {
  normal: 'normal',
  info: 'info',
  critical: 'critical',
};

const initialState = {
  themeMode: LocalStorage.get(sharedLocalStorageKeys.themeMode) || getBrowserThemeMode() || 'dark',
  toast: null,

  isCheckingRefreshToken: true,
  isLoggedIn: false,
  isLoadingAuth: false,
  errorMessage: null,

  isLoadingAccount: false,
  userId: null,
  username: null,
  twoFactorEnabled: false,
  twoFactorUri: null,
  createdAt: null,
  botPublicKey: null,

  isLoadingSettings: false,
  isTrying: false,
  settings: null,
};

function handleSetThemeMode(state, { themeMode }) {
  return { ...state, themeMode };
}

function handleSetToast(state, { message, type }) {
  return { ...state, toast: { message, type: type || toastTypes.normal } };
}

function handleIsCheckingRefreshToken(state, { isChecking }) {
  return { ...state, isCheckingRefreshToken: isChecking };
}

function handleIsLoggedIn(state, { loggedIn }) {
  return { ...state, isLoggedIn: loggedIn };
}

function handleIsLoadingAuth(state, { loading }) {
  return { ...state, isLoadingAuth: loading };
}

function handleSetAuthError(state, { errorMessage }) {
  return { ...state, errorMessage };
}

function handleSetUserData(
  state,
  { userId, username, twoFactorEnabled, twoFactorUri, createdAt, botPublicKey }
) {
  return { ...state, userId, username, twoFactorEnabled, twoFactorUri, createdAt, botPublicKey };
}

function handleSet2FAUri(state, { uri }) {
  return { ...state, twoFactorUri: uri };
}

function handleIsLoadingAccount(state, { value }) {
  return { ...state, isLoadingAccount: value };
}

function handleSetSettings(state, { settings }) {
  return { ...state, settings };
}

function handleIsLoadingSettings(state, { value }) {
  return { ...state, isLoadingSettings: value };
}

function handleIsTrying(state, { value }) {
  return { ...state, isTrying: value };
}

function handleReset() {
  return { ...initialState, isCheckingRefreshToken: false };
}

export function sharedReducer(state = initialState, action) {
  switch (action.type) {
    case sharedActionTypes.SET_THEME_MODE:
      return handleSetThemeMode(state, action.payload);

    case sharedActionTypes.SET_TOAST:
      return handleSetToast(state, action.payload);

    case sharedActionTypes.IS_CHECKING_REFRESH_TOKEN:
      return handleIsCheckingRefreshToken(state, action.payload);

    case sharedActionTypes.SET_USER_DATA:
      return handleSetUserData(state, action.payload);

    case sharedActionTypes.SET_2FA_URI:
      return handleSet2FAUri(state, action.payload);

    case sharedActionTypes.IS_LOGGED_IN:
      return handleIsLoggedIn(state, action.payload);

    case sharedActionTypes.IS_LOADING_AUTH:
      return handleIsLoadingAuth(state, action.payload);

    case sharedActionTypes.SET_AUTH_ERROR:
      return handleSetAuthError(state, action.payload);

    case sharedActionTypes.IS_LOADING_ACCOUNT:
      return handleIsLoadingAccount(state, action.payload);

    case sharedActionTypes.SET_SETTINGS:
      return handleSetSettings(state, action.payload);

    case sharedActionTypes.IS_LOADING_SETTINGS:
      return handleIsLoadingSettings(state, action.payload);

    case sharedActionTypes.IS_TRYING:
      return handleIsTrying(state, action.payload);

    case sharedActionTypes.RESET:
      return handleReset();

    default:
      return state;
  }
}
