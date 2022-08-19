import request from '@/utils/request';
import Resource from '@/api/resource';
import store from '../store';

class Letter extends Resource {
  getRequestList(paginate) {
    return request({
      url: '/request-list/',
      method: 'get',
      params: {
        ...paginate,
        ...{ role: store.getters.currentRole },
      },
    });
  }

  getLetterList(paginate) {
    return request({
      url: '/letter-list/',
      method: 'get',
      params: {
        ...paginate,
        ...{ role: store.getters.currentRole },
      },
    });
  }
}

export { Letter as default };
