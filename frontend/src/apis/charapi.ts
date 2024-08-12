// charpai.ts

import axios from 'axios';
import { Character } from '../types/Chartype';
import api from './api';

// 서버 URL을 환경 변수에서 가져옵니다.
const API_URL = import.meta.env.VITE_SERVER_URL;

// 캐릭터 목록 조회
export const fetchCharacters = async (studioId: string | number, token: string | null): Promise<Character[]> => {
    try {
      if (!token) {
        throw new Error('No authentication token provided');
      }
  
      const response = await api.get<{ data: { characters: Character[] } }>(`/api/studios/${studioId}/characters`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.status !== 200) {
        throw new Error('Network response was not ok');
      }
  
      return response.data.data.characters;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching characters:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
      throw error; // Propagate the error
    }
  };

// 캐릭터 생성
export const createCharacter = async (studioId: string | number, formData: FormData, token: string | null): Promise<Character> => {
  try {
    const response = await api.post<{ data: Character }>(`/api/studios/${studioId}/characters`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status !== 201) {
      throw new Error('캐릭터 생성에 문제가 발생했습니다.');
    }

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('캐릭터 생성에 실패했습니다:', error.message);
    } else {
      console.error('예상치 못한 오류 발생:', error);
    }
    throw error; // 에러를 호출자에게 전달
  }
};

// 캐릭터 업데이트
export const updateCharacter = async (studioId: string | number, id: number, formData: FormData, token: string | null): Promise<Character> => {
  try {
    const response = await api.put<{ data: Character }>(`/api/studios/${studioId}/characters/${id}`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status !== 200) {
      throw new Error('캐릭터 업데이트에 문제가 발생했습니다.');
    }

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('캐릭터 업데이트에 실패했습니다:', error.message);
    } else {
      console.error('예상치 못한 오류 발생:', error);
    }
    throw error; // 에러를 호출자에게 전달
  }
};

// 캐릭터 삭제
export const deleteCharacter = async (studioId: string | number, id: number, token: string | null): Promise<void> => {
  try {
    const response = await api.delete(`${API_URL}/api/studios/${studioId}/characters/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status !== 204) {
      throw new Error('캐릭터 삭제에 문제가 발생했습니다.');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('캐릭터 삭제에 실패했습니다:', error.message);
    } else {
      console.error('예상치 못한 오류 발생:', error);
    }
    throw error; // 에러를 호출자에게 전달
  }
};
