import Resource from './resource';
import request from '@/utils/request';
import store from '../store';

class AdmissionFeeRequest extends Resource {
  constructor() {
    super('admission-fee');
  }

  getByInternalCode(query, internalCode) {
    return request({
      url: '/' + this.uri + '/get-by-internal-code/' + internalCode,
      method: 'GET',
      params: {
        ...query,
        ...{ role: store.getters.currentRole },
      },
    });
  }
}
export { AdmissionFeeRequest as default };
