import api from './api';
import { StudioType } from '../types/StudioType';



// 스튜디오조회
export const fetchStudioDataTest = async (token: string): Promise<StudioType[]> => {
    const response = await api.get<{ data: StudioType[] }>('/api/studios', {
        headers: {
        Authorization: `Bearer ${token}`,
},
    });
    console.log('API Response:', response.data); // 디버깅용 로그
    return response.data.data; // API 응답에서 data 배열을 반환
};

// 스튜디오 생성
export const createStudioTest = async (formData: FormData): Promise<StudioType> => {
    const response = await api.post<StudioType>(`/api/studios`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};

// 스튜디오 수정



// 스튜디오 삭제


// 스튜디오 플랜 변경


// 스튜디오 참여 요청자 조회


// 스튜디오 참여 요청 수락/ 거절


