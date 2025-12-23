import Actions from '../../redux/actions';
import popupTypes from '../../constants/popup-types';
import store from '../../redux';
import ApiManager from '../index';

class Api extends ApiManager {
  constructor() {
    if (!Api.instance) {
      super();
      Api.instance = this;
    }

    return (Api.instance = this);
  }

  getHostUrl = (props = {}) => {
    const onSuccess = (response) => {
      let api = {
        base_url: response.data.host,
        get_methods: response.data.get_methods,
        get_url: response.data.get_url,
      };
      this._updateApiParams(api);
    };
    return this._execute(props, 'getHostUrl', onSuccess);
  };

  generalDeclaration = (props = {}) => {
    const onSuccess = (response) => {
      const {
        data: {
          langs,
          IsChecked,
          ServiceProductsQuestions,
          NumbersQuestions,
          permanent_deduction = [],
        },
      } = response;
      const keyValuesObj = {
        IsChecked,
        ServiceProductsQuestions,
        NumbersQuestions,
      };
      store.dispatch(Actions.setKeyValueObj(keyValuesObj));
      store.dispatch(Actions.setTranslations(langs));
      store.dispatch(Actions.setPermanentDeduction(permanent_deduction));
    };

    return this._execute(props, 'GdCms', onSuccess);
  };

  getTranslations = (props = {}) => {
    props = { ...props, config: { ...props.config, method: 'GET' } };

    const onSuccess = (response) => {
      // store.dispatch(Actions.setRequestData({ request: "getTranslations", data: response.data.error_lang_param }));
      store.dispatch(Actions.setTexts(response));
      typeof props.onSuccess === 'function' && props.onSuccess(response);
    };

    const onFailure = (error) => {
      store.dispatch(
        Actions.addPopup({
          type: popupTypes.API_ERROR,
          payload: { text: error?.err?.message },
        }),
      );
      typeof props.onFailure === 'function' && props.onFailure(error);
    };

    props.config.method = 'GET';
    return this._execute(props, 'translations', onSuccess, onFailure);
  };

  getNamespaces = (props = {}) => {
    props = { ...props, config: { ...props.config, method: 'GET' } };

    const onSuccess = (response) => {
      // store.dispatch(Actions.setRequestData({ request: "getTranslations", data: response.data.error_lang_param }));
      store.dispatch(Actions.setNamespaces(response));
      typeof props.onSuccess === 'function' && props.onSuccess(response);
    };

    const onFailure = (error) => {
      store.dispatch(
        Actions.addPopup({
          type: popupTypes.API_ERROR,
          payload: { text: error?.err?.message },
        }),
      );
      typeof props.onFailure === 'function' && props.onFailure(error);
    };

    props.config.method = 'GET';
    return this._execute(
      props,
      'translations/namespaces',
      onSuccess,
      onFailure,
    );
  };

  getFieldsOptions = (props = {}) => {
    const onSuccess = (res) => {
      typeof props.onSuccess === 'function' && props.onSuccess(res.data);
    };

    return this._execute(props, 'GetOccupationChoices', onSuccess);
  };

  addUpdateField = (props = {}) => {
    const onSuccess = (res) => {
      typeof props.onSuccess === 'function' && props.onSuccess(res.data);
    };

    const onFailure = (res) => {
      store.dispatch(
        Actions.addPopup({
          type: popupTypes.API_ERROR,
          payload: { text: res?.err?.message },
        }),
      );
      typeof props.onFailure === 'function' &&
      props.onFailure(res?.err?.message);
    };

    return this._execute(props, 'UpsertOccupation', onSuccess, onFailure);
  };

  deleteField = (props = {}) => {
    const onSuccess = (res) => {
      typeof props.onSuccess === 'function' && props.onSuccess(res.data);
    };

    const onFailure = (error) => {
      store.dispatch(
        Actions.addPopup({
          type: popupTypes.API_ERROR,
          payload: { text: error?.err?.message },
        }),
      );
      typeof props.onFailure === 'function' && props.onFailure(error);
    };

    return this._execute(props, 'DeleteOccupation', onSuccess, onFailure);
  };

  getFields = (props = {}) => {
    const onSuccess = (res) => {
      store.dispatch(Actions.setFields(res?.data.occupation));
      typeof props.onSuccess === 'function' && props.onSuccess(res.data);
    };

    const onFailure = (error) => {
      store.dispatch(
        Actions.addPopup({
          type: popupTypes.API_ERROR,
          payload: { text: error?.err?.message },
        }),
      );
      typeof props.onFailure === 'function' && props.onFailure(error);
    };

    return this._execute(props, 'GetOccupations', onSuccess, onFailure);
  };

