// src/pages/LoginLoadingPage.tsx
import './loadingpage.css';
import { useSetRecoilState } from 'recoil';
import { refreshTokenState, accessTokenState } from '../recoil/atoms/authAtom';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { verifyRefreshToken } from '../apis/auth';

const LoginLoadingPage: React.FC = () => {
  const navigate = useNavigate();
  const setRefreshToken = useSetRecoilState(refreshTokenState);
  const setAccessToken = useSetRecoilState(accessTokenState);


  useEffect(() => {
    const verifyToken = async () => {
      try {
        const newAccessToken = await verifyRefreshToken();
        console.log('New Access Token:', newAccessToken); // 확인용 로그
        if (newAccessToken) {
          setAccessToken(newAccessToken);
          setRefreshToken(true);
          console.log('Navigating to /storyboat/profile'); // 네비게이션 로그
          navigate('/storyboat/profile', { replace: true });
        } else {
          throw new Error('Invalid token');
        }
      } catch (error) {
        console.error('Failed to verify refresh token:', error); // 에러 로그
        setRefreshToken(false);
        console.log('Navigating to /login'); // 네비게이션 로그
        navigate('/login', { replace: true });
      }
    };
    
    verifyToken();
  }, [navigate, setAccessToken, setRefreshToken]);

  

  return (
    <div className="loadingpagebody">

      <div className="loader">
        <div className="wave-container">
          <div className="wave wave1"></div>
          <div className="wave wave2"></div>
          <div className="wave wave3"></div>
          <div className="wave wave4"></div>
          <div className="wave wave5"></div>
        </div>
      </div>

    </div>
  );
};

export default LoginLoadingPage;
