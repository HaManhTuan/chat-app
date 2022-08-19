import request from '@/utils/request';
import Resource from '@/api/resource';

class RegisterOther extends Resource {
  constructor() {
    super('register-other');
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

export { RegisterOther as default };
