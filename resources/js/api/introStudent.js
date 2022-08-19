import request from '@/utils/request';
import Resource from '@/api/resource';
import store from '../store';

class IntroStudent extends Resource {
  getList(paginate) {
    return request({
      url: '/intro-list/',
      method: 'get',
      params: {
        ...paginate,
        ...{ role: store.getters.currentRole },
      },
    });
  }
}

export { IntroStudent as default };
