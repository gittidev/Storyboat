import * as React from 'react';
import { Box } from '@mui/material';

export interface MyStoryBoxProps {
  title : string;
  content: string;
}

export const CharBox: React.FC<MyStoryBoxProps> = ({ title, content }) => {

  return (
    <Box sx={{ border: '1px solid #ddd', padding: '10px', margin: '10px' , borderRadius : '10px',}}>

      <p><strong>{title}</strong></p>
      <p><strong>{content}</strong></p>
    </Box>
  );
};

