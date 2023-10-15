import { apiBase } from './api-base';

export const apiAuth = {
  login: (data) => apiBase.post('/authenticate', data),
  refreshToken: (authRequest) => apiBase.post('/refresh-token', authRequest),
  register: (authRegister) => apiBase.post('/register', authRegister),
  forgotPassword: (email) => apiBase.post('/forgotPassword', { email }),
  resetPassword: (changePassToken, newPassword) =>
    apiBase.put('/resetPassword', { changePassToken, newPassword }),
  resendActiveUser: (email) => apiBase.post('/resendActive', { email }),
  getUserinfo: () => apiBase.get('/user', {}),
};
