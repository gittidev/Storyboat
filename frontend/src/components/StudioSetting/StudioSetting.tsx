import React, { useState, useEffect } from 'react';
import CustomButton from '../Commons/CustomButton';
import StudioDelete from './StudioDelete';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { selectedStudioState } from '../../recoil/atoms/studioAtom';
import { accessTokenState } from '../../recoil/atoms/authAtom';
import { List, ListItem, ListItemText, Typography, Box } from '@mui/material';

interface Studio {
  name: string;
  description: string;
}

const svURL = import.meta.env.VITE_SERVER_URL;

const StudioSetting: React.FC = () => {
  const selectedStudioId = useRecoilValue(selectedStudioState);
  const accessToken = useRecoilValue(accessTokenState);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [namePlaceholder, setNamePlaceholder] = useState<string>('');
  const [descriptionPlaceholder, setDescriptionPlaceholder] = useState<string>('');
  const [role, setRole] = useState<string>(''); // 사용자 역할 상태
  const [isOwner, setIsOwner] = useState<boolean>(false); // 오너 여부 상태
  console.log(role)
  
  useEffect(() => {
    const fetchStudioDetails = async () => {
      try {
        // 스튜디오 정보 요청
        const studioResponse = await axios.get(`${svURL}/api/studios/${selectedStudioId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        const { name, description } = studioResponse.data.data;
        setName(name);
        setDescription(description);
        setNamePlaceholder(name);
        setDescriptionPlaceholder(description);

        // 사용자 역할 요청
        const roleResponse = await axios.get(`${svURL}/api/studios/${selectedStudioId}/my`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        const userRole = roleResponse.data.data;
        setRole(userRole);
        setIsOwner(userRole === 'ROLE_OWNER');
      } catch (error) {
        console.error('스튜디오 정보를 불러오는 데 실패했습니다:', error);
      }
    };

    fetchStudioDetails();
  }, [selectedStudioId, accessToken]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const studio: Studio = { name, description };
    try {
      await axios.put(
        `${svURL}/api/studios/${selectedStudioId}`,
        studio,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      alert('스튜디오 정보가 성공적으로 업데이트되었습니다.');
    } catch (error) {
      console.error('스튜디오 정보를 업데이트하는 데 실패했습니다:', error);
      alert('스튜디오 정보 업데이트에 실패했습니다.');
    }
  };

  return (
    <Box sx={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      {isOwner ? (
        <form onSubmit={handleSubmit}>
          <Box sx={{ marginBottom: '1rem' }}>
            <Typography variant="h6">스튜디오 설정</Typography>
            <Box sx={{ marginBottom: '1rem' }}>
              <br/>
              <label>
                Studio 이름
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={namePlaceholder}
                  style={{ display: 'block', width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
                  required
                />
              </label>
            </Box>

            <Box sx={{ marginBottom: '1rem' }}>
              <label>
                스튜디오 설명
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={descriptionPlaceholder}
                  style={{ display: 'block', width: '100%', padding: '0.5rem', boxSizing: 'border-box', height: '100px' }}
                  required
                />
              </label>
            </Box>
            <div style={{ textAlign: 'right' }}>
            <CustomButton type="submit" content="저장하기" bgcolor="#77E4C8" hoverBgColor="#4C3BCF"/>
            </div>
          
          </Box>

          {isOwner && <StudioDelete />} {/* 오너일 때만 삭제 버튼 보이기 */}
          
        </form>
      ) : (
        <Box>
          <Typography variant="h6" sx={{ marginBottom: '1rem' }}>스튜디오 정보</Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Studio 이름"
                secondary={name}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="스튜디오 설명"
                secondary={description}
              />
            </ListItem>
          </List>
        </Box>
      )}
    </Box>
  );
};

export default StudioSetting;
