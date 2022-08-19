
import Resource from '@/api/resource';
import request from '@/utils/request';

class ApprovalAcceptedResource extends Resource {
  constructor() {
    super('approval-accepted');
  }
  approval(resource) {
    return request({
      url: '/' + this.uri + '/approval',
      method: 'post',
      data: {
        ...resource,
        ...this.getCurrentRole(),
      },
    });
  }
  approvalById(id, resource) {
    return request({
      url: '/' + this.uri + '/approval-by-id/' + id,
      method: 'post',
      data: {
        ...resource,
        ...this.getCurrentRole(),
      },
    });
  }
  createAbsentApproval(resource) {
    return request({
      url: '/' + this.uri + '/create-absent',
      method: 'post',
      data: {
        ...resource,
        ...this.getCurrentRole(),
      },
    });
  }
  createWithDrawalApproval(resource) {
    return request({
      url: '/' + this.uri + '/create-withdrawal',
      method: 'post',
      data: {
        ...resource,
        ...this.getCurrentRole(),
      },
    });
  }

  mangerApprove(resource) {
    return request({
      url: '/' + this.uri + '/manager-approve',
      method: 'post',
      data: {
        ...resource,
        ...this.getCurrentRole(),
      },
    });
  }
  reject(id) {
    return request({
      url: '/' + this.uri + '/reject/' + id,
      method: 'post',
      data: {
        ...this.getCurrentRole(),
      },
    });
  }
  parallelLearning(id, resource) {
    return request({
      url: '/' + this.uri + '/parallel-learning/' + id,
      method: 'post',
      data: {
        ...resource,
        ...this.getCurrentRole(),
      },
    });
  }

  countNotification(payload = null) {
    return request({
      url: '/' + this.uri + '/count-notification',
      method: 'GET',
      params: {
        ...payload,
        ...this.getCurrentRole(),
      },
    });
  }

  checkExistApproval(resource) {
    return request({
      url: '/' + this.uri + '/check-exist-approval',
      method: 'POST',
      params: {
        ...resource,
        ...this.getCurrentRole(),
      },
    });
  }
}

export { ApprovalAcceptedResource as default };
