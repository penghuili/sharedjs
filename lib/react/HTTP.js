import axios from 'axios';
import EventEmitter3 from 'eventemitter3';
import { LocalStorage, sharedLocalStorageKeys } from '../js/LocalStorage';
import { apps } from '../js/apps';
import { getHook } from './hooksOutside';
import { sharedActionCreators } from './store/sharedActions';
import { toastTypes } from './store/sharedReducer';

const serverToUrl = {
  [apps.Admin.name]: process.env.REACT_APP_ADMIN_URL,
  [apps.Auth.name]: process.env.REACT_APP_AUTH_URL,
  [apps.Favicon37.name]: process.env.REACT_APP_FAVICON_API_URL,
  [apps.Encrypt37.name]: process.env.REACT_APP_FILE37_API_URL,
  [apps.Group37.name]: process.env.REACT_APP_GROUP37_API_URL,
  [apps.Remiind.name]: process.env.REACT_APP_LIFE_REMINDER_API_URL,
  [apps.Link37.name]: process.env.REACT_APP_LINK37_API_URL,
  [apps.Pay37.name]: process.env.REACT_APP_PAY_URL,
  [apps.MobilePDF.name]: process.env.REACT_APP_PDF37_API_URL,
  [apps.Note37.name]: process.env.REACT_APP_NOTE37_API_URL,
  [apps.Puppeteer.name]: process.env.REACT_APP_PUPPETEER_API_URL,
  [apps.Schedule.name]: process.env.REACT_APP_SCHEDULE_API_URL,
  [apps.Encrypt37Share.name]: process.env.REACT_APP_SHAREFILE_API_URL,
  [apps.Static37.name]: process.env.REACT_APP_STATIC37_API_URL,
  [apps.Watcher37.name]: process.env.REACT_APP_WATCHER37_API_URL,
};

function getFullUrl(server, path) {
  return `${serverToUrl[server]}${path}`;
}

let isRefreshing = false;
const eventemitter = new EventEmitter3();

const HTTP = {
  async publicGet(server, path) {
    try {
      const { data } = await axios.get(getFullUrl(server, path));
      return data;
    } catch (error) {
      throw HTTP.handleError(error);
    }
  },
  async publicPost(server, path, body) {
    try {
      const { data } = await axios.post(getFullUrl(server, path), body);
      return data;
    } catch (error) {
      throw HTTP.handleError(error);
    }
  },
  async publicPut(server, path, body) {
    try {
      const { data } = await axios.put(getFullUrl(server, path), body);
      return data;
    } catch (error) {
      throw HTTP.handleError(error);
    }
  },

  async post(server, path, body, headers = {}) {
    try {
      await HTTP.refreshTokenIfNecessary();

      const accessToken = LocalStorage.get(sharedLocalStorageKeys.accessToken);
      const { data } = await axios.post(getFullUrl(server, path), body, {
        headers: { ...headers, authorization: `Bearer ${accessToken}` },
      });
      return data;
    } catch (error) {
      throw HTTP.handleError(error);
    }
  },
  async get(server, path) {
    try {
      await HTTP.refreshTokenIfNecessary();

      const accessToken = LocalStorage.get(sharedLocalStorageKeys.accessToken);
      const { data } = await axios.get(getFullUrl(server, path), {
        headers: { authorization: `Bearer ${accessToken}` },
      });
      return data;
    } catch (error) {
      throw HTTP.handleError(error);
    }
  },
  async put(server, path, body) {
    try {
      await HTTP.refreshTokenIfNecessary();

      const accessToken = LocalStorage.get(sharedLocalStorageKeys.accessToken);
      const { data } = await axios.put(getFullUrl(server, path), body, {
        headers: { authorization: `Bearer ${accessToken}` },
      });
      return data;
    } catch (error) {
      throw HTTP.handleError(error);
    }
  },
  async delete(server, path) {
    try {
      await HTTP.refreshTokenIfNecessary();

      const accessToken = LocalStorage.get(sharedLocalStorageKeys.accessToken);
      const { data } = await axios.delete(getFullUrl(server, path), {
        headers: { authorization: `Bearer ${accessToken}` },
      });
      return data;
    } catch (error) {
      throw HTTP.handleError(error);
    }
  },

  handleError(error) {
    const {
      response: { status, data: errorCode },
    } = error;
    if (status === 401) {
      LocalStorage.resetTokens();
      const dispatch = getHook('dispatch');
      dispatch(sharedActionCreators.reset());
    }

    if (status === 403) {
      const dispatch = getHook('dispatch');
      dispatch(sharedActionCreators.setToast('You do not have access.', toastTypes.critical));
    }

    return { status, errorCode };
  },

  async refreshTokenIfNecessary() {
    if (isRefreshing) {
      await HTTP.waitForRefresh();
      return;
    }

    const expiresAt = LocalStorage.get(sharedLocalStorageKeys.accessTokenExpiresAt);
    const refreshToken = LocalStorage.get(sharedLocalStorageKeys.refreshToken);
    const accessToken = LocalStorage.get(sharedLocalStorageKeys.accessToken);
    if (!refreshToken || !accessToken || !expiresAt) {
      throw { response: { status: 401 } };
    }

    if (expiresAt > Date.now()) {
      return;
    }

    isRefreshing = true;
    const data = await HTTP.publicPost(apps.Auth.name, `/v1/sign-in/refresh`, {
      refreshToken,
    });
    LocalStorage.saveTokens(data);
    isRefreshing = false;
    eventemitter.emit('refreshed');
  },

  async waitForRefresh() {
    return new Promise(resolve => {
      eventemitter.once('refreshed', () => {
        resolve(true);
      });
    });
  },
};

export default HTTP;
