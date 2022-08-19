import Resource from '@/api/resource';
import request from '@/utils/request';
import store from '../store';

class UserSystem extends Resource {
  constructor() {
    super('system-user');
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
}

export { UserSystem as default };
