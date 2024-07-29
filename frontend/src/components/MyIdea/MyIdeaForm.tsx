import React, { useState } from 'react';

interface MyIdeaFormProps {
  onSave: (myidea: MyIdea) => void;
  onClose: () => void;
}

export interface MyIdea {
  title: string;
  description: string;
}

const MyIdeaForm: React.FC<MyIdeaFormProps> = ({ onSave, onClose }) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const myidea: MyIdea = { title, description };
    onSave(myidea);
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1rem' }}>
        <label>
          제목
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ display: 'block', width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
            required
          />
        </label>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>
          개요
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ display: 'block', width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
            required
          />
        </label>
      </div>
      <button type="submit" style={{ padding: '0.5rem 1rem' }}>저장하기</button>
    </form>
  );
};

export default MyIdeaForm;
