import { apiBase } from './api-base';

export const apiAuctionAction = {
  doSearch: (data) => apiBase.get('/customer/product/query', data),
  getDetail: (id) => apiBase.get(`/customer/product/${id}`, {}),
};
