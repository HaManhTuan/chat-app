import request from '@/utils/request';
import Resource from '@/api/resource';
import store from '../store';
class InternalTestSchool extends Resource {
  constructor() {
    super('internal-test');
  }
  fetchInternalTestCommon() {
    return request({
      url: '/' + this.uri + '/common-internal',
      method: 'get',
      params: { ...{ role: store.getters.currentRole }},
    });
  }
  fetchInternalTestByStudentCode(query, studentCode){
    return request({
      url: '/' + this.uri + '/fetch-by-student-code/' + studentCode,
      method: 'get',
      params: {
        ... query,
        ...{ role: store.getters.currentRole },
      },
    });
  }
}
export { InternalTestSchool as default };
