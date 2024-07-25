import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CharForm from './CharForm';

const style = {
  position: 'absolute', 
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

//build용 임시..인터페이스
interface Character {
  name : string
  tags : string
  features :  string 
}




export default function BasicModal() {
  const [open, setOpen] = React.useState(false);
  const [characters, setCharacters] = React.useState<Character[]>([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSave = (character: Character) => {
    console.log('Character saved:', character);
    setCharacters((prevCharacters) => [...prevCharacters, character]);
    // Handle character save logic here
    handleClose();
  };

  return (
    <div>
      <Button onClick={handleOpen}>캐릭터 생성</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <CharForm onSave={handleSave} onClose={handleClose} />
        </Box>
      </Modal>
      <div>
        <h3>캐릭터 목록</h3>
        {/* <p>{Character}</p> */}
        {characters.map((character, index) => (
          <CharBox
            key={index}
            name={character.name}
            tags={character.tags}
            features={character.features}
          />
        ))}
      </div>

    </div>
  );
}

interface CharBoxProps {
  name: string;
  tags: string;
  features: string;
}

const CharBox: React.FC<CharBoxProps> = ({ name, tags, features }) => {
  return (
    <div style={{ border: '1px solid #ddd', padding: '1rem', marginTop: '1rem' }}>
      <h2>{name}</h2>
      <p><strong>태그:</strong> {tags}</p>
      <p><strong>특징:</strong> {features}</p>
    </div>
  );
};

