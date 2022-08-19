import '@/bootstrap';
import { Message } from 'element-ui';
import { setLogged } from '@/utils/auth';
import localStorageService from '@/utils/localStorageService';
import router from '@/router';

// Create axios instance
const service = window.axios.create({
  baseURL: process.env.MIX_BASE_API,
  timeout: 601000, // Request timeout
});

// Request intercepter
service.interceptors.request.use(
  config => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    if (csrfToken !== null) {
      config.headers['X-CSRF-TOKEN'] = csrfToken;
    }
    const token = localStorageService.getToken();
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token; // Set JWT token
    }
    return config;
  },
  error => {
    // Do something with request error
    console.log('Error at interceptors.request' + error);
    localStorageService.removeToken();
    setLogged(0);
    Promise.reject(error);
  }
);

// response pre-processing
service.interceptors.response.use(
  response => {
    if (response.headers.authorization) {
      setLogged(response.headers.authorization);
      response.data.token = response.headers.authorization;
    }

    return response.data;
  },
  error => {
    // console.log('Error at interceptors.response', error);
    const responseCode = error.response.status;
    if (responseCode === 401) {
      localStorageService.removeToken();
      setLogged(0);
      deleteAllCookies();
      return Promise.reject({
        message: 'ログインしたメールアドレスはシステムで存在しません。',
      }).finally(() => {
        location.reload();
      });
    }
    // Not found
    if (responseCode === 404) {
      router.push({ name: 'err_404' });
    }

    if (responseCode === 403) {
      router.push({ name: 'err_403' });
    }

    // let message = error.message;
    // if (error.response.data && error.response.data.errors) {
    //   message = error.response.data.errors;
    // } else if (error.response.data && error.response.data.error) {
    //   message = error.response.data.error;
    // }

    if (responseCode === 500) {
      Message({
        message: 'システムのエラーが発生しました。',
        type: 'error',
        duration: 5 * 1000,
      });
    }
    if (responseCode === 419) {
      return Promise.reject({
        message: 'トークンは無効になりました。',
      }).finally(() => {
        location.reload();
      });
    }

    return Promise.reject(error);
  }
);

const deleteAllCookies = () => {
  var cookies = document.cookie.split(';');

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf('=');
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
};

export default service;
