import Resource from './resource';
import request from '@/utils/request';
import store from '../store';

class SubjectSetRequest extends Resource {
  constructor() {
    super('subject-set');
  }

  list(query) {
    return request({
      url: '/' + this.uri + '/list-in-area-list',
      method: 'GET',
      params: {
        ...query,
        ...{ role: store.getters.currentRole },
      },
    });
  }
  getById(id) {
    return request({
      url: '/' + this.uri + '/get-by-id/' + id,
      method: 'get',
      params: { role: store.getters.currentRole },
    });
  }
  getByGradeId(id) {
    return request({
      url: '/' + this.uri + '/get-by-grade/' + id,
      method: 'get',
      params: { role: store.getters.currentRole },
    });
  }
  getByCourseId(id) {
    return request({
      url: '/' + this.uri + '/get-by-course/' + id,
      method: 'get',
      params: { role: store.getters.currentRole },
    });
  }
  getByBusinessId(id) {
    return request({
      url: '/' + this.uri + '/get-by-business/' + id,
      method: 'get',
      params: { role: store.getters.currentRole },
    });
  }
  getByCourseIdAndGradeIdAndBusinessId(query) {
    return request({
      url:
        '/' +
        this.uri +
        '/get-by-grade-and-course-and-school-year-and-business',
      method: 'GET',
      params: {
        ...query,
        ...{ role: store.getters.currentRole },
      },
    });
  }
  searchName(params) {
    return request({
      url: '/' + this.uri + '/search-name',
      method: 'get',
      params: {
        ...params,
        ...{ role: store.getters.currentRole },
      },
    });
  }
  getByCondition(query) {
    return request({
      url: '/' + this.uri + '/get-by-condition',
      method: 'GET',
      params: {
        ...query,
        ...{ role: store.getters.currentRole },
      },
    });
  }
}
export { SubjectSetRequest as default };
