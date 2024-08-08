import { useRecoilState, useRecoilValue } from 'recoil';
import React, { useState } from 'react';
import { StudioType } from '../../types/StudioType';
import { studioListState } from '../../recoil/atoms/studioAtom';
import CustomButton from '../Commons/CustomButton';
import TextField from '@mui/material/TextField';

import axios from 'axios';
import { useSetRecoilState } from 'recoil';
import { fetchStudios } from '../../utils/studioUtils';
import { accessTokenState } from '../../recoil/atoms/authAtom';
const svURL = import.meta.env.VITE_SERVER_URL;
interface StudioFormProps {
  onSave?: (studio: StudioType) => void;
  onClose: () => void;
}


const StudioForm: React.FC<StudioFormProps> = ({ onSave, onClose }) => {
  const [studioList, setStudioList] = useRecoilState(studioListState);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  
  const setStudios = useSetRecoilState(studioListState);
  const accessToken = useRecoilValue(accessTokenState)
  console.log('엑세스:', accessToken);  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 새로운 스튜디오 데이터를 설정
    const newStudio = {
      name : name,
      description : description
    };

    try {
      console.log('엑세스:', accessToken);
      // POST 요청을 보내기
      const response = await axios.post(`${svURL}/api/studios`,newStudio, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization':  `Bearer ${accessToken}`, // 액세스 토큰을 헤더에 포함
        }
      });
      // 응답이 성공적이지 않으면 에러 발생
      if (response.status !== 200 && response.status !== 201) {
        throw new Error('네트워크 응답에 문제가 발생했습니다.');
      }

      // 응답 데이터 파싱
      const data = response.data;

      // 스튜디오 리스트 업데이트
      setStudioList([...studioList, data]);

      // onSave 콜백 호출
      if (onSave) {
        onSave(data);
      }

      // 스튜디오 목록을 다시 가져옴
      fetchStudios(accessToken, setStudios);

      // 폼 닫기
      onClose();
    } catch (error) {
      console.error('스튜디오 생성 중 오류 발생:', error);
    } finally {
      // 로딩 상태 해제
      setLoading(false);
    }
  };

  return (
    <>
    
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '10px' }}>
        <div>
          <TextField
            required
            id="outlined-required"
            label="STUDIO 이름"
            placeholder='스튜디오 이름을 작성하세요'
            sx={{ marginBottom: '15px', width: '100%' }}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            required
            id="outlined-multiline-static"
            label="스튜디오 설명"
            multiline
            rows={4}
            placeholder='스튜디오 설명을 작성하세요'
            sx={{ marginBottom: '15px', width: '100%' }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <CustomButton type="submit" content="생성하기" bgcolor='lightgreen' hoverBgColor='green' disabled={loading} width='' />
          <CustomButton type="button" content="취소하기" bgcolor='gray' hoverBgColor='red' onClick={onClose} />
        </div>
        {loading && <p>저장 중...</p>}
      </form>
    </>
  );
};

export default StudioForm;