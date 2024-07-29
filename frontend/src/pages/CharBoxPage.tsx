import { Box } from '@mui/material';
import CustomButton from '../components/Commons/CustomButton';
import SubTopBar from '../components/Commons/SubTopBar';
import { useState } from 'react';
import { CharBox, CharBoxProps } from '../components/Char/CharBox';
import CustomModal from '../components/Commons/CustomModal'; // 추가된 부분
import CharForm from '../components/Char/CharForm'; // 추가된 부분
import useModal from '../hooks/useModal';
import { BorderBox } from '../components/Commons/BorderBox';

const CharBoxPage = () => {
  const { open, handleOpen, handleClose } = useModal();
  const [characters, setCharacters] = useState<CharBoxProps[]>([]);

  const handleSave = (character: CharBoxProps) => {
    console.log('Character saved:', character);
    setCharacters((prevCharacters) => [...prevCharacters, character]);
    handleClose();
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "10px" }}>
        <Box sx={{ flexGrow: 1 }}>
          <SubTopBar title={"스튜디오's 캐릭터 보관함"} content='스튜디오의 캐릭터를 생성하고 보관하세요' />
        </Box>
        <Box sx={{ flexShrink: 0 }}>
          <CustomButton content='+ 생성하기' bgcolor="lightgreen" hoverBgColor="green" onClick={handleOpen} />
        </Box>
      </Box>

      <CustomModal open={open} onClose={handleClose}>
        <CharForm onSave={handleSave} onClose={handleClose} />
      </CustomModal>

      {/* 화면에 들어갈 내역 */}
      <BorderBox>
        <Box sx={{ display: "flex", alignItems: "center", width: "100%", padding: "10px" }}>
          {characters.map((character, index) => (
            <CharBox
              key={index}
              name={character.name}
              tags={character.tags}
              features={character.features}
            />
          ))}
        </Box>
      </BorderBox>




    </>
  );
}

export default CharBoxPage;
