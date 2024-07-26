import React, { useState } from 'react';

interface CharacterFormProps {
  onSave: (character: Character) => void;
  // 수정함
  onClose: () => void;
}

export interface Character {
  name: string;
  tags: string;
  features: string;
}

const CharForm: React.FC<CharacterFormProps> = ({ onSave }) => {
  const [name, setName] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [features, setFeatures] = useState<string>('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const character: Character = { name, tags, features };
    onSave(character);
    setName('');
    setTags('');
    setFeatures('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1rem' }}>
        <label>
          이름
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ display: 'block', width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
            required
          />
        </label>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>
          태그
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            style={{ display: 'block', width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
            required
          />
        </label>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>
          특징
          <textarea
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            style={{ display: 'block', width: '100%', padding: '0.5rem', boxSizing: 'border-box', height: '100px' }}
            required
          />
        </label>
      </div>
      <button type="submit" style={{ padding: '0.5rem 1rem' }}>저장하기</button>
    </form>
  );
};

export default CharForm;
