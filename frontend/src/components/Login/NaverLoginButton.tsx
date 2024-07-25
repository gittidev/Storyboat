import React from 'react';
import { getNaverAuthToken } from '../../apis/auth'

const NaverLoginButton: React.FC = () => {
  const handleLogin = async () => {
    try {
      const token = await getNaverAuthToken();
      console.log('Received token:', token);
      // 여기서 토큰을 저장하거나 다른 작업을 수행
    } catch (error) {
      console.error('Failed to login with Naver:', error);
    }
  };

  return (
    <button className='naver-btn' onClick={handleLogin}>
      Sign in with Naver
    </button>
  );
};

export default NaverLoginButton;