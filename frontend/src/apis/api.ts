import axios from 'axios';

const svURL = import.meta.env.VITE_SERVER_URL;

const api = axios.create({
  baseURL: svURL,
  withCredentials: true,
});

// 상태 업데이트 함수를 전달받을 수 있도록 인터셉터 정의
export const setInterceptors = (
  setAccessToken: (token: string) => void,
  setRefreshToken: (value: boolean) => void,
  clearTokens: () => void
) => {

  api.interceptors.response.use(
    response => response,
    async error => {
      const msg = error.response?.data?.message;
      const status = error.response?.status;

      if (status === 401 && msg === 'Access Token is Expired') {
        try {
          const response = await api.post('/api/reissue', {}, {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.status === 200) {
            const newAccessToken = response.headers.authorization.split(' ')[1]; // 'Bearer' 제거
            console.log('여기임:',response)
            setAccessToken(newAccessToken);
            setRefreshToken(true);

            error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return api.request(error.config);
          } else {
            clearTokens();
          }
        } catch (refreshError) {
          console.error('Failed to refresh token', refreshError);
          window.alert('시간이 경과하여 자동으로 로그아웃 되었습니다.');
          clearTokens();
          return Promise.reject(refreshError);
        }
      } else if ([400, 404, 409].includes(status)) {
        window.alert(`${status} : ${msg}`);
      }

      return Promise.reject(error);
    }
  );
};

export default api;
