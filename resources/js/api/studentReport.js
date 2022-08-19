import request from '@/utils/request';
import Resource from '@/api/resource';
import store from '../store';

class StudentReport extends Resource {
  getList(paginate) {
    return request({
      url: '/student-report/get-list',
      method: 'get',
      params: {
        ...paginate,
        ...{ role: store.getters.currentRole },
      },
    });
  }
}

export { StudentReport as default };
