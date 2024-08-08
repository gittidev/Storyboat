import React, { useState, useEffect } from 'react';
import { ProfileType } from '../../types/UserType';
import { checkPenNameAvailability } from '../../apis/profileApi';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '../../recoil/atoms/authAtom';
import { TextField, Button, Box, FormControl, InputLabel, Input, Select, MenuItem, Chip, Avatar, SelectChangeEvent } from '@mui/material';
import axios from 'axios';

interface ProfileFormProps {
  profile: ProfileType;
  onSave: (updatedProfile: ProfileType) => void;
  onClose: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onSave, onClose }) => {
  const [penName, setPenName] = useState<string>(profile.penName || '');
  const [introduction, setIntroduction] = useState<string>(profile.introduction || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(profile.imageUrl || null);
  const [penNameError, setPenNameError] = useState<string | null>(null);
  const [tags, setTags] = useState<{ tagId: number, name: string, color: string }[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>(profile.tags ? profile.tags.map(tag => tag.tagId) : []);

  const accessToken = useRecoilValue(accessTokenState);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/tags`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        if (response.status === 200) {
          setTags(response.data.data); // 태그 목록 저장
        }
      } catch (error) {
        console.error('태그를 가져오는 데 실패했습니다:', error);
      }
    };

    fetchTags();
  }, [accessToken]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePenNameBlur = async () => {
    if (penName !== profile.penName) {
      const isAvailable = await checkPenNameAvailability(penName);
      if (!isAvailable) {
        setPenNameError('필명이 이미 사용 중입니다.');
      } else {
        setPenNameError(null);
      }
    }
  };

  const handleTagChange = (event: SelectChangeEvent<number[]>) => {
    setSelectedTagIds(event.target.value as number[]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (penNameError) {
      alert('필명 중복을 확인해주세요.');
      return;
    }

    const formData = new FormData();
    
    // Add image file to formData
    if (imageFile) {
      formData.append('imageUrl', imageFile);
    }

    // Create the data object
    const data = {
      penName,
      introduction,
      tags: selectedTagIds.map(tagId => ({ tagId }))
    };

    // Add data object to formData as JSON string
    formData.append('data', JSON.stringify(data));

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/users/profiles`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log(response.data)
      onSave(response.data.data); // 응답에서 업데이트된 프로필을 반환하는 경우
      // ==> 응답에서 업데이트된 프로필을 반환하지 않아서 오류발생 -> 수정 요청하기
      onClose();
      
    } catch (error) {
      console.error('프로필 업데이트 실패:', error);
      alert('프로필 업데이트에 실패했습니다.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 2 }}>
      <TextField
        label="필명"
        value={penName}
        onChange={(e) => setPenName(e.target.value)}
        onBlur={handlePenNameBlur}
        error={!!penNameError}
        helperText={penNameError}
        fullWidth
      />

      <TextField
        label="작가 소개"
        value={introduction}
        onChange={(e) => setIntroduction(e.target.value)}
        multiline
        rows={4}
        fullWidth
      />

      <FormControl fullWidth>
        <InputLabel>태그 선택</InputLabel>
        <Select
          multiple
          value={selectedTagIds}
          onChange={handleTagChange}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {tags.filter(tag => selected.includes(tag.tagId)).map(tag => (
                <Chip key={tag.tagId} label={tag.name} sx={{ backgroundColor: tag.color, color: '#fff' }} />
              ))}
            </Box>
          )}
        >
          {tags.map(tag => (
            <MenuItem key={tag.tagId} value={tag.tagId}>
              {tag.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box>
        {imagePreview && (
          <Avatar src={imagePreview} alt="Profile Preview" sx={{ width: 100, height: 100, mb: 2 }} />
        )}
        <Button variant="contained" component="label">
          프로필 사진 업로드
          <Input
            type="file"
            onChange={handleFileChange}
            sx={{ display: 'none' }}
          />
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button type="submit" variant="contained">저장</Button>
        <Button type="button" variant="outlined" onClick={onClose}>취소</Button>
      </Box>
    </Box>
  );
};

export default ProfileForm;
