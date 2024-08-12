import * as React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export interface FindteamBoxProps {
  title?: string;
  description?: string;
  studioId: number;
  tags?: { name: string; color: string }[];
}

export const FindteamBox: React.FC<FindteamBoxProps> = ({ title, description, studioId, tags }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/storyboat/invitations/${studioId}`);
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        borderRadius: '12px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        marginBottom: '20px',
        backgroundColor: '#f9f9f9',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.15)',
        },
        cursor: 'pointer',
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
        {title}
      </Typography>
      <Typography variant="body1" sx={{ color: '#666', marginTop: '10px' }}>
        {description}
      </Typography>
      {tags && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', marginTop: '15px' }}>
          {tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag.name}
              sx={{
                backgroundColor: tag.color,
                color: 'white',
                marginRight: '8px',
                marginBottom: '8px',
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};
