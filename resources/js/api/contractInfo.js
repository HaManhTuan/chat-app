import Resource from '@/api/resource';
import request from '@/utils/request';
import store from '../store';

class ContractInfoResource extends Resource {
  constructor() {
    super('contract-info');
  }
  studentContractInfo(studentCode, params) {
    return request({
      url: '/' + this.uri + '/' + studentCode,
      method: 'get',
      params: { ...params, ...{ role: store.getters.currentRole }},
    });
  }
  updateDetail(id, resource) {
    return request({
      url: '/' + this.uri + '/update-detail/' + id,
      method: 'put',
      data: {
        ...resource,
        ...{ role: store.getters.currentRole },
      },
    });
  }
  checkValidateContractInfoDetail(id, resource) {
    return request({
      url: '/' + this.uri + '/check-validate-detail/' + id,
      method: 'put',
      data: {
        ...resource,
        ...{ role: store.getters.currentRole },
      },
    });
  }
  detailOneContract(id) {
    return request({
      url: '/' + this.uri + '/detail/' + id,
      method: 'get',
      data: {
        ...{ role: store.getters.currentRole },
      },
    });
  }
}

export { ContractInfoResource as default };
