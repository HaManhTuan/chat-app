import Resource from '@/api/resource';
import request from '@/utils/request';
import store from '../store';

class CourseResource extends Resource {
  constructor() {
    super('open-course', true);
  }
  exportCSV(){
    return request({
      url: '/' + this.uri + '/export-to-csv',
      method: 'get',
      responseType: 'blob',
      params: { role: store.getters.currentRole, is_master: true },
    });
  }
  updateAll(resource){
    return request({
      url: '/' + this.uri + '/update-all',
      method: 'put',
      data: {
        ...resource,
        ...{ role: store.getters.currentRole, is_master: true },
      },
    });
  }
  courseListOption(params) {
    return request({
      url: '/' + this.uri + '/course-list-options',
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
}

export { CourseResource as default };
