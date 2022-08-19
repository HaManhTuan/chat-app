import Resource from './resource';
import request from '@/utils/request';
import store from '../store';
class RegisterTrialRequest extends Resource {
  constructor() {
    super('register-trial');
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
}

export { RegisterTrialRequest as default };
