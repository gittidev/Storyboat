import * as React from 'react';
import { Box } from '@mui/material';

export interface CharBoxProps {
  name: string;
  tags: string;
  features: string;
}

export const CharBox: React.FC<CharBoxProps> = ({ name, tags, features }) => {

  return (
    <Box sx={{ border: '1px solid #ddd', padding: '10px', margin: '10px' , borderRadius : '10px',}}>
      <h2>{name}</h2>
      <p><strong>태그:</strong> {tags}</p>
      <p><strong>:</strong> {features}</p>
    </Box>
  );
};

