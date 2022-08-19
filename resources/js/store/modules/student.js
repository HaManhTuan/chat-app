const state = {
  studentsSearch: [],
};

const getters = {
  getData(state) {
    return state.studentsSearch.original?.items;
  },
};

const mutations = {
  SET_STUDENTS_SEARCH: (state, students) => {
    state.studentsSearch = students;
  },
};

const actions = {
  // Search student
  search({ commit }, phrase) {
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
