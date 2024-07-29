import * as React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { styled } from '@mui/system';

const StyledModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`

const ModalContent = styled(Box)`
  width : 400px;
  height: auto;
  background-color: white;
  border-radius : 10px; 
  border: 1px solid #D1D5DB ;
  padding: 20px;
`

interface BasicModalProps {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const CustomModal: React.FC<BasicModalProps> = ({ open, onClose, children }) => {
  
  return (
    <StyledModal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <ModalContent>
        {children}
      </ModalContent>
    </StyledModal>
  );
};

export default CustomModal;
