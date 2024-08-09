import React, { useState, useEffect } from 'react';
import CustomButton from '../Commons/CustomButton';
import { TextField, FormControl, InputLabel, Select, MenuItem, Box, Chip, SelectChangeEvent } from '@mui/material';
import { FindTeamType } from '../../types/StudioType';
import { useRecoilValue } from 'recoil';
// import { findTeamState } from '../../recoil/atoms/studioAtom';
import axios from 'axios';
import { selectedStudioState } from '../../recoil/atoms/studioAtom';
import { accessTokenState } from '../../recoil/atoms/authAtom';

const svURL = import.meta.env.VITE_SERVER_URL;

interface FindTeamFormProps {
  // findTeam: FindTeamType;
  onSave: (findteam: FindTeamType) => void;
  onClose: () => void;
}

const FindTeamForm: React.FC<FindTeamFormProps> = ({ onSave, onClose }) => {
  // const [findTeamList, setfindTeamList] = useRecoilState<FindTeamType[]>(findTeamState);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [tags, setTags] = useState<{ tagId: number, name: string, color: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  const studioId = useRecoilValue(selectedStudioState);
  const accessToken = useRecoilValue(accessTokenState);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(`${svURL}/api/tags`, {
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

  const handleTagChange = (event: SelectChangeEvent<number[]>) => {
    setSelectedTagIds(event.target.value as number[]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const newFindteam = {
      title,
      description,
      tags: selectedTagIds.map(tagId => ({ tagId })),
      studioId,
    };

    try {
      const response = await axios.post(`${svURL}/api/invitations/${studioId}`, newFindteam, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;

      // setfindTeamList([...findTeamList, data]);

      if (onSave) {
        onSave(data.data);
      }

      // fetchFindteams(accessToken, setfindTeamList);

      onClose();
    } catch (error) {
      console.error('팀찾기 게시글 생성 중 오류 발생', error);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1rem' }}>
        <TextField
          required
          id="outlined-required"
          label="제목"
          placeholder='게시글 제목을 작성하세요'
          sx={{ marginBottom: '15px', width: '100%' }}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
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
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <TextField
          required
          id="outlined-multiline-static"
          label="내용"
          multiline
          rows={4}
          placeholder='내용을 작성하세요'
          sx={{ marginBottom: '15px', width: '100%' }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <CustomButton type="submit" content="생성하기" bgcolor='lightgreen' hoverBgColor='green' disabled={loading} />
        <CustomButton type="button" content="취소하기" bgcolor='gray' hoverBgColor='red' onClick={onClose} />
        {loading && <p>저장 중...</p>}
      </div>
    </form>
  );
};

export default FindTeamForm;
