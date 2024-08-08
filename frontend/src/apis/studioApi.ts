import axios from 'axios';
import { StudioType } from '../types/StudioType';
const svURL = import.meta.env.VITE_SERVER_URL;
const API_URL = `${svURL}/api`;


// 스튜디오조회
export const fetchStudioData = async (): Promise<StudioType[]> => {
    const response = await axios.get<StudioType[]>(`${API_URL}/studios`);
    return response.data;
};


// 스튜디오 생성
export const createStudio = async (formData: FormData): Promise<StudioType> => {
    const response = await axios.post<StudioType>(`${API_URL}/studios`, formData, {
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


