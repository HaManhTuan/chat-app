import Resource from './resource';
import request from '../utils/request';
import store from '../store';
class GradeRequest extends Resource {
  constructor() {
    super('grade', true);
  }

  getWithCondition(query) {
    return request({
      url: '/' + this.uri + '/get-with-condition',
      method: 'get',
      params: {
        ...query,
        ...{ role: store.getters.currentRole },
      },
    });
  }
  gradeOptions(query) {
    return request({
      url: '/' + this.uri + '/grade-options',
      method: 'get',
      params: {
        ...query,
        ...{ role: store.getters.currentRole },
      },
    });
  }
  gradeListOption(params) {
    return request({
      url: '/grade-list-options',
      method: 'get',
      params: {
        ...params,
      },
    });
  }
  gradeSearchName(params) {
    return request({
      url: '/' + this.uri + '/search-name',
      method: 'get',
      params: {
        ...params,
        ...{ role: store.getters.currentRole },
      },
    });
  }
  fetchSchoolType() {
    return request({
      url: '/school-type',
      method: 'get',
      params: {
        ...this.getCurrentRole(),
      },
    });
  }
  fetchActualGrade() {
    return request({
      url: '/actual-grade',
      method: 'get',
      params: {
        ...this.getCurrentRole(),
      },
    });
  }
  listGrade(query) {
    return request({
      url: '/grades',
      method: 'get',
      params: {
        ...query,
        ...this.getCurrentRole(),
      },
    });
  }
  fetchGradeFilter() {
    return request({
      url: '/grade-filter',
      method: 'get',
      params: {
        ...this.getCurrentRole(),
      },
    });
  }
  fetchGradeOptionByCreateOrUpdate(id = null) {
    return request({
      url: '/get-grade-options',
      method: 'get',
      params: {
        id,
        ...this.getCurrentRole(),
      },
    });
  }
  gradeActualSearchName(params) {
    return request({
      url: '/get-grade-actual',
      method: 'get',
      params: {
        ...params,
        ...{ role: store.getters.currentRole },
      },
    });
  }
}
export { GradeRequest as default };
