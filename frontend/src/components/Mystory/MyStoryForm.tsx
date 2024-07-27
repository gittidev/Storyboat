import React, { useState } from 'react';

interface MyStoryFormProps {
  onSave: (mystory: MyStory) => void;
  onClose: () => void;
}

export interface MyStory {
  title: string;
  content: string;

}

const MyStoryForm: React.FC<MyStoryFormProps> = ({ onSave }) => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const mystory: MyStory = { title, content};
    onSave(mystory);
    setTitle('');
    setContent('');

  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1rem' }}>
        <label>
          이름
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
          요약
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ display: 'block', width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
            required
          />
        </label>
      </div>

      <button type="submit" style={{ padding: '0.5rem 1rem' }}>저장하기</button>
    </form>
  );
};

export default MyStoryForm;
