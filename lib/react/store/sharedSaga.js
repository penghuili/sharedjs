import { all, call, fork, put, select, takeLatest } from 'redux-saga/effects';

import httpErrorCodes from '../../js/httpErrorCodes';
import { LocalStorage, sharedLocalStorageKeys } from '../../js/LocalStorage';
import { routeHelpers } from '../../react/routeHelpers';
import { sharedActionCreators, sharedActionTypes } from './sharedActions';
import {
  changePassword,
  checkRefreshToken,
  deleteAccount,
  disable2FA,
  enable2FA,
  fetchAccount,
  fetchSettings,
  generate2FASecret,
  logoutFromAllDevices,
  signIn,
  signUp,
  tryApp,
  verify2FA,
} from './sharedNetwork';
import { toastTypes } from './sharedReducer';
import sharedSelectors from './sharedSelectors';

function* handleGoBack() {
  yield call(routeHelpers.goBack);
}

function* handleNavigate({ payload: { path } }) {
  yield call(routeHelpers.navigate, path);
}

function* handleChangeThemeModePressed({ payload: { themeMode } }) {
  yield call(LocalStorage.set, sharedLocalStorageKeys.themeMode, themeMode);
  yield put(sharedActionCreators.setThemeMode(themeMode));
}

function* init() {
  yield put(sharedActionCreators.isCheckingRefreshToken(true));
  const { isValid } = yield call(checkRefreshToken);

  yield put(sharedActionCreators.isLoggedIn(isValid));
  yield put(sharedActionCreators.isCheckingRefreshToken(false));
}

function* hanldeSignUpPressed({ payload: { username, password } }) {
  yield put(sharedActionCreators.isLoadingAuth(true));
  const { error } = yield call(signUp, username, password);

  if (error) {
    if (error.errorCode === httpErrorCodes.ALREADY_EXISTS) {
      yield put(sharedActionCreators.setAuthError('This username is used.'));
    } else {
      yield put(sharedActionCreators.setAuthError('Sign up failed.'));
    }
  } else {
    yield call(routeHelpers.navigate, '/sign-in');
    yield put(
      sharedActionCreators.setToast('Sign up successful, now you can sign in.', toastTypes.SUCCESS)
    );
  }

  yield put(sharedActionCreators.isLoadingAuth(false));
}

function* hanldeSignInPressed({ payload: { username, password } }) {
  yield put(sharedActionCreators.isLoadingAuth(true));

  const { data, error } = yield call(signIn, username, password);
  if (error) {
    if (error.errorCode === httpErrorCodes.NOT_FOUND) {
      yield put(sharedActionCreators.setAuthError('This username does not exist.'));
    } else {
      yield put(sharedActionCreators.setAuthError('Sign in failed.'));
    }
  } else {
    if (data.tempToken) {
      yield call(routeHelpers.navigate, '/sign-in/2fa');
    } else {
      yield put(sharedActionCreators.isLoggedIn(!!data));
    }
  }

  yield put(sharedActionCreators.isLoadingAuth(false));
}

function* handleVerify2FAPressed({ payload: { code } }) {
  yield put(sharedActionCreators.isLoadingAuth(true));

  const { data, error } = yield call(verify2FA, code);
  if (error) {
    if (error.errorCode === httpErrorCodes.UNAUTHORIZED) {
      yield put(
        sharedActionCreators.setAuthError(
          'Your session is expired, please go back to sign in again.'
        )
      );
    } else if (error.errorCode === httpErrorCodes.FORBIDDEN) {
      yield put(sharedActionCreators.setAuthError('Invalid code, please enter a new one.'));
    } else {
      yield put(sharedActionCreators.setAuthError('Sign in failed.'));
    }
  } else {
    yield put(sharedActionCreators.isLoggedIn(!!data));
  }

  yield put(sharedActionCreators.isLoadingAuth(false));
}

function* handleGenerate2FASecretPressed() {
  yield put(sharedActionCreators.isLoadingAccount(true));

  const { data } = yield call(generate2FASecret);
  if (data) {
    yield put(sharedActionCreators.set2FAUri(data.uri));
  }

  yield put(sharedActionCreators.isLoadingAccount(false));
}

function* handleEnable2FAPressed({ payload: { code } }) {
  yield put(sharedActionCreators.isLoadingAccount(true));

  const { data } = yield call(enable2FA, code);
  if (data) {
    yield put(sharedActionCreators.setUserData(data));
    yield put(sharedActionCreators.setToast('2FA is enabled.'));
  }

  yield put(sharedActionCreators.isLoadingAccount(false));
}

function* handleDisable2FAPressed({ payload: { code } }) {
  yield put(sharedActionCreators.isLoadingAccount(true));

  const { data } = yield call(disable2FA, code);
  if (data) {
    yield put(sharedActionCreators.setUserData(data));
    yield put(sharedActionCreators.setToast('2FA is disabled.'));
  }

  yield put(sharedActionCreators.isLoadingAccount(false));
}

function* hanldeLogOutPressed() {
  yield call(LocalStorage.resetTokens);
  yield put(sharedActionCreators.reset());
}

