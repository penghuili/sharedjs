import { all, call, fork, put, select, takeLatest } from 'redux-saga/effects';

import httpErrorCodes from '../../js/httpErrorCodes';
import { LocalStorage, sharedLocalStorageKeys } from '../../js/LocalStorage';
import { routeHelpers } from '../../react/routeHelpers';
import { sharedActionCreators, sharedActionTypes } from './sharedActions';
import {
  changePassword,
  checkRefreshToken,
  deleteAccount,
  fetchAccount,
  logoutFromAllDevices,
  signIn,
  signUp,
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
  const { data } = yield call(checkRefreshToken);

  yield put(sharedActionCreators.isLoggedIn(!!data));
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
  }

  yield put(sharedActionCreators.isLoggedIn(!!data));
  yield put(sharedActionCreators.isLoadingAuth(false));
}

function* hanldeLogOutPressed() {
  yield call(LocalStorage.resetTokens);
  yield put(sharedActionCreators.reset());
}

function* hanldeLogOutFromAllDevicesPressed() {
  yield put(sharedActionCreators.isLoadingAuth(true));
  const { data } = yield call(logoutFromAllDevices);
  if (data) {
    yield put(sharedActionCreators.reset());
  }
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

export function* sharedSagas() {
  yield fork(init);

  yield all([
    takeLatest(sharedActionTypes.GO_BACK, handleGoBack),
    takeLatest(sharedActionTypes.NAVIGATE, handleNavigate),
    takeLatest(sharedActionTypes.CHNAGE_THEME_MODE_PRESSED, handleChangeThemeModePressed),

    takeLatest(sharedActionTypes.SIGN_UP_PRESSED, hanldeSignUpPressed),
    takeLatest(sharedActionTypes.SIGN_IN_PRESSED, hanldeSignInPressed),
    takeLatest(sharedActionTypes.LOG_OUT_PRESSED, hanldeLogOutPressed),
    takeLatest(
      sharedActionTypes.LOG_OUT_FROM_ALL_DEVICES_PRESSED,
      hanldeLogOutFromAllDevicesPressed
    ),

    takeLatest(sharedActionTypes.IS_LOGGED_IN, handleIsLoggedIn),
    takeLatest(sharedActionTypes.FETCH_ACCOUNT_REQUESTED, handleFetchAccountRequested),
    takeLatest(sharedActionTypes.DELETE_ACCOUNT_PRESSED, handleDeleteAccountPressed),
    takeLatest(sharedActionTypes.CHANGE_PASSWORD_PRESSED, handleChangePasswordPressed),
  ]);
}
