import request from '@/utils/request';
import Resource from '@/api/resource';
import store from '../store';

class UserResource extends Resource {
  constructor() {
    super('users');
  }

  permissions(id) {
    return request({
      url: '/' + this.uri + '/' + id + '/permissions',
      method: 'get',
    });
  }

  updatePermission(id, permissions) {
    return request({
      url: '/' + this.uri + '/' + id + '/permissions',
      method: 'put',
      data: permissions,
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
  updateLock(id, is_locked){
    return request({
      url: '/' + this.uri + '/lock/' + id,
      method: 'post',
      data: {
        is_locked,
        ...{ role: store.getters.currentRole },
      },
    });
  }
  updateMaintainLock(id, maintain_locked){
    return request({
      url: '/' + this.uri + '/maintain-lock/' + id,
      method: 'put',
      data: {
        maintain_locked,
        ...{ role: store.getters.currentRole },
      },
    });
  }
  fetchRole() {
    return request({
      url: '/role',
      method: 'get',
      params: { role: store.getters.currentRole },
    });
  }
  fetchOrg() {
    return request({
      url: '/organization',
      method: 'get',
      params: { role: store.getters.currentRole },
    });
  }
  deleteOrg(model_id, role_id, organization_id) {
    return request({
      url: '/' + this.uri + '/delete-org',
      method: 'post',
      data: {
        model_id,
        role_id,
        organization_id,
        ...{ role: store.getters.currentRole },
      },
    });
  }
  updateStatus(id, status){
    return request({
      url: '/' + this.uri + '/update-status/' + id,
      method: 'post',
      data: {
        status,
        ...{ role: store.getters.currentRole },
      },
    });
  }
  getAllListUser() {
    return request({
      url: '/' + this.uri + '/get-full-list',
      method: 'get',
      params: { role: store.getters.currentRole },
    });
  }
  changeRole(id) {
    return request({
      url: '/system-user/change-role/',
      method: 'post',
      params: {
        id: id,
        role: store.getters.currentRole,
      },
    });
  }
  getMyRole(id, paginate) {
    return request({
      url: '/system-user/get-my-role/',
      method: 'get',
      params: {
        id: id,
        ...paginate,
        role: store.getters.currentRole,
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
}

export { UserResource as default };
