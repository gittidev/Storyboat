import axios from 'axios';
import Cookies from 'js-cookie';
import api from './api';


// 로그아웃
export const logout = async (token : string) => {
  console.log(token)
  try {
    const response = await api.post('/api/logout', {}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },


    });

    if (response.status === 200 ) {
      console.log('로그아웃 성공');
      Cookies.remove('refresh');
      localStorage.removeItem('recoil-persist'); 
      localStorage.clear()

    } else {
      console.error('로그아웃 실패:', response.data.message);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('로그아웃 실패:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
  }
};


// // 회원 탈퇴
// export const deleteAccount = async () => {
//   try {
//     const response = await api.delete('/api/users', {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     if (response.status === 200) {
//       console.log('회원 탈퇴 성공');
//       await logout();
//     } else {
//       console.error('회원 탈퇴 실패:', response.data.message);
//     }
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.error('회원 탈퇴 실패:', error.message);
//     } else {
//       console.error('Unexpected error:', error);
//     }
//   }
// };

// src/api/auth.ts
export const verifyRefreshToken = async () => {
  try {
    const response = await api.post('/api/reissue', {}, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      const newAccessToken = response.headers.authorization.split(' ')[1];// 'Bearer' 제거
      console.log(response.headers)
      return newAccessToken;
    } else {
      throw new Error('Failed to refresh token');
    }
  } catch (error) {
    throw new Error;
  }
};