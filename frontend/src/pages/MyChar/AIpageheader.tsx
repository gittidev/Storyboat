import React, { useState } from 'react';
import { Box, Dialog, DialogTitle } from '@mui/material';
import SubTopBar from '../../components/Commons/SubTopBar';
import CustomButton from '../../components/Commons/CustomButton';
import Home from './Home';
import Huggingwrite from '../../components/Char/Huggingwrite';

interface MakingCharacterProps {}

const MakingCharacter: React.FC<MakingCharacterProps> = () => {
  const [dialogType, setDialogType] = useState<string | null>(null);

  const handleOpen = (type: string) => {
    setDialogType(type);
  };

  const handleClose = () => {
    setDialogType(null);
  };

  return (
    <Box sx={{ padding: "0px 20px 20px 20px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%" }}>
        <Box sx={{ flexGrow: 1 }}>
          <SubTopBar 
            title={'AI 활용하기'} 
            content='최첨단 인공지능을 경험해보세요' 
          />
        </Box>
        <Box sx={{ flexShrink: 0, display: 'flex', gap: 1 }}>
          <CustomButton 
            content={'그림 그리기'} 
            bgcolor="lightgreen" 
            hoverBgColor="green" 
            onClick={() => handleOpen('painting')} 
          />
          <CustomButton 
            content={'글쓰기'} 
            bgcolor="lightblue" 
            hoverBgColor="blue" 
            onClick={() => handleOpen('writing')} 
          />
        </Box>
      </Box>

      <Dialog 
        open={dialogType === 'painting'} 
        onClose={handleClose} 
        PaperProps={{ 
          sx: { 
            width: '1500px',
            maxWidth: '90vw', 
          } 
        }} 
      >
        <br/>
        <DialogTitle style={{ 
            textAlign: 'center', 
            color: 'rgb(144,238,144)',
            fontSize: '30px', 
            fontWeight: 'bold' 
          }}>
           AI로 그림그리기
        </DialogTitle>
        <Home />
      </Dialog>

      <Dialog 
        open={dialogType === 'writing'} 
        onClose={handleClose} 
        PaperProps={{ 
          sx: { 
            width: '1500px',
            maxWidth: '90vw', 
          } 
        }} 
      >
        <br/>
        <DialogTitle style={{ 
            textAlign: 'center', 
            color: 'rgb(144,238,144)',
            fontSize: '30px', 
            fontWeight: 'bold' 
          }}>
           AI로 글쓰기
        </DialogTitle>
        <Huggingwrite />
      </Dialog>
    </Box>
  );
};

export default MakingCharacter;
