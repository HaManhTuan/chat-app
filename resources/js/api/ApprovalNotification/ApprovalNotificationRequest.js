import request from '@/utils/request';
import Resource from '@/api/resource';
import store from '@/store/index';

class ApprovalNotificationRequest extends Resource {
  constructor() {
    super('approval-notification');
  }

  countNotApproved(payload) {
    return request({
      url: '/' + this.uri + '/count-not-approved',
      method: 'GET',
      params: {
        ...payload,
        ...{ role: store.getters.currentRole },
      },
    });
  }

  getRegister(payload) {
    return request({
      url: '/' + this.uri + '/notification/get-register',
      method: 'GET',
      params: {
        ...payload,
        ...{ role: store.getters.currentRole },
      },
    });
  }

  getDetail(payload) {
    return request({
      url: '/' + this.uri + '/notification/detail',
      method: 'GET',
      params: {
        ...payload,
        ...{ role: store.getters.currentRole },
      },
    });
  }

  exportDetail(formData, type = 'xls') {
    return request({
      url: '/' + this.uri + '/notification/detail-export-' + type,
      method: 'get',
      params: {
        ...formData,
        ...this.getCurrentRole(),
        ...{ time: new Date().getTime() },
      },
      responseType: 'blob',
    });
  }

  courseFeeCreate(data) {
    return request({
      url: '/approval-notification/course-fee-create',
      method: 'post',
      data: {
        ...data,
      },
      params: {
        ...{ role: store.getters.currentRole },
      },
    });
  }
}

export { ApprovalNotificationRequest as default };
