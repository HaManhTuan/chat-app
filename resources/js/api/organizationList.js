import Resource from '@/api/resource';
import store from '../store';
import request from '@/utils/request';

class OrganizationResource extends Resource {
  constructor() {
    super('organization-list');
  }
  listHeaddivision(params) {
    return request({
      url: '/' + this.uri + '/list-headdivision',
      method: 'get',
      params: {
        ...params,
        ...{ role: store.getters.currentRole },
      },
    });
  }
  listDivision(params) {
    return request({
      url: '/' + this.uri + '/list-division',
      method: 'get',
      params: {
        ...params,
        ...{ role: store.getters.currentRole },
      },
    });
  }
  listArea(params) {
    return request({
      url: '/' + this.uri + '/list-area',
      method: 'get',
      params: {
        ...params,
        ...{ role: store.getters.currentRole },
      },
    });
  }
  listUnit(params) {
    return request({
      url: '/' + this.uri + '/list-unit',
      method: 'get',
      params: {
        ...params,
        ...{ role: store.getters.currentRole },
      },
    });
  }
}
export { OrganizationResource as default };
