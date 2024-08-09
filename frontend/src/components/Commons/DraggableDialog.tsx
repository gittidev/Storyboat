import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

interface DraggableDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const DraggableDialog: React.FC<DraggableDialogProps> = ({ open, onClose, title, children }) => {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="draggable-dialog-title">
      <DialogTitle id="draggable-dialog-title">{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DraggableDialog;
