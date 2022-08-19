import request from '@/utils/request';
import Resource from '@/api/resource';
import store from '../store';
class SchoolTestResultResource extends Resource {
  constructor() {
    super('school-test');
  }

  fetchSchoolTestCommon() {
    return request({
      url: '/' + this.uri + '/common-school',
      method: 'get',
      params: { ...{ role: store.getters.currentRole }},
    });
  }
}
export { SchoolTestResultResource as default };
