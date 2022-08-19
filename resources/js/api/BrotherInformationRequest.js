import Resource from './resource';
import request from '@/utils/request';
import store from '../store';

class BrotherInformationRequest extends Resource {
  constructor() {
    super('brother-information');
  }

  getByRegisterInternalCode(query, internalCode) {
    return request({
      url: '/' + this.uri + '/get-by-register-internal-code/' + internalCode,
      method: 'GET',
      params: {
        ...query,
        ...{ role: store.getters.currentRole },
      },
    });
  }
}
export { BrotherInformationRequest as default };
