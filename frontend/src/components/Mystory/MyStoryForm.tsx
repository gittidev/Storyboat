import React, { useState } from 'react';
import CustomButton from '../Commons/CustomButton';
import TextField from '@mui/material/TextField';
import { StoryType } from '../../types/StudioType';

interface MyStoryFormProps {
  onSave: (mystory: StoryType) => void;
  onClose: () => void;
  nextstoryid: number; // 추가된 부분
}

const MyStoryForm: React.FC<MyStoryFormProps> = ({ onSave, onClose, nextstoryid }) => {
  const [title, setTitle] = useState<string>('');
  const [lastmodified, setModified] = useState<string>('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const mystory: StoryType = { 
      storyid: nextstoryid, // 추가된 부분
      title, 
      lastmodified 
    };
    onSave(mystory);
    setTitle('');
    setModified('');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1rem' }}>
        <TextField
          fullWidth
          required
          value={title}
          label="제목"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <CustomButton type="submit" content='저장하기' bgcolor='green' width='100%'/>
    </form>
  );
};

export default MyStoryForm;
