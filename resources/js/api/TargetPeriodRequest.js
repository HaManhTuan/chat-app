import Resource from './resource';
import request from '@/utils/request';
import store from '../store';

class TargetPeriodRequest extends Resource {
  constructor() {
    super('target-period', true);
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
  getList(query) {
    return request({
      url: '/' + this.uri,
      method: 'get',
      params: {
        ...query,
        ...{ role: store.getters.currentRole, is_master: true },
      },
    });
  }
  getTargetOfSubjectMst(params) {
    return request({
      url: '/' + this.uri + '/get-target-of-subject-mst',
      method: 'get',
      params: {
        ...params,
        ...{ role: store.getters.currentRole, is_master: true },
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
  getOption(query) {
    return request({
      url: '/' + this.uri + '/get-option',
      method: 'GET',
      params: {
        ...query,
        ...{ role: store.getters.currentRole },
      },
    });
  }
  getTargetPeriodWithCondition(query) {
    return request({
      url: '/' + this.uri + '/get-with-condition',
      method: 'GET',
      params: {
        ...query,
        ...{ role: store.getters.currentRole },
      },
    });
  }
  getTargetPeriodByBusinessId(query) {
    return request({
      url: '/' + this.uri + '/get-by-business',
      method: 'GET',
      params: {
        ...query,
        ...{ role: store.getters.currentRole },
      },
    });
  }
  getByListOwnerBusinessUnit(query) {
    return request({
      url: '/' + this.uri + '/get-by-list-owner-business',
      method: 'GET',
      params: {
        ...query,
        ...{ role: store.getters.currentRole },
      },
    });
  }
  getByBusinessId(query) {
    return request({
      url: '/' + this.uri + '/get-by-business-id',
      method: 'GET',
      params: {
        ...query,
        ...{ role: store.getters.currentRole },
      },
    });
  }
}
export { TargetPeriodRequest as default };
