import { apiBase } from './api-base';

export const apiProduct = {
  doSearch: (data) => apiBase.get('/admin/product/query', data),
  create: (data) => apiBase.postFormData('/admin/product', data),
  update: (id, data) => apiBase.putFormData(`/admin/product/${id}`, data),
  delete: (productId) => apiBase.delete(`/admin/product/${productId}`, {}),
  active: (id) => apiBase.patch(`/admin/product/${id}:active`, {}),
  inactive: (id) => apiBase.patch(`/admin/product/${id}:inactive`, {}),
  getDetail: (id) => apiBase.get(`/admin/product/${id}`, {}),
  getTypes: () => apiBase.get(`/admin/product/product/type/all`, {}),
};
