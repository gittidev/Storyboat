import React from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/system'
import naverImage from '../../images/login/naver.png';

const StyledButton = styled(Button)`
  border-radius: 20.997px;
  background:  #03C75A;
  // box-shadow: 0px 20px 20px 0px rgba(0, 0, 0, 0.07);
  display: flex;
  width: 400px;
  height: 200x;
  // padding: 31.495px;
  align-items: flex-start;
  gap: 31.495px;
  flex-shrink: 0;
  color : #ffffff;
  &:hover {
    background-color: rgb(0,199,60);
  }
  border: 1px solid rgb(0,199,60); 
`


const svURL = import.meta.env.VITE_SERVER_URL;




const NaverLoginButton: React.FC = () => {
  const handleLogin = () => {
    window.location.href = `${svURL}/api/oauth2/authorization/naver`;
  };

  
  return (
    <StyledButton onClick={handleLogin}>
        {/* 네이버로 로그인 */}
        <img src={naverImage} alt="Kakao Login" style={{ width: '100%', height: 'auto' }} />
    </StyledButton>
  );
};

export default NaverLoginButton;