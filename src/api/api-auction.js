import { apiBase } from './api-base';

export const apiAuction = {
  doSearch: (data) => apiBase.get('/admin/auction', data),
  getDetail: (id) => apiBase.get(`/admin/auction/${id}`, {}),
  confirm: (id) => apiBase.patch(`/admin/auction/${id}:confirm`, {}),
  reject: (id) => apiBase.patch(`/admin/auction/${id}:reject`, {}),
};
