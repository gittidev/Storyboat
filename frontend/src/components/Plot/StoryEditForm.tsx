import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Drawer } from '@mui/material';
import { PlotNode } from '../../types/PlotType';
import QuillEditor from '../Commons/QuillEditor';

interface StoryEditFormProps {
  isOpen: boolean;
  onClose: () => void;
  nodeId: string | null;
  plot: PlotNode;
}

const StoryEditForm: React.FC<StoryEditFormProps> = ({ isOpen, onClose, plot }) => {
  const [editorContent, setEditorContent] = useState<string>(plot.data.text || '');

  useEffect(() => {
    if (isOpen) {
      setEditorContent(plot.data.text || '');
    }
  }, [isOpen, plot.data.text]);

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
  };

  const handleSave = () => {
    plot.data.text = editorContent;
    console.log('Content saved:', plot.data.text);
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 800, // 고정된 넓이
          padding: 2,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto', // 스크롤 가능하게 설정
        },
      }}
    >
      <Box
        sx={{
          width: '100%',
          padding: 2,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: 2 }}>Story Editor</Typography>
        <QuillEditor value={editorContent} onChange={handleEditorChange} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="contained" color="secondary" onClick={handleSave}>
            저장하기
          </Button>
          <Button variant="contained" color="primary" onClick={onClose}>
            취소하기
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default StoryEditForm;
