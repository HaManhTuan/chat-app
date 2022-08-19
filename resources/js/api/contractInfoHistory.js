import Resource from '@/api/resource';
import request from '@/utils/request';
import store from '../store';

class ContractInfoResource extends Resource {
  constructor() {
    super('contract-info-history');
  }

  cantractInfoHistoryList(id, paginate){
    return request({
      url: '/cantract-info-history/list/',
      method: 'get',
      params: {
        id,
        ...paginate,
        role: store.getters.currentRole,
      },
    });
  }

  studentContractInfoHistory(studentCode, params) {
    return request({
      url: '/' + this.uri + '/' + studentCode,
      method: 'get',
      params: { ...params, ...{ role: store.getters.currentRole }},
    });
  }

  cantractInfoHistory(id) {
    return request({
      url: '/cantract-info-history/detail/' + id,
      method: 'get',
      params: { role: store.getters.currentRole },
    });
  }

  updateHistorySubject(id, params) {
    return request({
      url: '/cantract-info-history/detail/' + id,
      method: 'put',
      data: {
        ...params,
        ...{ role: store.getters.currentRole, is_master: true },
      },
    });
  }

  deleteCantractInfoHistory(id) {
    return request({
      url: '/cantract-info-history/detail/' + id,
      method: 'delete',
      params: { role: store.getters.currentRole, is_master: true },
    });
  }
}

export { ContractInfoResource as default };
