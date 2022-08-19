import Resource from './resource';
import request from '@/utils/request';
import store from '../store';

class CourseRequest extends Resource {
  constructor() {
    super('open-course');
  }

  list(query, displayScreen) {
    return request({
      url: '/' + this.uri + '/list-in-area-search/' + displayScreen,
      method: 'GET',
      params: {
        ...query,
        ...{ role: store.getters.currentRole },
      },
    });
  }

  fetchCondition(query) {
    return request({
      url: '/' + this.uri + '/get-by-condition',
      method: 'GET',
      params: {
        ...query,
        ...{ role: store.getters.currentRole },
      },
    });
  }

  fetchCourseAnnualAndShortTerm(query) {
    return request({
      url: '/' + this.uri + '/get-annual-and-short-term',
      method: 'GET',
      params: {
        ...query,
        ...{ role: store.getters.currentRole },
      },
    });
  }

  fetchCourseAnnualAndShortTermByBusinessId(query) {
    return request({
      url: '/' + this.uri + '/get-annual-and-short-term-by-business-id/',
      method: 'GET',
      params: {
        ...query,
        ...{ role: store.getters.currentRole },
      },
    });
  }

  fetchCourseAnnualAndShortTermByBusinessIdAndGradeId(query) {
    return request({
      url: '/' + this.uri + '/get-annual-and-short-term-by-business-and-grade/',
      method: 'GET',
      params: {
        ...query,
        ...{ role: store.getters.currentRole },
      },
    });
  }

  getAreaList(query, displayScreen, id) {
    return request({
      url: '/' + this.uri + '/get-by-id/' + displayScreen + '/' + id,
      method: 'GET',
      params: {
        ...query,
        ...{ role: store.getters.currentRole },
      },
    });
  }

  getByBusinessId(query) {
    return request({
      url: '/' + this.uri + '/get-by-business-id',
      method: 'GET',
      params: {
        ...query,
        ...{ role: store.getters.currentRole },
      },
    });
  }

  getByGradeIdAndBusinessId(query) {
    return request({
      url: '/' + this.uri + '/get-by-grade-and-business',
      method: 'GET',
      params: {
        ...query,
        ...{ role: store.getters.currentRole },
      },
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

export { CourseRequest as default };
