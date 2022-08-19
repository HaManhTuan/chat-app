import Resource from '@/api/resource';
import request from '@/utils/request';
import store from '../store';

class CallLogResource extends Resource {
  constructor() {
    super('call-log');
  }

  update(resource) {
    return request({
      url: '/' + this.uri,
      method: 'post',
      data: {
        ...resource,
        ...{ role: store.getters.currentRole },
      },
    });
  }
  list(params) {
    return request({
      url: '/call-log/list',
      method: 'get',
      params: {
        ...params,
      },
    });
  }
}

export { CallLogResource as default };
