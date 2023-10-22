import { apiBase } from './api-base';

export const apiAuctionHistory = {
  doSearch: (data) => apiBase.get('/admin/auction-history', data),
  getDetail: (id) => apiBase.get(`/admin/auction-history/${id}`, {}),
};
