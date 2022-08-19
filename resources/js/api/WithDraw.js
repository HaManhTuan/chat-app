import request from '@/utils/request';
import Resource from '@/api/resource';
import store from '../store';

class WithDrawResource extends Resource {
  constructor() {
    super('withdraw');
  }
  getWithDrawWithStudentCode(query, studentCode) {
    return request({
      url: '/' + this.uri + '/get-withdraw/' + studentCode,
      method: 'get',
      params: {
        ...query,
        ...{ role: store.getters.currentRole },
      },
    });
  }
  delete(id) {
    return request({
      url: '/' + this.uri + '/' + id,
      method: 'delete',
      params: { role: store.getters.currentRole },
    });
  }
}

export { WithDrawResource as default };
