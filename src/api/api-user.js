import { apiBase } from './api-base';

export const apiUser = {
  doSearch: (data) => apiBase.get('/admin/user', data),
  create: (data) => apiBase.post('/admin/user/registration', data),
  update: (data) => apiBase.put(`/admin/user/update/${data.id}`, data),
  active: (userId) => apiBase.patch(`/admin/user/${userId}:active`, {}),
  inactive: (userId) => apiBase.patch(`/admin/user/${userId}:inactive`, {}),
  getDetail: (userId) => apiBase.get(`/admin/user/${userId}`, {}),
  getInfo: () => apiBase.get(`/admin/user/detail`, {}),
};
