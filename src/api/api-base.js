import qs from 'querystringify';
import {ACCESS_TOKEN, AUTHORIZATION} from 'src/configs/constant';
import api from './axios-config';

const TIMEOUT = 300000;

const getAuthToken = () => {
  return localStorage.getItem(ACCESS_TOKEN) || '';
};

const handleResponse = (r, isAuth) => {
  if (r?.status === 401) {
    return r;
  }
  if (r?.status === 500) {
    return r;
  }

  return r;

};

const redirectToSomethingWentWrongScreen = () => {
  return setTimeout(() => {
    window.location.href = '/500';
  }, TIMEOUT);
};

export const apiBase = {
  get: async (endpoint, params, timeout = TIMEOUT, isAuth) => {
    let options = {};
    if (isAuth) {
      const auth = getAuthToken();
      if (auth) {
        options = {
          headers: {
            [AUTHORIZATION]: `${auth}`,
          },
        };
      }
    }

    const handleTimeout = redirectToSomethingWentWrongScreen(timeout);
    try {
      const res = await api.get(
        `${endpoint}?${qs.stringify({...params})}`,
        options.headers ? options : {}
      );
      clearTimeout(handleTimeout);

      return res.data;
    } catch (err) {
      clearTimeout(handleTimeout);

      return handleResponse(err?.response, isAuth);
    }
  },
  getFile: async (endpoint, params, timeout = TIMEOUT) => {
    let options = {};
    const auth = getAuthToken();
    if (auth) {
      options = {
        headers: {
          [AUTHORIZATION]: `${auth}`,
        },
        responseType: 'blob',
      };
    }

    const handleTimeout = redirectToSomethingWentWrongScreen(timeout);
    try {
      const res = await api.get(
        `${endpoint}?${qs.stringify({...params})}`,
        options
      );
      clearTimeout(handleTimeout);

      return res;
    } catch (err) {
      clearTimeout(handleTimeout);

      return handleResponse(err?.response, true);
    }
  },
  post: async (endpoint, params, timeout = TIMEOUT, isAuth) => {
    let options = {};
    if (isAuth) {
      const auth = getAuthToken();
      if (auth) {
        options = {
          headers: {
            [AUTHORIZATION]: `${auth}`,
          },
        };
      }
    }

    const handleTimeout = redirectToSomethingWentWrongScreen(timeout);
    try {
      const res = await api.post(endpoint, {...params}, options);
      clearTimeout(handleTimeout);

      return res.data;
    } catch (err) {
      clearTimeout(handleTimeout);

      return handleResponse(err?.response, isAuth);
    }
  },
  postFile2: async (endpoint, params, timeout = TIMEOUT, isAuth, options) => {
    options = options ? options : {};
    if (isAuth) {
      const auth = getAuthToken();
      if (auth) {
        options = {
          ...options,
          headers: {
            [AUTHORIZATION]: `${auth}`,
          },
        };
      }
    }

    const handleTimeout = redirectToSomethingWentWrongScreen(timeout);
    try {
      const res = await api.post(endpoint, {...params}, options);
      clearTimeout(handleTimeout);

      return res;
    } catch (err) {
      clearTimeout(handleTimeout);

      return handleResponse(err?.response, isAuth);
    }
  },
  postFile: async (endpoint, params, timeout = TIMEOUT) => {
    let options = {};
    const auth = getAuthToken();
    if (auth) {
      options = {
        headers: {
          [AUTHORIZATION]: `${auth}`,
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
        observe: 'response',
      };
    }

    const handleTimeout = redirectToSomethingWentWrongScreen(timeout);
    try {
      const res = await api.post(endpoint, params, options);

      clearTimeout(handleTimeout);

      return res;
    } catch (err) {
      clearTimeout(handleTimeout);

      return handleResponse(err?.response, true);
    }
  },
  postFile3: async (endpoint, params, timeout = TIMEOUT) => {
    let options = {};
    const auth = getAuthToken();
    if (auth) {
      options = {
        headers: {
          [AUTHORIZATION]: `${auth}`,
          'Content-Type': 'multipart/form-data',
        },
      };
    }

    const handleTimeout = redirectToSomethingWentWrongScreen(timeout);
    try {
      const res = await api.post(endpoint, params, options);
      clearTimeout(handleTimeout);

      return res;
    } catch (err) {
      clearTimeout(handleTimeout);

      return handleResponse(err?.response, true);
    }
  },
  put: async (endpoint, params, timeout = TIMEOUT, isAuth) => {
    let options = {};
    if (isAuth) {
      const auth = getAuthToken();
      if (auth) {
        options = {
          headers: {
            [AUTHORIZATION]: `${auth}`,
          },
        };
      }
    }
    const handleTimeout = redirectToSomethingWentWrongScreen(timeout);
    try {
      const res = await api.put(endpoint, {...params}, options);
      clearTimeout(handleTimeout);

      return res.data;
    } catch (err) {
      clearTimeout(handleTimeout);

      return handleResponse(err?.response, isAuth);
    }
  },
  patch: async (endpoint, params, timeout = TIMEOUT, isAuth) => {
    let options = {};
    if (isAuth) {
      const auth = getAuthToken();
      if (auth) {
        options = {
          headers: {
            [AUTHORIZATION]: `${auth}`,
          },
        };
      }
    }
    const handleTimeout = redirectToSomethingWentWrongScreen(timeout);
    try {
      const res = await api.patch(endpoint, {...params}, options);
      clearTimeout(handleTimeout);

      return res.data;

    } catch (err) {
      clearTimeout(handleTimeout);

      return handleResponse(err?.response, isAuth);
    }
  },
  delete: async (endpoint, params, timeout = TIMEOUT, isAuth) => {
    let options = {};
    if (isAuth) {
      const auth = getAuthToken();
      if (auth) {
        options = {
          headers: {
            [AUTHORIZATION]: `${auth}`,
          },
        };
      }
    }
    const handleTimeout = redirectToSomethingWentWrongScreen(timeout);
    try {
      const res = await api.delete(
        endpoint,
        options.headers ? options : {}
      );
      clearTimeout(handleTimeout);

      return res.data;
    } catch (err) {
      clearTimeout(handleTimeout);

      return handleResponse(err?.response, isAuth);
    }
  },

  postFormData: async (
    endpoint,
    formData,
    timeout = TIMEOUT,
    header,
    handleUploadProgress
  ) => {
    const auth = getAuthToken();

    const options = {
      method: 'POST',
      headers: {
        ...header,
        [AUTHORIZATION]: `${auth}`,
        'Content-Type': 'multipart/form-data',
      },
    };
    if (handleUploadProgress) {
      options.onUploadProgress = handleUploadProgress;
    }
    const handleTimeout = redirectToSomethingWentWrongScreen(timeout);
    try {
      const res = await api.post(endpoint, formData, options);
      clearTimeout(handleTimeout);

      return res;
    } catch (err) {
      clearTimeout(handleTimeout);

      return handleResponse(err?.response, true);
    }
  },

  putFormData: async (
    endpoint,
    formData,
    timeout = TIMEOUT,
    header,
    handleUploadProgress
  ) => {
    const auth = getAuthToken();

    const options = {
      method: 'PUT',
      headers: {
        ...header,
        [AUTHORIZATION]: `${auth}`,
        'Content-Type': 'multipart/form-data',
      },
    };
    if (handleUploadProgress) {
      options.onUploadProgress = handleUploadProgress;
    }
    const handleTimeout = redirectToSomethingWentWrongScreen(timeout);
    try {
      const res = await api.put(endpoint, formData, options);
      clearTimeout(handleTimeout);

      return res;
    } catch (err) {
      clearTimeout(handleTimeout);

      return handleResponse(err?.response, true);
    }
  },

};
