import request from '@/utils/request';
import store from '../store';

class StudentSystem {
  getBusinessunitList(){
    return request({
      url: '/student-system/businessunit-list',
      method: 'get',
      params: {
        ...{ role: store.getters.currentRole },
      },
    });
  }

  getUserList(){
    return request({
      url: '/student-system/user-list',
      method: 'get',
      params: {
        ...{ role: store.getters.currentRole },
      },
    });
  }

  getCalendarPatternList(){
    return request({
      url: '/student-system/calendar-pattern-list',
      method: 'get',
      params: {
        ...{ role: store.getters.currentRole },
      },
    });
  }

  getStudentCodeList(params){
    return request({
      url: '/student-system/student-code-list',
      method: 'get',
      params: {
        ...params,
        ...{ role: store.getters.currentRole },
      },
    });
  }

  updateStudentSystem(id, params){
    return request({
      url: '/student-system/' + id,
      method: 'put',
      data: {
        ...params,
        ...{ role: store.getters.currentRole },
      },
    });
  }

  delete(studentcode){
    return request({
      url: '/student-system/' + studentcode,
      method: 'delete',
      data: {
        ...{ role: store.getters.currentRole },
      },
    });
  }

  getMainAffiliation(code){
    return request({
      url: '/student-system/main-affiliation',
      method: 'get',
      params: {
        code,
        ...{ role: store.getters.currentRole },
      },
    });
  }

  getStudentCodeListAll(){
    return request({
      url: '/student-system/student-code-list-all',
      method: 'get',
      params: {
        ...{ role: store.getters.currentRole },
      },
    });
  }
}

export { StudentSystem as default };
