import request from '@/utils/request';
import Resource from '@/api/resource';
import store from '../store';

class changeRole extends Resource {
  getMyRoles(id, paginate) {
    return request({
      url: 'users/get-my-roles/',
      method: 'get',
      params: {
        id,
        ...paginate,
        ...{ role: store.getters.currentRole },
      },
    });
  }
}

export { changeRole as default };