  upsertErrorsLangParam = (props = {}) => {
    const onSuccess = (response) => {
      typeof props.onSuccess === 'function' && props.onSuccess(response);
    };

    const onFailure = (error) => {
      store.dispatch(
        Actions.addPopup({
          type: popupTypes.API_ERROR,
          payload: { text: error?.err?.message },
        }),
      );
      typeof props.onFailure === 'function' && props.onFailure(error);
    };

    props.payload.token = store.getState().userData?.token ?? '';

    return this._execute(props, 'UpsertErrorsLangParam', onSuccess, onFailure);
  };

  addTranslation = (props = {}) => {
    const onSuccess = (response) => {
      typeof props.onSuccess === 'function' && props.onSuccess(response);
    };

    const onFailure = (error) => {
      store.dispatch(
        Actions.addPopup({
          type: popupTypes.API_ERROR,
          payload: { text: error?.err?.message },
        }),
      );
      typeof props.onFailure === 'function' && props.onFailure(error);
    };

    return this._execute(props, 'translations', onSuccess, onFailure);
  };

  updateTranslate = (props = {}) => {
    props = { ...props, config: { ...props.config, method: 'PUT' } };

    const onSuccess = (response) => {
      typeof props.onSuccess === 'function' && props.onSuccess(response);
    };

    const onFailure = (error) => {
      store.dispatch(
        Actions.addPopup({
          type: popupTypes.API_ERROR,
          payload: { text: error?.err?.message },
        }),
      );
      typeof props.onFailure === 'function' && props.onFailure(error);
    };
    const translationId = props.payload.id;
    delete props.payload.id;
    return this._execute(
      props,
      `translations/${translationId}`,
      onSuccess,
      onFailure,
    );
  };

  deleteTranslation = (props = {}) => {
    props = { ...props, config: { ...props.config, method: 'DELETE' } };
    const onSuccess = (response) => {
      typeof props.onSuccess === 'function' && props.onSuccess(response);
    };

    const onFailure = (error) => {
      store.dispatch(
        Actions.addPopup({
          type: popupTypes.API_ERROR,
          payload: { text: error?.err?.message },
        }),
      );
      typeof props.onFailure === 'function' && props.onFailure(error);
    };

    const translationId = props.payload.id;
    delete props.payload.id;
    return this._execute(
      props,
      `translations/${translationId}`,
      onSuccess,
      onFailure,
    );
  };

  addNamespace = (props = {}) => {
    props = { ...props, config: { ...props.config, method: 'POST' } };
    const onSuccess = (response) => {
      typeof props.onSuccess === 'function' && props.onSuccess(response);
    };

    const onFailure = (error) => {
      store.dispatch(
        Actions.addPopup({
          type: popupTypes.API_ERROR,
          payload: { text: error?.err?.message },
        }),
      );
      typeof props.onFailure === 'function' && props.onFailure(error);
    };

    return this._execute(
      props,
      `translations/namespaces`,
      onSuccess,
      onFailure,
    );
  };

  removeNamespace = (props = {}) => {
    props = { ...props, config: { ...props.config, method: 'DELETE' } };
    const onSuccess = (response) => {
      typeof props.onSuccess === 'function' && props.onSuccess(response);
    };

    const onFailure = (error) => {
      store.dispatch(
        Actions.addPopup({
          type: popupTypes.API_ERROR,
          payload: { text: error?.err?.message },
        }),
      );
      typeof props.onFailure === 'function' && props.onFailure(error);
    };
    const namespaceId = props.payload.id;
    delete props.payload.id;
    return this._execute(
      props,
      `translations/namespaces/${namespaceId}`,
      onSuccess,
      onFailure,
    );
  };

  duplicateNamespace = (props = {}) => {
    props = { ...props, config: { ...props.config, method: 'POST' } };
    const onSuccess = (response) => {
      typeof props.onSuccess === 'function' && props.onSuccess(response);
    };

    const onFailure = (error) => {
      store.dispatch(
        Actions.addPopup({
          type: popupTypes.API_ERROR,
          payload: { text: error?.err?.message },
        }),
      );
      typeof props.onFailure === 'function' && props.onFailure(error);
    };

    const namespaceId = props.payload.sourceId;
    delete props.payload.sourceId;

    return this._execute(
      props,
      `translations/namespaces/${namespaceId}/duplicate`,
      onSuccess,
      onFailure,
    );
  };

