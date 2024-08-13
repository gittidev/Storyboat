import React from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/system'
import kakaoImage from '../../images/login/kakao.png';

const svURL = import.meta.env.VITE_SERVER_URL;


const StyledButton = styled(Button)`
  border-radius: 20.997px;
  background:  #FEE500;
  // box-shadow: 0px 20px 20px 0px rgba(0, 0, 0, 0.07);
  display: flex;
  width: 400px;
  height: 200x;
  // padding: 31.495px;
  align-items: flex-start;
  gap: 31.495px;
  flex-shrink: 0;
  color : black;
  &:hover {
    background-color: rgb(254,229,0);
  }
  border: 1px solid rgb(254,229,0); 
  
`

const KaKaoLoginButton: React.FC = () => {
  const handleLogin = () => {
    window.location.href = `${svURL}/api/oauth2/authorization/kakao`;
  };

  return (
    <StyledButton onClick={handleLogin}>
      <img src={kakaoImage} alt="Kakao Login" style={{ width: '100%', height: 'auto' }} />
        {/* 카카오로 로그인 */}
    </StyledButton>
  );
};

export default KaKaoLoginButton;