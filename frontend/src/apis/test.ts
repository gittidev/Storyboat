import axios from 'axios';
import { getRecoil, setRecoil } from 'recoil-nexus'; // Recoil 상태를 사용하기 위해

import { accessTokenState, refreshTokenState } from '../recoil/atoms/authAtom';

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});

// Add a request interceptor
api.interceptors.request.use((config) => {
  const accessToken = getRecoil(accessTokenState);
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Add a response interceptor
api.interceptors.response.use(
  response => response,
  async (error) => {
    const { response } = error;
    const status = response?.status;
    const msg = response?.data?.message;

    if (status === 401 && msg === 'Access Token is Expired') {
      try {
        const refreshToken = getRecoil(refreshTokenState);
        const refreshResponse = await api.post('/api/reissue', {}, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${refreshToken}`,
          },
        });

        if (refreshResponse.status === 200) {
          const newAccessToken = refreshResponse.headers.authorization.split(' ')[1];
          setRecoil(accessTokenState, newAccessToken);
          error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return api.request(error.config);
        }
      } catch (refreshError) {
        console.error('Failed to refresh token', refreshError);
        setRecoil(accessTokenState, '');
        setRecoil(refreshTokenState, false);
        window.location.href = '/login';
      }
    } else if ([400, 404, 409].includes(status)) {
      window.alert(`${status} : ${msg}`);
    }
    return Promise.reject(error);
  }
);

export default api;
