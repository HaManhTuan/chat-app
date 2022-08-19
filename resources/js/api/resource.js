import request from '@/utils/request';
import store from '../store';

/**
 * Simple RESTful resource class
 */
class Resource {
  constructor(uri, is_master = false) {
    this.uri = uri;
    this.is_master = is_master;
  }

  getCurrentRole() {
    const obj = { role: store.getters.currentRole };
    if (this.is_master) {
      obj.is_master = this.is_master;
    }
    return obj;
  }

  list(query) {
    return request({
      url: '/' + this.uri,
      method: 'get',
      params: {
        ...query,
        ...this.getCurrentRole(),
      },
    });
  }

  get(id) {
    return request({
      url: '/' + this.uri + '/' + id,
      method: 'get',
      params: {
        ...this.getCurrentRole(),
      },
    });
  }

  store(resource) {
    return request({
      url: '/' + this.uri,
      method: 'post',
      data: {
        ...resource,
        ...this.getCurrentRole(),
      },
    });
  }

  update(id, resource) {
    return request({
      url: '/' + this.uri + '/' + id,
      method: 'put',
      data: {
        ...resource,
        ...this.getCurrentRole(),
      },
    });
  }

  destroy(id) {
    return request({
      url: '/' + this.uri + '/' + id,
      method: 'delete',
      params: {
        ... this.getCurrentRole(),
      },
    });
  }

  exportResource(formData, type = 'xls') {
    return request({
      url: '/' + this.uri + '/export-' + type,
      method: 'get',
      params: {
        ...formData,
        ...this.getCurrentRole(),
        ...{ time: (new Date()).getTime() },
      },
      responseType: 'blob',
    });
  }
}

export { Resource as default };