  addUpdateUser = (props = {}) => {
    const onSuccess = (response) => {
      typeof props.onSuccess === 'function' && props.onSuccess(response);
    };

    const onFailure = (error) => {
      store.dispatch(
        Actions.addPopup({
          type: popupTypes.API_ERROR,
          payload: { text: error?.err?.message },
        }),
      );
      typeof props.onFailure === 'function' && props.onFailure(error);
    };

    return this._execute(props, 'UpsertSysUsers', onSuccess, onFailure);
  };

  setActiveUser = (props = {}) => {
    const onSuccess = (response) => {
      typeof props.onSuccess === 'function' && props.onSuccess(response);
    };

    const onFailure = (error) => {
      store.dispatch(
        Actions.addPopup({
          type: popupTypes.API_ERROR,
          payload: { text: error?.err?.message },
        }),
      );
      typeof props.onFailure === 'function' && props.onFailure(error);
    };

    return this._execute(props, 'SetActiveUser', onSuccess, onFailure);
  };

  getUsers = (props = {}) => {
    const onSuccess = (res) => {
      store.dispatch(Actions.setUsers(res?.data.users));
      typeof props.onSuccess === 'function' && props.onSuccess(res);
    };

    const onFailure = (error) => {
      store.dispatch(
        Actions.addPopup({
          type: popupTypes.API_ERROR,
          payload: { text: error?.err?.message },
        }),
      );
      typeof props.onFailure === 'function' && props.onFailure(error);
    };

    return this._execute(props, 'GetSysUsers', onSuccess, onFailure);
  };

  getHomepageStatistics = (props = {}) => {
    const onSuccess = (res) => {
      store.dispatch(Actions.setHomepageStatistics(res?.data.home_page));
      typeof props.onSuccess === 'function' && props.onSuccess(res);
    };

    const onFailure = (error) => {
      store.dispatch(
        Actions.addPopup({
          type: popupTypes.API_ERROR,
          payload: { text: error?.err?.message },
        }),
      );

      typeof props.onFailure === 'function' && props.onFailure(error);
    };

    return this._execute(props, 'HomePageFilters', onSuccess, onFailure);
  };

  getStatusMarketerUsersService = (props = {}) => {
    const onSuccess = (res) => {
      const { data } = res;
      store.dispatch(Actions.setStatusesData(data));

      typeof props.onSuccess === 'function' && props.onSuccess(res);
    };

    const onFailure = (error) => {
      store.dispatch(
        Actions.addPopup({
          type: popupTypes.API_ERROR,
          payload: { text: error?.err?.message },
        }),
      );

      typeof props.onFailure === 'function' && props.onFailure(error);
    };

    return this._execute(
      props,
      'GetStatusMarketerUsersService',
      onSuccess,
      onFailure,
    );
  };

  getApplicationErrorsLog = (props) => {
    const onSuccess = (res) => {
      typeof props.onSuccess === 'function' && props.onSuccess(res);
    };

    const onFailure = (error) => {
      store.dispatch(
        Actions.addPopup({
          type: popupTypes.API_ERROR,
          payload: { text: error?.err?.message },
        }),
      );
      typeof props.onFailure === 'function' && props.onFailure(error);
    };

    return this._execute(
      props,
      'GetApplicationErrorsLog',
      onSuccess,
      onFailure,
    );
  };

  login = (props = {}) => {
    const onSuccess = (response) => {
      typeof props.onSuccess === 'function' && props.onSuccess(response);
    };

    const onFailure = (error) => {
      typeof props.onFailure === 'function' && props.onFailure(error);
    };

    return this._execute(props, 'auth/login', onSuccess, onFailure);
  };

  getCmsLogs = (props = {}) => {
    const onSuccess = (res) => {
      typeof props.onSuccess === 'function' && props.onSuccess(res);
    };

    const onFailure = (error) => {
      store.dispatch(
        Actions.addPopup({
          type: popupTypes.API_ERROR,
          payload: { text: error?.err?.message },
        }),
      );
      typeof props.onFailure === 'function' && props.onFailure(error);
    };

    return this._execute(props, 'GetCmsLogs', onSuccess, onFailure);
  };

