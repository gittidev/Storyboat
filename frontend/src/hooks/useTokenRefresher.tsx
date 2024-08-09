// import axios from 'axios';
// import { useSetRecoilState } from 'recoil';
// import { refreshTokenState, accessTokenState } from '../recoil/atoms/authAtom';
// import { useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';

// const svURL = import.meta.env.VITE_SERVER_URL;

// const api = axios.create({
//   baseURL: svURL,
//   withCredentials: true,
// });



// export const useTokenRefresher = () => {
//   const navigate = useNavigate();
//   const setAccessToken = useSetRecoilState(accessTokenState);
//   const setRefreshToken = useSetRecoilState(refreshTokenState);

//   const refreshAccessToken = useCallback(async () => {
//     try {
//       const response = await api.post('/api/reissue', {}, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.status !== 200) {
//         throw new Error('Failed to refresh token');
//       }

//       const newAccessToken = response.headers.authorization;
//       setAccessToken(newAccessToken);
//       setRefreshToken(true);
//       console.log('New access token:', newAccessToken);
//       return newAccessToken;

//     } catch (error) {
//       console.error('Error reissue:', error);
//       setRefreshToken(false);
//       localStorage.clear();
//       navigate('/');
//       window.alert('시간이 경과하여 자동으로 로그아웃 되었습니다.');
//       return null;
//     }
//   }, [navigate, setAccessToken, setRefreshToken]);

//   useEffect(() => {
//     console.log('리프레셔 자동 실행');

//     const interceptor = api.interceptors.response.use(
//       (response) => response,
//       async (error) => {
//         const msg = error.response?.data?.message;
//         const status = error.response?.status;

//         if (status === 401 && msg === 'No permission') {
//           const newAccessToken = await refreshAccessToken();
//           if (newAccessToken) {
//             error.config.headers['Authorization'] = newAccessToken;
//             return api(error.config);
//           }
//         } else if (status === 401 && msg === 'Refresh Token expired') {
//           localStorage.clear();
//           window.alert('시간이 경과하여 자동으로 로그아웃 되었습니다.');
//           navigate('/');
//         } else if ([400, 404, 409].includes(status)) {
//           window.alert(`${status} : ${msg}`);
//         }

//         return Promise.reject(error);
//       }
//     );

//     return () => {
//       api.interceptors.response.eject(interceptor);
//     };
//   }, [navigate, refreshAccessToken]);

//   return refreshAccessToken;
// };
