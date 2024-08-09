import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button } from '@mui/material';
import { accessTokenState } from '../recoil/atoms/authAtom';
import { useRecoilValue, useRecoilState } from 'recoil';
import { FindTeamType } from '../types/StudioType';
import { findTeamDetailState } from '../recoil/atoms/studioAtom';

const svURL = import.meta.env.VITE_SERVER_URL;

const FindTeamDetail: React.FC = () => {
  const { studioId } = useParams<{ studioId: string }>();
  const [detail, setDetail] = useRecoilState<FindTeamType>(findTeamDetailState);
  const accessToken = useRecoilValue(accessTokenState);
//   const [findTeams, setFindTeams] = useRecoilState<FindTeamType[]>(findTeamState);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await axios.get(`${svURL}/api/invitations/${studioId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setDetail(response.data.data);
      } catch (error) {
        console.error('Failed to fetch detail:', error);
      }
    };

    fetchDetail();
  }, [studioId, accessToken, setDetail]);

  // const handleBackClick = () => {
  //   setDetail(); // 상태를 빈 배열로 설정
  //   navigate('/storyboat/invitations'); // 뒤로가기
  // };
  const handleBackClick = () => {
    setDetail({
      invitationId: 0,
      studioId: 0,
      title: '',
      description: '',
      tags: [],
    });
    navigate('/storyboat/invitations');
  };
  const handleJoinRequest = async () => {
    try {
      await axios.post(
        `${svURL}/api/studios/${studioId}/join-requests`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // 요청 성공 후 처리
      alert('참여 요청이 성공적으로 전송되었습니다.');
    } catch (error) {
      console.error('Failed to send join request:', error);
      alert('참여 요청 전송에 실패했습니다.');
    }
  };

  if (!detail) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
        <Button
        variant="outlined"
        onClick={handleBackClick}
        sx={{ marginBottom: '20px' }}
      >
        뒤로가기
      </Button>
      <Typography variant="h4">{detail.title}</Typography>
      <Typography variant="body1">{detail.description}</Typography>
      {/* 필요한 다른 데이터도 추가 표시 */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleJoinRequest}
      >
        참여요청
      </Button>
    </Box>
  );
};

export default FindTeamDetail;
