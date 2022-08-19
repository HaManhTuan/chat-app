import { login, logout, getInfo } from '@/api/auth';
import { isLogged, setLogged, removeToken } from '@/utils/auth';
import router, { resetRouter } from '@/router';
import store from '@/store';
import localStorageService from '@/utils/localStorageService';

const state = {
  id: null,
  user: null,
  token: isLogged(),
  name: '',
  email: '',
  avatar: '',
  introduction: '',
  roles: [],
  permissions: [],
  currentRole: '',
  currentBusiness: [],
  orgs: [],
  arrRoles: [],
  defaultOrg: null,
};

const getters = {
  getCurrentRole: state => {
    return state.roles[0];
  },
};

const mutations = {
  SET_ID: (state, id) => {
    state.id = id;
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_EMAIL: (state, email) => {
    state.email = email;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
  SET_CURRENT_ROLE: (state, roles) => {
    state.currentRole = roles[0];
  },
  SET_CURRENT_BUSINESS: (state, data) => {
    state.currentBusiness = data;
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions;
  },
  SET_ORGS: (state, orgs) => {
    state.orgs = orgs;
  },
  SET_ARR_ROLES: (state, arrRoles) => {
    state.arrRoles = arrRoles;
  },
  SET_DEFAULT_ORGS: (state, defaultOrg) => {
    state.defaultOrg = defaultOrg;
  },
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { email, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ email: email.trim(), password: password })
        .then(response => {
          setLogged('1');
          localStorageService.setToken(response.data.access_token);
          resolve();
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo()
        .then(response => {
          const { data } = response;

          if (!data) {
            reject('Verification failed, please Login again.');
          }

          const { roles, name, email, permissions, id, business, orgs, defaultOrg, arrRoles } = data;
          // roles must be a non-empty array
          if (!roles || roles.length <= 0) {
            reject('getInfo: roles must be a non-null array!');
          }

          commit('SET_ROLES', roles);
          commit('SET_CURRENT_ROLE', roles);
          commit('SET_PERMISSIONS', permissions);
          commit('SET_NAME', name);
          commit('SET_EMAIL', email);
          commit('SET_ID', id);
          commit('SET_ORGS', orgs);
          commit('SET_ARR_ROLES', arrRoles);
          commit('SET_DEFAULT_ORGS', defaultOrg);
          commit('SET_CURRENT_BUSINESS', business);
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      logout()
        .then(() => {
          commit('SET_TOKEN', '');
          commit('SET_ROLES', []);
          removeToken();
          localStorageService.removeToken();
          resetRouter();
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '');
      commit('SET_ROLES', []);
      removeToken();
      resolve();
    });
  },

  // Dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      // const token = role + '-token';

      // commit('SET_TOKEN', token);
      // setLogged(token);

      // const { roles } = await dispatch('getInfo');

      const roles = [role.name];
      const permissions = role.permissions.map(permission => permission.name);
      commit('SET_ROLES', roles);
      commit('SET_PERMISSIONS', permissions);
      resetRouter();

      // generate accessible routes map based on roles
      const accessRoutes = await store.dispatch('permission/generateRoutes', {
        roles,
        permissions,
      });

      // dynamically add accessible routes
      router.addRoutes(accessRoutes);

      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
