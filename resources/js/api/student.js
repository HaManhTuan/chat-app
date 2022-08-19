import request from '@/utils/request';
import Resource from '@/api/resource';
import store from '../store';

class StudentResource extends Resource {
  constructor() {
    super('students');
  }
  studentOptions() {
    return request({
      url: '/' + this.uri + '/student-options',
      method: 'get',
      params: {
        ...{ role: store.getters.currentRole },
      },
    });
  }

  searchStudentCodeName(params) {
    return request({
      url: '/' + this.uri + '/search-student-code',
      method: 'get',
      params: {
        ...params,
        ...{ role: store.getters.currentRole },
      },
    });
  }
  searchStudentIntroductionScreen(params) {
    return request({
      url: '/' + this.uri + '/search-student-introduction',
      method: 'get',
      params: {
        ...params,
        ...{ role: store.getters.currentRole },
      },
    });
  }
  // Api search name in select box
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
  getBasicInfo(id, params = null) {
    return request({
      url: '/' + this.uri + '/basic-info/' + id,
      method: 'get',
      params: {
        ...params,
        ...{ role: store.getters.currentRole },
      },
    });
  }
  getReciprocalInfo(id) {
    return request({
      url: '/' + this.uri + '/get-reciprocal-info/' + id,
      method: 'get',
      params: {
        ...{ role: store.getters.currentRole },
      },
    });
  }
  updateReciprocal(id, resource) {
    return request({
      url: '/' + this.uri + '/update-reciprocal/' + id,
      method: 'put',
      data: {
        ...resource,
        ...{ role: store.getters.currentRole },
      },
    });
  }
}

export { StudentResource as default };
