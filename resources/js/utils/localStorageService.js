const localStorageService = {
  getToken: () => {
    return localStorage.getItem('token');
  },

  setToken: (token = null) => {
    return localStorage.setItem('token', token);
  },

  removeToken: () => {
    return localStorage.removeItem('token');
  },

  getErrorMessage: () => {
    return localStorage.getItem('error_login');
  },

  setErrorMessage: (msg = null) => {
    return localStorage.setItem('error_login', msg);
  },

  removeErrorMessage: () => {
    return localStorage.removeItem('error_login');
  },
};

export default localStorageService;
