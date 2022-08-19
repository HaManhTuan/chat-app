import Resource from './resource';
import store from '../store';
import request from '@/utils/request';

class SubjectSet extends Resource {
  constructor() {
    super('subject-set', true);
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
      params: { ...formData,
        ...{ role: store.getters.currentRole, is_master: true },
      },
      responseType: 'blob',
    });
  }

  getOptionBrand() {
    return request({
      url: '/' + this.uri + '/get-option-brand',
      method: 'get',
      params: { ...{ role: store.getters.currentRole }},
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

export { SubjectSet as default };
