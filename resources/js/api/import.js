import Resource from '@/api/resource';
import request from '../utils/request';
import store from '../store';

class ImportResource extends Resource {
  constructor() {
    super('import');
  }

  upload(data) {
    return request.post('/' + this.uri + '/upload', data, { timeout: 600000 });
  }

  delete(id) {
    return request.post('/' + this.uri + '/delete/' + id);
  }

  downloadOrigin($id){
    return request({
      url: '/' + this.uri + '/download-origin/' + $id,
      method: 'get',
      responseType: 'blob',
      params: { role: store.getters.currentRole },
    });
  }

  downloadFileLog($id){
    return request({
      url: '/' + this.uri + '/download-log/' + $id,
      method: 'get',
      responseType: 'blob',
      params: { role: store.getters.currentRole },
    });
  }

  exportCSV(formData){
    return request({
      url: '/' + this.uri + '/export-to-csv',
      method: 'get',
      responseType: 'blob',
      params: {
        ...formData,
        ...{ role: store.getters.currentRole },
        ...{ time: (new Date()).getTime() },
      },
    });
  }
}

export { ImportResource as default };
