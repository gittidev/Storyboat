// import axios from 'axios';

// const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

// export const getGoogleAuthToken = async (): Promise<string> => {
//   try {
//     const response = await axios.get(`${backendUrl}/oauth2/authorization/google`, {
//       withCredentials: true, // 필요한 경우 쿠키를 포함
//     });
//     return response.data.token; // 서버에서 토큰을 이렇게 보내준다고 가정
//   } catch (error) {
//     console.error('Error fetching Google auth token:', error);
//     throw error;
//   }
// };

// export const getKaKaoAuthToken = async (): Promise<string> => {
//     try {
//       const response = await axios.get(`${backendUrl}/oauth2/authorization/kakao`, {
//         withCredentials: true, // 필요한 경우 쿠키를 포함
//       });
//       return response.data.token; // 서버에서 토큰을 이렇게 보내준다고 가정
//     } catch (error) {
//       console.error('Error fetching KaKao auth token:', error);
//       throw error;
//     }
//   };
// export const getNaverAuthToken = async (): Promise<string> => {
//     try {
//       const response = await axios.get(`${backendUrl}/oauth2/authorization/naver`, {
//         withCredentials: true, // 필요한 경우 쿠키를 포함
//       });
//       return response.data.token; // 서버에서 토큰을 이렇게 보내준다고 가정
//     } catch (error) {
//       console.error('Error fetching Naver auth token:', error);
//       throw error;
//     }
//   };

import Cookies from 'js-cookie'

export const getRefreshToken = (): string | undefined => {
  const refreshToken = Cookies.get('refresh_token');
  console.log(refreshToken)
  return refreshToken;
};

export const OAuthUrl = `${import.meta.env.VITE_API_BASE_URL}/api/oauth2/authorization`;