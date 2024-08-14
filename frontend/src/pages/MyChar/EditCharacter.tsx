// EditCharacter.tsx
import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import axios from 'axios';
import { Character } from '../../types/Chartype';
import { accessTokenState } from '../../recoil/atoms/authAtom';
import { myStudioState } from '../../recoil/atoms/studioAtom';
import { useRecoilValue } from 'recoil';

const svURL = import.meta.env.VITE_SERVER_URL;

interface EditCharacterProps {
  character: Character;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const EditCharacter: React.FC<EditCharacterProps> = ({ character, open, onClose, onUpdate }) => {
  const [name, setName] = useState(character.name);
  const [description, setDescription] = useState(character.description);
  const [tags, setTags] = useState<string[]>(character.tags || []);
  const [file, setFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(character.imageUrl || null);

  const token = useRecoilValue(accessTokenState);
  const myStudioId = useRecoilValue(myStudioState);

  useEffect(() => {
    setName(character.name);
    setDescription(character.description);
    setTags(character.tags || []);
    setExistingImage(character.imageUrl);
  }, [character]);

  const handleUpdateCharacter = async () => {
    if (!name || !description) {
      alert('모든 필드를 채워주세요.');
      return;
    }

    const tagsString = tags.join(', ');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('tags', tagsString);

    if (file) {
      formData.append('file', file);
    } else if (existingImage) {
      try {
        // const imageBlob = await fetch(existingImage).then(res => res.blob());
        // const imageFile = new File([imageBlob], 'existingImage', { type: imageBlob.type });
        // formData.append('file', imageFile);
      } catch (error) {
        console.error('Error fetching existing image:', error);
        alert('기존 이미지를 가져오는 중 오류가 발생했습니다.');
        console.log('Existing Image URL:', existingImage);
        return;
      }
    }

    try {
      await axios.put(
        `${svURL}/api/studios/${myStudioId}/characters/${character.id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      alert('캐릭터가 성공적으로 수정되었습니다.');
      onUpdate(); // 상위 컴포넌트에서 상태 업데이트 호출
      onClose();
    } catch (error) {
      console.error('Error updating character:', error);
      alert('캐릭터 수정 중 오류가 발생했습니다. 빈 값이 없는지 확인해주세요');
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { width: '400px', maxWidth: '90vw' } }}>
      <DialogTitle>캐릭터 수정</DialogTitle>
      <DialogContent>
        <br />
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="캐릭터 이름" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
          <TextField
            label="캐릭터 특징"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            minRows={4}
            maxRows={8}
          />
          <TextField
            label="태그"
            value={tags.join(', ')}
            onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
            fullWidth
          />
          <Button variant="contained" component="label">
            이미지 업로드
            <input type="file" accept="image/*" hidden onChange={handleImageChange} />
          </Button>
          {file ? (
            <Typography variant="body2" sx={{ mt: 2 }}>
              선택된 이미지: {file.name}
            </Typography>
          ) : existingImage ? (
            <Typography variant="body2" sx={{ mt: 2 }}>
              {/* 기존 이미지: {existingImage} */}
            </Typography>
          ) : (
            <Typography variant="body2" sx={{ mt: 2 }}>
              {/* 선택된 이미지 없음 */}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button onClick={handleUpdateCharacter} color="primary">
          수정하기
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCharacter;
