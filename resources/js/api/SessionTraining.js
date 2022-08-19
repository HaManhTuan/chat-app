import request from '@/utils/request';
import Resource from '@/api/resource';

class SessionTraining extends Resource {
  constructor() {
    super('session-training');
  }
  getOptions(data, params) {
    return request({
      url: '/' + this.uri + '/options',
      method: 'post',
      data: data,
      params: {
        ...params,
        ...this.getCurrentRole(),
      },
    });
  }
  getJoinInfo(query) {
    return request({
      url: '/' + this.uri + '/join-info',
      method: 'get',
      params: {
        ...query,
        ...this.getCurrentRole(),
      },
    });
  }
  storeOrUpdate(resource, params) {
    return request({
      url: '/' + this.uri,
      method: 'post',
      data: {
        ...resource,
        ...this.getCurrentRole(),
      },
      params: {
        ...params,
        ...this.getCurrentRole(),
      },
    });
  }
}

export { SessionTraining as default };
