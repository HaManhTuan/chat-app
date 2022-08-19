import request from '@/utils/request';
import Resource from '@/api/resource';
import store from '../store';

class SchoolResource extends Resource {
  constructor() {
    super('school', true);
  }

  fetchAll(query) {
    return request({
      url: '/' + this.uri + '/list',
      method: 'GET',
      params: {
        ...query,
        ...{ role: store.getters.currentRole },
      },
    });
  }

  fetchCommon() {
    return request({
      url: '/' + this.uri + '/common',
      method: 'get',
    });
  }

  updateStatus(id, status) {
    return request({
      url: '/' + this.uri + '/update-status/' + id,
      method: 'post',
      data: { status },
    });
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
export { SchoolResource as default };
