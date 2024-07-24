import React, { useState } from 'react';
import { styled } from '@mui/system'; 
import { Box } from '@mui/material';
import Button from '../Button';
import StudioDelete from './StudioDelete';

interface StudioFormProps {
    onSave: (studio: Studio) => void;
  }
  
  interface Studio {
    name: string;
    features: string;
  }


const StudioSetting: React.FC<StudioFormProps> = ({ onSave }) => {
    const [name, setName] = useState<string>('');
    const [features, setFeatures] = useState<string>('');
  
    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      const studio: Studio = { name, features };
      onSave(studio);
      setName('');
      setFeatures('');

      console.log(studio.name)
    };
  

    return (

      <>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Studio 이름
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
            스튜디오 설명
            <textarea
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              style={{ display: 'block', width: '100%', padding: '0.5rem', boxSizing: 'border-box', height: '100px' }}
              required
            />
          </label>
        </div>
        <Button type="submit" content='저장하기'> 
        </Button>

      </form>

      <StudioDelete>
        
      </StudioDelete>
      </>
    );
  };

export default StudioSetting






