import React, { useState } from 'react';
import CustomButton from '../Commons/CustomButton';
import TextField from '@mui/material/TextField';

interface MyStoryFormProps {
  onSave: (mystory: MyStory) => void;
  onClose: () => void;
}

export interface MyStory {
  title: string;
  description: string;
}

const MyStoryForm: React.FC<MyStoryFormProps> = ({ onSave, onClose }) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const mystory: MyStory = { title, description };
    onSave(mystory);
    setTitle('');
    setDescription('');
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
      <div style={{ marginBottom: '1rem' }}>
        <TextField
          fullWidth
          required
          value={description}
          label="개요"
          placeholder="개요를 입력하세요"
          onChange={(e) => setDescription(e.target.value)}
          multiline
        />
      </div>
      <CustomButton type="submit" content='저장하기' bgcolor='green' width='100%'/>
    </form>
  );
};

export default MyStoryForm;
