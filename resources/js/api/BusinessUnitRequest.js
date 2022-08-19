import Resource from './resource';
import store from '../store';
import request from '@/utils/request';

class BusinessUnitRequest extends Resource {
  constructor() {
    super('business');
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
  searchOrgName(params) {
    return request({
      url: '/' + this.uri + '/search-org-name',
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
  searchParentBusinessUnitIdName(params) {
    return request({
      url: '/' + this.uri + '/search-parent-bussiness-unit',
      method: 'get',
      params: {
        ...params,
        ...{ role: store.getters.currentRole },
      },
    });
  }
  searchGraduationGradeCode(params){
    return request({
      url: '/' + this.uri + '/search-graduation-grade',
      method: 'get',
      params: {
        ...params,
        ...{ role: store.getters.currentRole },
      },
    });
  }
  getOne(id) {
    return request({
      url: '/' + this.uri + '/get-one/' + id,
      method: 'get',
    });
  }
}

export { BusinessUnitRequest as default };
