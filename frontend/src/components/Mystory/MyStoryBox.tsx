import * as React from 'react';
import { Box } from '@mui/material';

export interface MyStoryBoxProps {
  id : number;
  title : string;
  description: string;
}

export const CharBox: React.FC<MyStoryBoxProps> = ({ title, description }) => {

  return (
    <Box sx={{ border: '1px solid #ddd', padding: '10px', margin: '10px' , borderRadius : '10px',}}>

      <p><strong>{title}</strong></p>
      <p><strong>{description}</strong></p>
    </Box>
  );
};