  deleteFileOccupation = (props = {}) => {
    const onSuccess = (res) => {
      typeof props.onSuccess === 'function' && props.onSuccess(res);
    };

    const onFailure = (error) => {
      typeof props.onFailure === 'function' && props.onFailure(error);
    };

    return this._execute(props, 'DeleteFileOccupation', onSuccess, onFailure);
  };
  syncTranslations = (props = {}) => {
    const onSuccess = (res) => {
      typeof props.onSuccess === 'function' && props.onSuccess(res);
    };

    const onFailure = (error) => {
      typeof props.onFailure === 'function' && props.onFailure(error);
    };

    return this._execute(props, 'translations/sync', onSuccess, onFailure);
  };

  /**
   * Get all images (requires authentication)
   * GET /images/all
   */
  getAllImages = (props = {}) => {
    props = { ...props, config: { ...props.config, method: 'GET' } };

    const onSuccess = (response) => {
      store.dispatch(Actions.setImages(response));
      typeof props.onSuccess === 'function' && props.onSuccess(response);
    };

    const onFailure = (error) => {
      store.dispatch(
        Actions.addPopup({
          type: popupTypes.API_ERROR,
          payload: { text: error?.err?.message },
        }),
      );
      typeof props.onFailure === 'function' && props.onFailure(error);
    };

    return this._execute(props, 'images/all', onSuccess, onFailure);
  };

  /**
   * Create a new image (requires authentication)
   * POST /images
   * @param {Object} props - Contains payload (FormData) with file, key, title, alt, width, height
   */
  createImage = (props = {}) => {
    props = { ...props, config: { ...props.config, method: 'POST' } };

    const onSuccess = (response) => {
      typeof props.onSuccess === 'function' && props.onSuccess(response);
    };

    const onFailure = (error) => {
      // Handle specific error codes
      if (error?.response?.status === 409) {
        // Key already exists
        typeof props.onFailure === 'function' && props.onFailure(error);
      } else if (error?.response?.status === 502) {
        // Storage error
        store.dispatch(
          Actions.addPopup({
            type: popupTypes.API_ERROR,
            payload: { text: error?.err?.message || 'Storage error occurred' },
          }),
        );
        typeof props.onFailure === 'function' && props.onFailure(error);
      } else {
        store.dispatch(
          Actions.addPopup({
            type: popupTypes.API_ERROR,
            payload: { text: error?.err?.message },
          }),
        );
        typeof props.onFailure === 'function' && props.onFailure(error);
      }
    };

    return this._execute(props, 'images', onSuccess, onFailure);
  };

  /**
   * Get image by ID (public route)
   * GET /images/{id}
   */
  getImageById = (id, props = {}) => {
    props = { ...props, config: { ...props.config, method: 'GET' } };

    const onSuccess = (response) => {
      typeof props.onSuccess === 'function' && props.onSuccess(response);
    };

    const onFailure = (error) => {
      if (error?.response?.status !== 404) {
        store.dispatch(
          Actions.addPopup({
            type: popupTypes.API_ERROR,
            payload: { text: error?.err?.message },
          }),
        );
      }
      typeof props.onFailure === 'function' && props.onFailure(error);
    };

    return this._execute(props, `images/${id}`, onSuccess, onFailure);
  };

  /**
   * Get image by key (public route)
   * GET /images/by-key/{key}
   */
  getImageByKey = (key, props = {}) => {
    props = { ...props, config: { ...props.config, method: 'GET' } };

    const onSuccess = (response) => {
      typeof props.onSuccess === 'function' && props.onSuccess(response);
    };

    const onFailure = (error) => {
      if (error?.response?.status !== 404) {
        store.dispatch(
          Actions.addPopup({
            type: popupTypes.API_ERROR,
            payload: { text: error?.err?.message },
          }),
        );
      }
      typeof props.onFailure === 'function' && props.onFailure(error);
    };

    return this._execute(props, `images/by-key/${key}`, onSuccess, onFailure);
  };

