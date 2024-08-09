import axios from 'axios';
import api from './api';
import { ProfileType } from '../types/UserType';
const svURL = import.meta.env.VITE_SERVER_URL;
// 사용자 정보 가져오기
export const fetchUserProfile = async (token:string) => {
  
  try {
    if (!token) {
      throw new Error('No access token found');
    }

    const response = await api.get(`/api/users/profiles`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization':  `Bearer ${token}`
      },
    });

    console.log('Profile data:', response.data.data);
    return response.data.data; // 프로필 데이터를 반환합니다.
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Failed to fetch profile:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error; // 오류를 다시 던집니다.
  }
};


//정보 업데이트
const API_URL = `${svURL}/api/users/profiles`;
export const updateUserProfile = async (profile: ProfileType, accessToken : string) => {
  const response = await axios.put(API_URL, profile, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`, // 실제로는 토큰을 가져오는 방법에 맞게 수정
    }
  });
  return response.data;
};
// export const updateUserProfile = async (
//   token: string,
//   profile: ProfileType
// ): Promise<void> => {
//   try {
//     if (!token) {
//       throw new Error('No access token found');
//     }

//     await api.put(
//       `/api/users/profiles`,
//       profile,
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     console.log('Profile update completed');
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.error('Failed to update profile:', error.message);
//     } else {
//       console.error('Unexpected error:', error);
//     }
//     throw error; // 오류를 다시 던집니다.
//   }
// };

//필명 중복 확인
export const checkPenNameAvailability = async (penName: string): Promise<boolean> => {
  try {
    const response = await api.get(`$api/users/pen-names/${penName}`);
    return response.status === 200; // 200일 경우 사용 가능
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 409) {
      // 409일 경우 중복됨
      return false;
    }
    console.error('Failed to check pen name availability');
    throw error;
  }
};