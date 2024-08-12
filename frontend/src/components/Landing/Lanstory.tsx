import React from 'react';
import { Container, CssBaseline, Typography } from '@mui/material';
import Carousel from '../../pages/LandingPage/Carousel';
import './Lanstory.css';

const Lanstory: React.FC = () => {
  return (

    <div className='midLanstory'>
          <Container className="mid-lanstory2"
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CssBaseline />
      <Typography>

      </Typography>
      <Carousel />
    </Container>
    </div>
  );
};

export default Lanstory;
