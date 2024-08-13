import React from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/system'
import googleImage from '../../images/login/google.png';

// const baseURL = import.meta.env.VITE_BASE_URL;
const svURL = import.meta.env.VITE_SERVER_URL;

const StyledButton = styled(Button)`
  border-radius: 20.997px;
  background: #FFF;
  // box-shadow: 0px 20px 20px 0px rgba(0, 0, 0, 0.07);
  display: flex;
  width: 400px;
  height: 200x;
  border: 1px solid gray; 
  // padding: 31.495px;
  align-items: flex-start;
  gap: 31.495px;
  flex-shrink: 0;
  color : black;
    &:hover {
    background-color: white;
  }
`


const GoogleLoginButton: React.FC = () => {
  const handleLogin = () => {
    window.location.href = `${svURL}/api/oauth2/authorization/google`;
  };

// 구글 로그인
  return (
    <StyledButton onClick={handleLogin}>
      {/* 구글로 로그인 */}
      <img src={googleImage} alt="Kakao Login" style={{ width: '100%', height: 'auto' }} />
    </StyledButton>
  );
};

export default GoogleLoginButton;