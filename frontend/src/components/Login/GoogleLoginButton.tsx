import React from 'react';
// import { getGoogleAuthToken } from '../../apis/auth'

// const GoogleLoginButton: React.FC = () => {
//   const handleLogin = async () => {
//     try {
//       const token = await getGoogleAuthToken();
//       console.log('Received token:', token);
//       // 여기서 토큰을 저장하거나 다른 작업을 수행
//     } catch (error) {
//       console.error('Failed to login with Google:', error);
//     }
//   };

//   return (
//     <button onClick={handleLogin}>
//       Sign in with Google
//     </button>
//   );
// };

// export default GoogleLoginButton;

const GoogleLoginButton: React.FC = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  

  console.log(document.cookie)

  return (
    <button onClick={handleLogin}>
        구글로 로그인
    </button>
  );
};

export default GoogleLoginButton;