  /**
   * Replace image file (requires authentication)
   * POST /images/{id}
   * @param {number} id - Image ID
   * @param {Object} props - Contains payload (FormData) with file
   */
  replaceImage = (id, props = {}) => {
    props = { ...props, config: { ...props.config, method: 'POST' } };

    const onSuccess = (response) => {
      typeof props.onSuccess === 'function' && props.onSuccess(response);
    };

    const onFailure = (error) => {
      if (error?.response?.status === 502) {
        // Storage error
        typeof props.onFailure === 'function' && props.onFailure(error);
      } else if (error?.response?.status === 404) {
        store.dispatch(
          Actions.addPopup({
            type: popupTypes.API_ERROR,
            payload: { text: error?.err?.message || 'Image not found' },
          }),
        );
        typeof props.onFailure === 'function' && props.onFailure(error);
      } else {
        store.dispatch(
          Actions.addPopup({
            type: popupTypes.API_ERROR,
            payload: { text: error?.err?.message },
          }),
        );
        typeof props.onFailure === 'function' && props.onFailure(error);
      }
    };

    return this._execute(props, `images/${id}`, onSuccess, onFailure);
  };

  /**
   * Update image metadata (requires authentication)
   * POST /images/meta/{id}
   * @param {number} id - Image ID
   * @param {Object} props - Contains payload (FormData) with key, title, alt, width, height
   */
  updateImageMeta = (id, props = {}) => {
    props = { ...props, config: { ...props.config, method: 'POST' } };

    const onSuccess = (response) => {
      typeof props.onSuccess === 'function' && props.onSuccess(response);
    };

    const onFailure = (error) => {
      if (error?.response?.status === 409) {
        // Key already exists
        typeof props.onFailure === 'function' && props.onFailure(error);
      } else if (error?.response?.status === 502) {
        // Storage error
        typeof props.onFailure === 'function' && props.onFailure(error);
      } else if (error?.response?.status === 404) {
        store.dispatch(
          Actions.addPopup({
            type: popupTypes.API_ERROR,
            payload: { text: error?.err?.message || 'Image not found' },
          }),
        );
        typeof props.onFailure === 'function' && props.onFailure(error);
      } else {
        store.dispatch(
          Actions.addPopup({
            type: popupTypes.API_ERROR,
            payload: { text: error?.err?.message },
          }),
        );
        typeof props.onFailure === 'function' && props.onFailure(error);
      }
    };

    return this._execute(props, `images/meta/${id}`, onSuccess, onFailure);
  };

  /**
   * Delete image (requires authentication)
   * DELETE /images/{id}
   * @param {number} id - Image ID
   */
  deleteImage = (id, props = {}) => {
    props = { ...props, config: { ...props.config, method: 'DELETE' } };

    const onSuccess = (response) => {
      typeof props.onSuccess === 'function' && props.onSuccess(response);
    };

    const onFailure = (error) => {
      if (error?.response?.status === 502) {
        // Storage error
        typeof props.onFailure === 'function' && props.onFailure(error);
      } else if (error?.response?.status === 404) {
        store.dispatch(
          Actions.addPopup({
            type: popupTypes.API_ERROR,
            payload: { text: error?.err?.message || 'Image not found' },
          }),
        );
        typeof props.onFailure === 'function' && props.onFailure(error);
      } else {
        store.dispatch(
          Actions.addPopup({
            type: popupTypes.API_ERROR,
            payload: { text: error?.err?.message },
          }),
        );
        typeof props.onFailure === 'function' && props.onFailure(error);
      }
    };

    const imageId = id;
    return this._execute(props, `images/${imageId}`, onSuccess, onFailure);
  };

  getCrudRequest = (entity, props = {}) => {
    const {
      onSuccess: userOnSuccess,
      onFailure: userOnFailure,
      onFinally: userOnFinally,
      config = {},
      noStoreRedux = false,
      ...otherProps
    } = props;
    const queryParams = { ...otherProps };

    const queryString = Object.keys(queryParams)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`,
      )
      .join('&');

    const url = queryString
      ? `api/cms/${entity}?${queryString}`
      : `api/cms/${entity}`;

    const onSuccess = (response) => {
      typeof userOnSuccess === 'function' && userOnSuccess(response);
    };

    const onFailure = (error) => {
      store.dispatch(
        Actions.addPopup({
          type: popupTypes.API_ERROR,
          payload: { text: error?.response?.data?.error },
        }),
      );
      typeof userOnFailure === 'function' && userOnFailure(error);
    };

    const executeProps = { config: { ...config, method: 'GET' } };
    return this._execute(executeProps, url, onSuccess, onFailure).finally(
      () => {
        typeof userOnFinally === 'function' && userOnFinally();
      },
    );
  };
}

const instance = new Api();
Object.freeze(instance);
export default instance;
