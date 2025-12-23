import axios from 'axios';
import popupTypes from 'constants/popup-types';
import SILENT_LOGIN from 'constants/silentLogin';
import Actions from '../redux/actions';
import store from '../redux/index';
import QueueManager from './queue_manager';

class ApiManager {
  /* ------ private variables ------- */
  #api = false;
  #queue = false;

  constructor() {
    this.#api = {
      https: true,
      baseUrl: process.env.REACT_APP_HOST,
      parts: {
        path: process.env.REACT_APP_PATH,
        platform: process.env.REACT_APP_PLATFORM,
        version: process.env.REACT_APP_VERSION,
      },
      getMethodsUrl: process.env.REACT_APP_GET_HOST,
      getMethodsList: [],
    };

    this.#queue = new QueueManager();
  }

  /* ------ private methods ------- */

  #buildBaseUrl = (useGetUrl = false) => {
    let path = '/';
    //no path for this project
    // for(let part in this.#api.parts) {
    //     let item = this.#api.parts[part];
    //     if(item !== '') {
    //         path = path + item + '/';
    //     }
    // }

    // //use package json proxy while developing in localhost
    // if (process.env.NODE_ENV === "development") {
    // 	return path;
    // }

    let url =
      (this.#api.https ? 'https' : 'http') +
      '://' +
      (useGetUrl ? this.#api.getMethodsUrl : this.#api.baseUrl);
    url = url + path;
    return url;
  };

  #call = (settings, onSuccess, onFailure, callback, onFinally = () => {}) => {
    return axios(settings)
      .then((response) => {
        if (typeof callback === 'function') {
          callback(response);
        }

        // Check if response has data and no errors
        const newUserToken = response.data.token;

        if (newUserToken) {
          store.dispatch(Actions.updateUserToken(newUserToken));
          localStorage.setItem(SILENT_LOGIN.localStorageName, newUserToken);
        }

        onSuccess ? onSuccess(response.data) : this.#onSuccess();
        return response.data;
      })
      .catch((error) => {
        if (error.response.statusText === 'Unauthorized') {
          // Store complete user data in localStorage
          localStorage.removeItem(SILENT_LOGIN.localStorageName);

          // Update Redux state with complete user data
          store.dispatch(Actions.setUser(false));
          return;
        }
        this.#handleServerError(error);
        typeof onFailure === 'function' && onFailure(error);
      })
      .finally(() => {
        store.dispatch(Actions.requestEnded());
        this.#queue.popFromQueue();
        typeof onFinally === 'function' && onFinally();
      });
  };

  #generateRequest = (
    request,
    params = {},
    method = 'POST',
    timeout = false,
  ) => {
    let requestUrl = request;
    let settings = {};

    if (this.#api.debug_mode) {
      console.log('%cmaking request:' + requestUrl, 'color: #0000FF', '');
      console.log('%c---request payload:', 'color: #0000FF', params);
    }

    const userToken = store.getState()?.userData?.[SILENT_LOGIN.apiRequestKey];
    settings.method = method;
    settings.url = requestUrl;
    settings.timeout = timeout ? timeout : 1000 * 60 * 2;
    settings.withCredentials = true;
    const isFormData = params instanceof FormData;
    settings.headers = {
      Authorization: `Bearer ${userToken}`,
      // 'x-api-key': process.env.REACT_APP_X_API_KEY
    };
    if (!isFormData) {
      settings.headers['Content-Type'] = 'application/json';
    } else {
      settings.headers['Content-Type'] = 'multipart/form-data';
    }
    if (method.toUpperCase() === 'GET') {
      settings.params = params;
    } else {
      settings.data = params;
    }
    store.dispatch(Actions.requestStarted());

    return settings;
  };

  #onSuccess = () => {
    console.log('successful');
  };

  #onFailure = (response) => {
    const text =
      response?.err?.message !== undefined
        ? response.err.message
        : 'תקלת שרת, אנא נסה שנית מאוחר יותר';
    store.dispatch(
      Actions.addPopup({
        type: popupTypes.API_ERROR,
        payload: { text: text },
      }),
    );
  };

  #handleServerError = (error) => {
    store.dispatch(
      Actions.addPopup({ type: popupTypes.API_MESSAGE, text: error.message }),
    );
  };

  /* ------ protected methods ------- */

  _execute = (props, methodName, onSuccess = false, onFailure = false) => {
    let request, method;
    let inGetMethodArr = this.#api.getMethodsList.find(
      (method) => method === methodName,
    );
    if (inGetMethodArr) {
      method = 'GET';
      request = this.#buildBaseUrl(true) + methodName;
    } else {
      method = 'POST';
      request = this.#buildBaseUrl() + methodName;
    }

    //override if props sent
    let override_path = props?.config?.path !== undefined;
    let override_method = props?.config?.method !== undefined;
    if (override_method) {
      method = props.config.method;
    }
    if (override_path) {
      request = props.config.path + methodName;
    }

    const block = props?.config?.block !== undefined;
    const settings = this.#generateRequest(request, props.payload, method);

    this.#queue.addRequestToQueue(
      () => this.#call(settings, onSuccess, onFailure, props.callback),
      block,
    );

    if (!block)
      return this.#call(
        settings,
        onSuccess,
        onFailure,
        props.callback,
        props.onFinally,
      );
  };

  _updateApiParams = (api) => {
    if (api.base_url) this.#api.baseUrl = api.base_url;
    if (api.get_methods) this.#api.getMethodsList = api.get_methods;
    if (api.get_url) this.#api.getMethodsUrl = api.get_url;
  };
}

export default ApiManager;
