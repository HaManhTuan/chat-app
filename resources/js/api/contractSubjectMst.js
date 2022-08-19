import Resource from '@/api/resource';
import request from '@/utils/request';
import store from '../store';
class ContractSubjectMstResource extends Resource {
  constructor() {
    super('subject-master', true);
  }

  subjectSetSearch(formData) {
    return request({
      url: '/' + this.uri + '/search',
      method: 'get',
      params: { ...formData, ...{ role: store.getters.currentRole }},
    });
  }

  exportCSV(formData) {
    return request({
      url: '/' + this.uri + '/export-to-csv',
      method: 'get',
      params: {
        ...formData,
        ...{ role: store.getters.currentRole, is_master: true },
      },
      responseType: 'blob',
    });
  }

  subjectMstListOption(params) {
    return request({
      url: '/' + this.uri + '/subjectmst-list-options',
      method: 'get',
      params: {
        ...params,
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
  searchSubjectCode(params) {
    return request({
      url: '/' + this.uri + '/search-subject-code',
      method: 'get',
      params: {
        ...params,
        ...{ role: store.getters.currentRole },
      },
    });
  }
  getOneSubject(params) {
    return request({
      url: '/' + this.uri + '/get-one-subject',
      method: 'get',
      params: {
        ...params,
        ...{ role: store.getters.currentRole },
      },
    });
  }
}

export { ContractSubjectMstResource as default };
