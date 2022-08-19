import Cookies from 'js-cookie';

const KEY = 'isLogged';
const authToken = 'access-token';

export function isLogged() {
  return Cookies.get(KEY) === '1';
}

export function setLogged(isLogged) {
  return Cookies.set(KEY, isLogged);
}

export function removeToken() {
  return Cookies.remove(KEY);
}

export function getAuthToken() {
  return Cookies.get(authToken);
}

export function setAuthToken(token) {
  return Cookies.set(authToken, token);
}

export function removeAuthToken() {
  return Cookies.remove(authToken);
}
