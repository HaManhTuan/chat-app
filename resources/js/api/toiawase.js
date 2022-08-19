import Resource from '@/api/resource';
import request from '../utils/request';
import store from '../store';

class ToiawaseResource extends Resource {
  constructor() {
    super('toiawase');
  }

  inquiryDetail(id) {
    return request({
      url: '/' + this.uri + '/inquiry-detail/' + id,
      method: 'GET',
    });
  }

  systemDetail(id) {
    return request({
      url: '/' + this.uri + '/system-detail/' + id,
      method: 'GET',
    });
  }

  checkDuplicate(telephone) {
    return request({
      url: '/' + this.uri + '/check-duplicate/' + telephone,
      method: 'GET',
    });
  }

  registerOtherStudent(id, data) {
    return request({
      url: '/' + this.uri + '/register-other-student/' + id,
      method: 'POST',
      data: data,
    });
  }

  registerSameStudent(id, params) {
    return request({
      url: '/' + this.uri + '/register-same-student/' + id,
      method: 'GET',
      params: {
        ...params,
        ...{ role: store.getters.currentRole },
      },
    });
  }

  getCallLog(id) {
    return request({
      url: '/' + this.uri + '/get-call-log/' + id,
      method: 'GET',
    });
  }
  updateSystem(id, resource) {
    return request({
      url: '/' + this.uri + '/update-system/' + id,
      method: 'put',
      data: {
        ...resource,
        ...{ role: store.getters.currentRole },
      },
    });
  }

  updateInfo(id, resource) {
    return request({
      url: '/' + this.uri + '/update-info/' + id,
      method: 'put',
      data: {
        ...resource,
        ...{ role: store.getters.currentRole },
      },
    });
  }
  doCopy(id, resource) {
    return request({
      url: '/' + this.uri + '/do-copy/' + id,
      method: 'put',
      data: {
        ...resource,
        ...{ role: store.getters.currentRole },
      },
    });
  }
}

export { ToiawaseResource as default };