function* hanldeLogOutFromAllDevicesPressed() {
  yield put(sharedActionCreators.isLoadingAuth(true));

  const { data } = yield call(logoutFromAllDevices);
  if (data) {
    yield put(sharedActionCreators.logOutPressed());
  }

  yield put(sharedActionCreators.isLoadingAuth(false));
}

function* handleIsLoggedIn({ payload: { loggedIn } }) {
  if (loggedIn) {
    yield put(sharedActionCreators.fetchAccountRequested());
  }
}

function* handleFetchAccountRequested() {
  yield put(sharedActionCreators.isLoadingAccount(true));

  const { data } = yield call(fetchAccount);

  if (data) {
    yield put(sharedActionCreators.setUserData(data));
  }

  yield put(sharedActionCreators.isLoadingAccount(false));
}

function* handleDeleteAccountPressed() {
  yield put(sharedActionCreators.isLoadingAccount(true));

  const { data } = yield call(deleteAccount);

  if (data) {
    yield put(sharedActionCreators.logOutPressed());
    yield put(sharedActionCreators.setToast('Your account is deleted.'));
  } else {
    yield put(
      sharedActionCreators.setToast('Something went wrong, please try again.', toastTypes.critical)
    );
  }

  yield put(sharedActionCreators.isLoadingAccount(false));
}

function* handleChangePasswordPressed({ payload: { currentPassword, newPassword } }) {
  yield put(sharedActionCreators.isLoadingAccount(true));

  const { username } = yield select(sharedSelectors.getAccount);
  const { data } = yield call(changePassword, username, currentPassword, newPassword);

  if (data) {
    yield put(sharedActionCreators.setUserData(data));
    yield put(sharedActionCreators.setToast('Your password is changed! Please login again.'));
    yield put(sharedActionCreators.logOutPressed());
  } else {
    yield put(
      sharedActionCreators.setToast(
        'Something went wrong, your current password may be wrong.',
        toastTypes.critical
      )
    );
  }

  yield put(sharedActionCreators.isLoadingAccount(false));
}

function* handleFetchSettingsRequested({ payload: { app } }) {
  yield put(sharedActionCreators.isLoadingSettings(true));

  const { data } = yield call(fetchSettings, app);

  if (data) {
    yield put(sharedActionCreators.setSettings(data));
  }

  yield put(sharedActionCreators.fetchSettingsFinished(app));
  yield put(sharedActionCreators.isLoadingSettings(false));
}

function* handleTryPressed({ payload: { app } }) {
  yield put(sharedActionCreators.isTrying(true));

  const { data, error } = yield call(tryApp, app);

  if (data) {
    yield put(sharedActionCreators.setSettings(data));
    yield put(
      sharedActionCreators.setToast(
        `Free start trial start! Your account is valid until ${data.expiresAt}.`
      )
    );
    yield put(sharedActionCreators.trySucceeded(app));
  } else {
    if (error?.errorCode === httpErrorCodes.TRIED) {
      yield put(sharedActionCreators.setToast('You have already tried :)', toastTypes.critical));
    }
  }

  yield put(sharedActionCreators.isTrying(false));
}

export function* sharedSagas() {
  yield fork(init);

  yield all([
    takeLatest(sharedActionTypes.GO_BACK, handleGoBack),
    takeLatest(sharedActionTypes.NAVIGATE, handleNavigate),
    takeLatest(sharedActionTypes.CHNAGE_THEME_MODE_PRESSED, handleChangeThemeModePressed),

    takeLatest(sharedActionTypes.SIGN_UP_PRESSED, hanldeSignUpPressed),
    takeLatest(sharedActionTypes.SIGN_IN_PRESSED, hanldeSignInPressed),
    takeLatest(sharedActionTypes.VERIFY_2FA_PRESSED, handleVerify2FAPressed),
    takeLatest(sharedActionTypes.GENERATE_2FA_SECRET_PRESSED, handleGenerate2FASecretPressed),
    takeLatest(sharedActionTypes.ENABLE_2FA_PRESSED, handleEnable2FAPressed),
    takeLatest(sharedActionTypes.DISABLE_2FA_PRESSED, handleDisable2FAPressed),
    takeLatest(sharedActionTypes.LOG_OUT_PRESSED, hanldeLogOutPressed),
    takeLatest(
      sharedActionTypes.LOG_OUT_FROM_ALL_DEVICES_PRESSED,
      hanldeLogOutFromAllDevicesPressed
    ),

    takeLatest(sharedActionTypes.IS_LOGGED_IN, handleIsLoggedIn),
    takeLatest(sharedActionTypes.FETCH_ACCOUNT_REQUESTED, handleFetchAccountRequested),
    takeLatest(sharedActionTypes.DELETE_ACCOUNT_PRESSED, handleDeleteAccountPressed),
    takeLatest(sharedActionTypes.CHANGE_PASSWORD_PRESSED, handleChangePasswordPressed),

    takeLatest(sharedActionTypes.FETCH_SETTINGS_REQUESTED, handleFetchSettingsRequested),
    takeLatest(sharedActionTypes.TRY_PRESSED, handleTryPressed),
  ]);
}
