// MakingCharacterteam.tsx

import React, { useState, useEffect } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useRecoilState } from 'recoil';
import { accessTokenState } from '../../recoil/atoms/authAtom';
import { myStudioState, selectedStudioState } from '../../recoil/atoms/studioAtom';
import SubTopBar from '../../components/Commons/SubTopBar';
import CustomButton from '../../components/Commons/CustomButton';
import { Character } from '../../types/Chartype';
import { SelectChangeEvent } from '@mui/material';

const svURL = import.meta.env.VITE_SERVER_URL;

interface MakingCharacterteamProps {
  onCharacterCreated: () => void;  // Callback function called after character creation or update
}

const MakingCharacterteam: React.FC<MakingCharacterteamProps> = ({ onCharacterCreated }) => {
  const navigate = useNavigate();
  const token = useRecoilValue(accessTokenState);
  const myStudioId = useRecoilValue(myStudioState);
  const [selectedStudioId] = useRecoilState(selectedStudioState);
  const [bringmyCharacterId, setBringmyCharacterId] = useState<string>('');
  const [myStudioCharacters, setMyStudioCharacters] = useState<Character[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  // Fetch characters from selected studio
  useEffect(() => {
    const fetchSelectedStudioCharacters = async () => {
      try {
        await axios.get<{ message: string, data: Character[] }>(
          `${svURL}/api/studios/${selectedStudioId}/characters`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        // Optional: Handle selected studio characters if needed
      } catch (error) {
        console.error('Error fetching characters from selected studio:', error);
      }
    };

    if (selectedStudioId) {
      fetchSelectedStudioCharacters();
    }
  }, [token, selectedStudioId]);

  // Fetch characters from my studio
  useEffect(() => {
    const fetchMyStudioCharacters = async () => {
      try {
        const response = await axios.get<{ message: string, data: Character[] }>(
          `${svURL}/api/studios/${myStudioId}/characters`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        setMyStudioCharacters(response.data.data);
      } catch (error) {
        console.error('Error fetching characters from my studio:', error);
      }
    };

    if (myStudioId) {
      fetchMyStudioCharacters();
    }
  }, [token, myStudioId]);

  // Open and close dialog functions
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setBringmyCharacterId('');
  };

  // Handle character export
  const handleExportCharacter = async () => {
    if (!bringmyCharacterId) {
      alert('캐릭터를 선택하세요.');
      return;
    }

    try {
      await axios.post(
        `${svURL}/api/studios/${myStudioId}/characters/${bringmyCharacterId}/${selectedStudioId}`,
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      alert('캐릭터가 성공적으로 내보내졌습니다.');
      handleClose();
      onCharacterCreated();  // Notify parent component
    } catch (error) {
      console.error('Error exporting character:', error);
      alert('캐릭터 내보내기 중 오류가 발생했습니다.');
    }
  };

  // Handle character selection
  const handleCharacterSelect = (event: SelectChangeEvent<string>) => {
    setBringmyCharacterId(event.target.value as string);
  };

  return (
    <Box sx={{ padding: "0px 20px 20px 20px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%" }}>
        <Box sx={{ flexGrow: 1 }}>
          <SubTopBar 
            title="스튜디오 캐릭터 보관함" 
            content="우리 팀의 캐릭터를 한 눈에 볼 수 있어요" 
          />
        </Box>
        <Box sx={{ flexShrink: 0, display: 'flex', gap: 1 }}>
          <CustomButton 
            content="내 캐릭터 업로드" 
            bgcolor="#77E4C8" hoverBgColor="#4C3BCF"
            onClick={handleOpen} 
          />
          <CustomButton 
            content="AI 활용하기" 
            bgcolor="#9a67ff" hoverBgColor="#4C3BCF"
            onClick={() => navigate('/storyboat/AIPaintingPage')}
          />
        </Box>
      </Box>

      <Dialog 
        open={open} 
        onClose={handleClose} 
        PaperProps={{ sx: { width: '400px', maxWidth: '90vw' } }} 
      >
        <DialogTitle>캐릭터 내보내기</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel id="select-character-label">캐릭터 선택</InputLabel>
            <Select
              labelId="select-character-label"
              value={bringmyCharacterId}
              onChange={handleCharacterSelect}
              fullWidth
            >
              {myStudioCharacters.map(character => (
                <MenuItem key={character.id} value={character.id}>
                  {character.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button onClick={handleExportCharacter} color="primary">
            내보내기
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MakingCharacterteam;
