// MakingCharacter.tsx

import React, { useState } from 'react';
import { Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '../../recoil/atoms/authAtom';
import { myStudioState } from '../../recoil/atoms/studioAtom';
import SubTopBar from '../../components/Commons/SubTopBar';
import CustomButton from '../../components/Commons/CustomButton';
import { styled } from '@mui/system';

const svURL = import.meta.env.VITE_SERVER_URL;

interface MakingCharacterProps {
  onCharacterCreated: () => void;
}

const MakingCharacter: React.FC<MakingCharacterProps> = ({ onCharacterCreated }) => {
  const navigate = useNavigate();
  const token = useRecoilValue(accessTokenState);
  const myStudioId = useRecoilValue(myStudioState);

  const [characterName, setCharacterName] = useState<string>('');
  const [characterTraits, setCharacterTraits] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>(['귀여운', '상냥한']);
  const [open, setOpen] = useState<boolean>(false);

  const TagsInput = styled('div')`
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    min-height: 48px;
    width: 100%;
    max-width: 2000px;
    padding: 0 8px;
    border: 1px solid rgb(1, 186, 138);
    border-radius: 6px;

    > ul {
      display: flex;
      flex-wrap: wrap;
      padding: 0;
      margin: 8px 0 0 0;

      > .tag {
        width: auto;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgb(1, 186, 138);
        padding: 0 8px;
        font-size: 14px;
        list-style: none;
        border-radius: 6px;
        margin: 0 8px 8px 0;
        background: rgb(242,243,244);
        border-radius: 15px;

        > .tag-close-icon {
          display: block;
          width: 16px;
          height: 16px;
          line-height: 16px;
          text-align: center;
          font-size: 14px;
          margin-left: 8px;
          color: rgb(1, 186, 138);
          border-radius: 50%;
          background: #fff;
          cursor: pointer;
        }
      }
    }

    > input {
      flex: 1;
      border: none;
      height: 46px;
      font-size: 14px;
      padding: 4px 0 0 12px;
      :focus {
        outline: transparent;
      }
    }

    &:focus-within {
      border: 1px solid rgb(1, 186, 138);
    }
  `;

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCharacterName(event.target.value);
  };

  const handleChangeTraits = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCharacterTraits(event.target.value);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateCharacter = async () => {
    if (!characterName || !characterTraits || !selectedImage) {
      alert('모든 필드를 채워주세요.');
      return;
    }

    const tagsString = tags.join(', ');

    const formData = new FormData();
    formData.append('name', characterName);
    formData.append('description', characterTraits);
    formData.append('file', selectedImage);
    formData.append('tags', tagsString);

    try {
      const response = await axios.post(
        `${svURL}/api/studios/${myStudioId}/characters`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('Character created successfully:', response.data);
      alert('캐릭터가 성공적으로 생성되었습니다.');
      handleClose();
      onCharacterCreated(); // 캐릭터 생성 후 콜백 호출
    } catch (error) {
      console.error('Error creating character:', error);
      alert('캐릭터 생성 중 오류가 발생했습니다.');
    }
  };

  const removeTags = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const addTags = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const inputElement = event.target as HTMLInputElement;
    const inputVal = inputElement.value;
    if (event.key === "Enter" && inputVal !== '' && !tags.includes(inputVal)) {
      setTags([...tags, inputVal]);
      inputElement.value = '';
    }
  };

  return (
    <Box sx={{ padding: "0px 20px 20px 20px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%" }}>
        <Box sx={{ flexGrow: 1 }}>
          <SubTopBar 
            title={'내 캐릭터 보관함'} 
            content='나만의 캐릭터를 작성하고 보관하세요' 
          />
        </Box>
        <Box sx={{ flexShrink: 0, display: 'flex', gap: 1 }}>
          <CustomButton 
            content={'+ 생성하기'} 
            bgcolor="#77E4C8" hoverBgColor="#4C3BCF"
            onClick={handleOpen} 
          />
          <CustomButton 
            content={'AI 활용하기'} 
            bgcolor="#9a67ff" hoverBgColor="#4C3BCF"
            onClick={() => navigate('/storyboat/AIPaintingPage')}
          />
        </Box>
      </Box>
    
      <Dialog 
        open={open} 
        onClose={handleClose} 
        PaperProps={{ 
          sx: { 
            width: '400px',
            maxWidth: '90vw', 
          } 
        }} 
      >
        <DialogTitle>캐릭터 생성</DialogTitle>
        <DialogContent>
          <br/>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField 
              label="캐릭터 이름" 
              value={characterName} 
              onChange={handleChangeName} 
              fullWidth 
            />
            <TextField 
              label="캐릭터 특징" 
              value={characterTraits} 
              onChange={handleChangeTraits} 
              fullWidth 
              multiline 
              minRows={4} 
              maxRows={8} 
            />
            
            <TagsInput>
              <ul id="tags">
                {tags.map((tag, index) => (
                  <li key={index} className="tag">
                    <span className="tag-title">{tag}</span>
                    <span className="tag-close-icon" onClick={() => removeTags(index)}>x</span>
                  </li>
                ))}
              </ul>
              <input
                className="tag-input"
                type="text"
                onKeyUp={addTags}
                placeholder="태그를 입력 후 엔터"
              />
            </TagsInput>

            <Button 
              variant="contained" 
              component="label" 
              sx={{ mt: 2 }}
            >
              이미지 업로드
              <input 
                type="file" 
                accept="image/*" 
                hidden 
                onChange={handleImageChange} 
              />
            </Button>
            {selectedImage && (
              <Typography variant="body2" sx={{ mt: 2 }}>
                선택된 이미지: {selectedImage.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button onClick={handleCreateCharacter}>생성하기&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MakingCharacter;
