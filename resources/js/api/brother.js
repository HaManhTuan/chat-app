import request from '@/utils/request';
import Resource from '@/api/resource';
import store from '../store';

class BrotherInfo extends Resource {
  getBrotherList(id, paginate) {
    const per_page = paginate.limit ? paginate.limit : 2;
    const page = paginate.page ? paginate.page : 1;
    return request({
      url: '/brother-list/' + id + '?page=' + page + '&per_page=' + per_page,
      method: 'get',
      params: {
        ...{ role: store.getters.currentRole },
      },
    });
  }

  getSearchBrother(params) {
    return request({
      url: '/brother-list-search',
      method: 'get',
      params: {
        ...{ role: store.getters.currentRole },
        ...params,
      },
    });
  }

  getBrotherInfoById(id){
    return request({
      url: '/brother-info-by-id/' + id,
      method: 'get',
      params: {
        ...{ role: store.getters.currentRole },
      },
    });
  }

  create(params){
    return request({
      url: '/brother-info/',
      method: 'put',
      params: {
        ...params,
        ...{ role: store.getters.currentRole },
      },
    });
  }

  update(id, params){
    return request({
      url: '/brother-info/' + id,
      method: 'post',
      params: {
        ...params,
        ...{ role: store.getters.currentRole },
      },
    });
  }

  delete(id){
    return request({
      url: '/brother-info/' + id,
      method: 'delete',
      params: {
        ...{ role: store.getters.currentRole },
      },
    });
  }
  search(params){
    return request({
      url: '/brother-info-search/',
      method: 'get',
      params: {
        ...params,
        ...{ role: store.getters.currentRole },
      },
    });
  }
}

export { BrotherInfo as default };
