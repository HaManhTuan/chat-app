import Resource from './resource';
import request from '@/utils/request';
import store from '../store';
class LearningTrialRequest extends Resource {
  constructor() {
    super('learning-trial');
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

export { LearningTrialRequest as default };
