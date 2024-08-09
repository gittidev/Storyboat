import * as React from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export interface FindteamBoxProps {
  title?: string;
  description?: string;
  // tags?: string;
  studioId: number;
}

export const FindteamBox: React.FC<FindteamBoxProps> = ({ title, description, studioId }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/storyboat/invitations/${studioId}`);
  };

  return (

    <Box onClick={handleClick} sx={{ border: 'none', padding: '10px', cursor: 'pointer' }}>
      <Typography variant="h5">{title}</Typography>
      <Typography variant="body1">{description}</Typography>
      {/* <Box>
        {tags.map((tag, index) => (
          <Typography key={index} variant="caption">
            #{tag}{' '}
          </Typography>
        ))}
      </Box> */}
    </Box>
  );
};

