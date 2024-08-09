import React, { useState } from 'react';
import { Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SubTopBar from '../../components/Commons/SubTopBarteam';
import CustomButton from '../../components/Commons/CustomButton';
import MakingTag  from '../../components/MyChar/MakingTag'; 

interface MakingCharacterteamProps {}

const MakingCharacterteam: React.FC<MakingCharacterteamProps> = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const [characterName, setCharacterName] = useState<string>('');
  const [characterTraits, setCharacterTraits] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [open, setOpen] = useState<boolean>(false);

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

  const handleGoToAIPainting = () => {
    navigate('/storyboat/AIPaintingPage'); // Navigate to the absolute path
  };

  return (
    <Box sx={{ padding: "0px 20px 20px 20px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%" }}>
        <Box sx={{ flexGrow: 1 }}>
          <SubTopBar 
            title={'스튜디오 캐릭터 보관함'} 
            content='팀의 캐릭터를 작성하고 보관하세요' 
          />
        </Box>
        <Box sx={{ flexShrink: 0, display: 'flex', gap: 1 }}>
          <CustomButton 
            content={'캐릭터 생성'} 
            bgcolor="lightgreen" 
            hoverBgColor="green" 
            onClick={handleOpen} 
          />
          <CustomButton 
            content={'AI 활용하기'} 
            bgcolor="lightblue" 
            hoverBgColor="blue" 
            onClick={handleGoToAIPainting} // Navigate to AI Painting Page
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
            < MakingTag />
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
          <Button 
            onClick={() => {
              handleClose();
            }}
            color="primary"
          >
            생성하기
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MakingCharacterteam;
