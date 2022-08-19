import request from '@/utils/request';
import Resource from '@/api/resource';
import store from '../store';

class AbsentResource extends Resource {
  constructor() {
    super('absent');
  }
  getAbsentWithStudentCode(query, studentCode) {
    return request({
      url: '/' + this.uri + '/get-absent/' + studentCode,
      method: 'get',
      params: {
        ...query,
        ...{ role: store.getters.currentRole },
      },
    });
  }
  getBasicInfoContact(id) {
    return request({
      url: '/' + this.uri + '/basic-info-contact/' + id,
      method: 'get',
      params: {
        ...{ role: store.getters.currentRole },
      },
    });
  }

  createEndDateAbsent(data) {
    return request({
      url: '/' + this.uri + '/create-end-date',
      method: 'put',
      params: {
        ... data,
        ...{ role: store.getters.currentRole },
      },
    });
  }

  getTargetPeriodWithCondition(query) {
    return request({
      url: 'target-period/get-with-condition',
      method: 'GET',
      params: {
        ...query,
        ...{ role: store.getters.currentRole },
      },
    });
  }

  checkOpenModalStartAbsent(id){
    return request({
      url: '/' + this.uri + '/start-absent/' + id,
      method: 'GET',
      params: {
        ...{ role: store.getters.currentRole },
      },
    });
  }
}

export { AbsentResource as default };
