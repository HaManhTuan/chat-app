import RegisterTrialRequest from '@/api/RegisterTrialRequest';
const registerTrialRequest = new RegisterTrialRequest();
const state = {
  registerTrial: [],
};

const getters = {
  getList(state) {
    return state.registerTrial;
  },
};

const mutations = {
  SET_REGISTER_TRIAL: (state, data) => {
    state.registerTrial = data;
  },
};

const actions = {
  /* Get list register trial */
  list({ commit }, payload) {
    return new Promise((resolve, reject) => {
      registerTrialRequest
        .list(payload)
        .then(response => {
          commit('SET_REGISTER_TRIAL', response);
        })
        .catch(error => {
          console.error(error);
          reject(error);
        });
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
