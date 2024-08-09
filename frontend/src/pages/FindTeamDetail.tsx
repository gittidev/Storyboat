import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button, Card, CardContent, CardActions, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { accessTokenState } from '../recoil/atoms/authAtom';
import { useRecoilValue, useRecoilState } from 'recoil';
import { FindTeamType } from '../types/StudioType';
import { findTeamDetailState } from '../recoil/atoms/studioAtom';

const svURL = import.meta.env.VITE_SERVER_URL;

const FindTeamDetail: React.FC = () => {
  const { studioId } = useParams<{ studioId: string }>();
  const [detail, setDetail] = useRecoilState<FindTeamType>(findTeamDetailState);
  const accessToken = useRecoilValue(accessTokenState);
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
      alert('참여 요청이 성공적으로 전송되었습니다.');
    } catch (error) {
      console.error('Failed to send join request:', error);
      alert('참여 요청 전송에 실패했습니다.');
    }
  };

  const handleEdit = () => {
    navigate(`/storyboat/invitations/${studioId}/edit`);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${svURL}/api/invitations/${studioId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      alert('삭제되었습니다.');
      navigate('/storyboat/invitations'); // 삭제 후 목록 페이지로 이동
    } catch (error) {
      console.error('삭제 중 오류가 발생했습니다.', error);
      alert('삭제에 실패했습니다.');
    }
  };

  if (!detail) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ padding: '20px' }}>
      <Button
        variant="outlined"
        onClick={handleBackClick}
        sx={{ marginBottom: '20px' }}
      >
        뒤로가기
      </Button>

      <Card>
        <CardContent>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            {detail.title}
          </Typography>
          <Typography variant="body1" sx={{ marginTop: '20px', whiteSpace: 'pre-wrap' }}>
            {detail.description}
          </Typography>
          {/* 태그 등 다른 필요한 정보 추가 */}
        </CardContent>

        <CardActions sx={{ justifyContent: 'space-between', padding: '0 16px 16px 16px' }}>
          <Box>
            <IconButton onClick={handleEdit} color="primary">
              <EditIcon />
            </IconButton>
            <IconButton onClick={handleDelete} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleJoinRequest}
          >
            참여 요청
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default FindTeamDetail;
