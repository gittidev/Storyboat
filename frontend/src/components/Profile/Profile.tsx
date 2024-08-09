import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { accessTokenState } from '../../recoil/atoms/authAtom';
import axios from 'axios';
import { myStudioState } from '../../recoil/atoms/studioAtom';
import ProfileForm from './ProfileForm';
import { ProfileType } from '../../types/UserType';

const svURL = import.meta.env.VITE_SERVER_URL;

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const token = useRecoilValue(accessTokenState);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const setStudioId = useSetRecoilState(myStudioState);  // useSetRecoilState로 변경

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${svURL}/api/users/profiles`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.status === 200) {
        const { data } = response.data;
        if (data && data.privateStudio && data.privateStudio.studioId) {
          setStudioId(data.privateStudio.studioId);
        }
        setProfile(data);
      } else {
        throw new Error('프로필 정보를 가져오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('프로필 정보를 가져오는데 오류가 발생했습니다:', error);
      setError('프로필 정보를 가져오는데 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);  // 의존성 배열에서 profile 제거

  const handleEdit = () => setIsEditing(true);

  const handleSave = async (updatedProfile: ProfileType) => {
    try {
      const formData = new FormData();
      if (updatedProfile.imageUrl) {
        formData.append('imageUrl', updatedProfile.imageUrl);
      }
      
      const profileData = {
        penName: updatedProfile.penName,
        introduction: updatedProfile.introduction,
        tags: updatedProfile.tags
      };
      formData.append('data', JSON.stringify(profileData));

      await axios.put(
        `${svURL}/api/users/profiles`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      fetchProfile(); // Fetch the updated profile to ensure we have the latest data
      setIsEditing(false);
    } catch (err) {
      setError('프로필 정보를 업데이트하는 중 오류가 발생했습니다.');
    }
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!profile) {
    return <div>프로필 정보가 없습니다.</div>;
  }

  return (
    <Box sx={{ padding: '2rem' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <Typography variant="h6" component="div">
          내 프로필 관리
        </Typography>
        <IconButton onClick={handleEdit} color="primary">
          <EditIcon />
        </IconButton>
      </Box>

      {isEditing ? (
        <ProfileForm profile={profile} onSave={handleSave} onClose={() => setIsEditing(false)} />
      ) : (
        <Card sx={{ maxWidth: 600, margin: 'auto', boxShadow: 3 }}>
          <CardMedia
            component="img"
            height="200"
            image={profile.imageUrl || '/default-profile.png'}
            alt="Profile Picture"
          />
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar src={profile.imageUrl || '/default-profile.png'} alt="Profile Picture" sx={{ width: 100, height: 100, mr: 2 }} />
              <Box>
                <Typography variant="h5">{profile.penName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  작가 소개
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" paragraph>
              {profile.introduction}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {profile.tags && profile.tags.map(tag => (
                <Chip
                  key={tag.tagId}
                  label={tag.name}
                  sx={{ backgroundColor: tag.color, color: '#fff' }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Profile;
