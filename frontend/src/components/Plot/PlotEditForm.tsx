import React, { useState, useEffect } from 'react';
import { DialogContent, DialogActions, Box, TextField, Button, Typography } from '@mui/material';
import DraggableDialog from '../Commons/DraggableDialog';
import { PlotNode } from '../../types/PlotType';

interface PlotEditFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNode: PlotNode;
  onSave: (updatedNode: PlotNode) => void;
}

const PlotEditForm: React.FC<PlotEditFormProps> = ({ isOpen, onClose, selectedNode, onSave }) => {
  const [label, setLabel] = useState(selectedNode.data.label);
  const [content, setContent] = useState(selectedNode.data.content);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLabel(selectedNode.data.label);
      setContent(selectedNode.data.content);
      setIsEditing(false);
    }
  }, [isOpen, selectedNode]);

  const handleSave = () => {
    const updatedData = { ...selectedNode.data, label, content };
    const updatedNode: PlotNode = {
      ...selectedNode,
      data: updatedData
    };

    onSave(updatedNode);
    setIsEditing(false);
    onClose();
  };

  return (
    <DraggableDialog open={isOpen} onClose={onClose} title="Plot Editor">
      <DialogContent>
        <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column' }}>
          {isEditing ? (
            <>
              <TextField
                label="Label"
                variant="outlined"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                sx={{ marginBottom: 2 }}
                fullWidth
                placeholder="Enter label"
              />
              <TextField
                label="Content"
                variant="outlined"
                multiline
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                sx={{ marginBottom: 2 }}
                fullWidth
                placeholder="Enter content"
              />
            </>
          ) : (
            <>
              <Typography variant="h6" sx={{ marginBottom: 2 }}>
                {label}
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', marginBottom: 2 }}>
                {content}
              </Typography>
            </>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions>
        {isEditing ? (
          <>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
            <Button variant="contained" color="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <>
          <Button variant="contained" color="primary" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
          <Button variant="contained" color="secondary" onClick={onClose}>
            Close
          </Button>
          </>
        )}

      </DialogActions>
    </DraggableDialog>
  );
};

export default PlotEditForm;
