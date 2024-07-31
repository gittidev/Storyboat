import React from 'react';
import './LandingPage.css';
import { Box, Button } from '@mui/material';
import { styled } from '@mui/system';

const GradientBox = styled(Box)`
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  background: linear-gradient(to right, #c2e59c, #64b3f4);
  z-index: -1;
  overflow: hidden;
  &:hover {
    animation: wave 3s infinite linear;
  }
`;

const CustomButton = styled(Button)`
  margin: 10px;
  padding: 10px 20px;
  color: white;
  background-color: lightblue;
  &:hover {
    background-color: blue;
  }
`;

const LandingPage: React.FC = () => {
  return (
    <>
        <GradientBox id="gradient" />
        <Box className="overlay">
          <CustomButton onClick={() => window.location.href = '/login'}>
            로그인
          </CustomButton>
          <CustomButton onClick={() => window.location.href = '/storyboat'}>
            메인으로
          </CustomButton>
        </Box>
    </>
  );
};

export default LandingPage;
