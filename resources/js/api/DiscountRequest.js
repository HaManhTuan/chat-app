import Resource from './resource';
import request from '@/utils/request';
import store from '../store';

class DiscountRequest extends Resource {
  constructor() {
    super('discount', true);
  }

  list(query) {
    return request({
      url: '/' + this.uri + '/list-in-area-list',
      method: 'GET',
      params: {
        ...query,
        ...{ role: store.getters.currentRole },
      },
    });
  }

  fetchWithCondition(query) {
    return request({
      url: '/' + this.uri + '/fetch-with-condition',
      method: 'GET',
      params: {
        ...query,
        ...{ role: store.getters.currentRole },
      },
    });
  }

  getByStudentCodeAndGradeIdAndSchoolYear(query) {
    return request({
      url: '/' + this.uri + '/fetch-by-student-code-and-grade-and-school-year',
      method: 'GET',
      params: {
        ...query,
        ...{ role: store.getters.currentRole },
      },
    });
  }

  searchNameDiscount(query) {
    return request({
      url: '/' + this.uri + '/search-name-discount-by-student',
      method: 'GET',
      params: {
        ...query,
        ...{ role: store.getters.currentRole },
      },
    });
  }

  // search select box
  searchName(params) {
    return request({
      url: '/' + this.uri + '/search-name',
      method: 'GET',
      params: {
        ...params,
        ...{ role: store.getters.currentRole },
      },
    });
  }

  listDiscount(query) {
    return request({
      url: '/' + this.uri,
      method: 'get',
      params: {
        ...query,
        ...{ role: store.getters.currentRole, is_master: true },
      },
    });
  }
  fetchGrades() {
    return request({
      url: '/grade',
      method: 'get',
      params: {
        ...{ role: store.getters.currentRole },
      },
    });
  }
  updateStatus(id, status){
    return request({
      url: '/' + this.uri + '/update-status/' + id,
      method: 'put',
      data: {
        status,
        ...{ role: store.getters.currentRole },
      },
    });
  }
  searchHeadDivisionName(params) {
    return request({
      url: '/' + this.uri + '/search-headdivision',
      method: 'get',
      params: {
        ...params,
        ...{ role: store.getters.currentRole },
      },
    });
  }
  searchDivisionName(params) {
    return request({
      url: '/' + this.uri + '/search-division',
      method: 'get',
      params: {
        ...params,
        ...{ role: store.getters.currentRole },
      },
    });
  }
  searchAreaName(params) {
    return request({
      url: '/' + this.uri + '/search-area',
      method: 'get',
      params: {
        ...params,
        ...{ role: store.getters.currentRole },
      },
    });
  }
  searchUnitName(params) {
    return request({
      url: '/' + this.uri + '/search-unit',
      method: 'get',
      params: {
        ...params,
        ...{ role: store.getters.currentRole },
      },
    });
  }
}

export { DiscountRequest as default };
