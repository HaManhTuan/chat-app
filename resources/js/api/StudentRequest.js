import request from '@/utils/request';
import Resource from './resource';
import store from '../store';

class StudentRequest extends Resource {
  search(query) {
    return request({
      url: '/students/search',
      method: 'get',
      params: { ...query, ...{ role: store.getters.currentRole }},
    });
  }
}
export { StudentRequest as default };
