import React from 'react';
import { getGoogleAuthToken } from '../../apis/auth'

const GoogleLoginButton: React.FC = () => {
  const handleLogin = async () => {
    try {
      const token = await getGoogleAuthToken();
      console.log('Received token:', token);
      // 여기서 토큰을 저장하거나 다른 작업을 수행
    } catch (error) {
      console.error('Failed to login with Google:', error);
    }
  };

  return (
    <button onClick={handleLogin}>
      Sign in with Google
    </button>
  );
};

export default GoogleLoginButton;