import Resource from './resource';
import request from '@/utils/request';

import store from '../store';
class RegisterSchool extends Resource {
  constructor() {
    super('register-school');
  }
  createOrUpdate(resource) {
    return request({
      url: '/' + this.uri + '/create-or-update',
      method: 'POST',
      data: {
        ...resource,
        ...{ role: store.getters.currentRole },
      },
    });
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

export { RegisterSchool as default };
