import React, { useState } from 'react';
import CustomButton from './Commons/CustomButton';
import TextField from '@mui/material/TextField';

interface StoryFormProps {
  onSubmit: (title: string) => void;
  onClose: () => void;
}

const StoryForm: React.FC<StoryFormProps> = ({ onSubmit}) => {
  const [title, setTitle] = useState<string>('');
  const [loading, setLoading] = useState(false);  
  console.log(loading)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    onSubmit(title)
    
    setLoading(false);
    setTitle('')
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

export default StoryForm;
