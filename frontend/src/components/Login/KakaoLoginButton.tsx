import React from 'react';
// import { getKaKaoAuthToken } from '../../apis/auth'

// const KaKaoLoginButton: React.FC = () => {
//   const handleLogin = async () => {
//     try {
//       const token = await getKaKaoAuthToken();
//       console.log('Received token:', token);
//       // 여기서 토큰을 저장하거나 다른 작업을 수행
//     } catch (error) {
//       console.error('Failed to login with KaKao:', error);
//     }
//   };

//   return (
//     <button className='kakao-btn' onClick={handleLogin}>
//       Sign in with KaKao
//     </button>
//   );
// };

// export default KaKaoLoginButton;

const KaKaoLoginButton: React.FC = () => {
  const handleLogin = () => {
    window.location.href = '/oauth2/authorization/kakao';
  };

  return (
    <button onClick={handleLogin}>
        카카오로 로그인
    </button>
  );
};

export default KaKaoLoginButton;