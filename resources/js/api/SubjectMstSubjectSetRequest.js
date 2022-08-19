import Resource from './resource';
import store from '../store';
import request from '@/utils/request';

class SubjectMstSubjectSetRequest extends Resource {
  constructor() {
    super('subject-mst-subject-set');
  }
  getListSubjectDefault(query) {
    return request({
      url: '/' + this.uri + '/get-list-default',
      method: 'get',
      params: {
        ...query,
        ...{ role: store.getters.currentRole,
        }},
    });
  }
  getListSubject(query) {
    return request({
      url: '/' + this.uri + '/get-all-list',
      method: 'get',
      params: {
        ...query,
        ...{ role: store.getters.currentRole,
        }},
    });
  }
  getOneSubject(query) {
    return request({
      url: '/' + this.uri + '/get-one-subject',
      method: 'get',
      params: {
        ...query,
        ...{ role: store.getters.currentRole,
        }},
    });
  }
}
export { SubjectMstSubjectSetRequest as default };
