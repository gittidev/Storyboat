// import * as React from 'react';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// import Modal from '@mui/material/Modal';
// import FindTeamForm from './FindTeamForm';

// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   bgcolor: 'background.paper',
//   border: '2px solid #000',
//   boxShadow: 24,
//   p: 4,
// };

export default function BasicModal() {
  // const [open, setOpen] = React.useState(false);
  // const [findteams, setFindteams] = React.useState<Findteam[]>([]);

  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);

  // const handleSave = (findteam: Findteam) => {
  //   console.log('Findteam saved:', findteam);
  //   setFindteams((prevFindteam) => [...prevFindteam, findteam]);
  //   // Handle character save logic here
  //   handleClose();
  // };

  return (
    <div>
      {/* <Button onClick={handleOpen}>팀 찾기</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <FindTeamForm onSave={handleSave} onClose={handleClose} />
        </Box>
      </Modal>
      <div> */}
        <h3>팀 찾기</h3>
        {/* <p>{Character}</p> */}
        {/* {findteams.map((findteam, index) => (
           <FindteamBox
             key={index}
            title={findteam.title}
            content={findteam.content}
            tags={findteam.tags}
           />
        ))}  */}
      {/* </div> */}

    </div>
  );
}

interface FindteamBoxProps {
    title? : string;
    content? : string;
    tags? : string[];
}

export const FindteamBox: React.FC<FindteamBoxProps> = ({ title, content, tags }) => {
  return (
    <div style={{ border: '1px solid #ddd', padding: '1rem', marginTop: '1rem' }}>
      <h2>{title}</h2>
      <p><strong>내용:</strong> {content}</p>
      <p><strong>태그:</strong> {tags}</p>
    </div>
  );
};

