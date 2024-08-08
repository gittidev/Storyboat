import React from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/system'

// const baseURL = import.meta.env.VITE_BASE_URL;
const svURL = import.meta.env.VITE_SERVER_URL;

const StyledButton = styled(Button)`
  border-radius: 20.997px;
  background: #FFF;
  box-shadow: 0px 20px 20px 0px rgba(0, 0, 0, 0.07);
  display: flex;
  width: 400px;
  height: 200x;
  padding: 31.495px;
  align-items: flex-start;
  gap: 31.495px;
  flex-shrink: 0;
  color : black;
`


const GoogleLoginButton: React.FC = () => {
  const handleLogin = () => {
    window.location.href = `${svURL}/api/oauth2/authorization/google`;
  };


  return (
    <StyledButton onClick={handleLogin}>
      구글로 로그인
    </StyledButton>
  );
};

export default GoogleLoginButton;