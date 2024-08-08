import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material';
import { useRecoilState } from 'recoil';
import { refreshTokenState, accessTokenState } from './recoil/atoms/authAtom';
import api from './apis/api';

// Import pages
import MainPage from './pages/MainPage';
import LandingPage from './pages/LandingPage/LandingPage';
import LoginLoadingPage from './pages/LoginLoadingPage';
import RecentPage from './pages/RecentPage';
import MyStoryPage from './pages/MyStoryPage';
import MyStoryEditPage from './pages/MyStoryEditPage';
import MyCharPage from './pages/MyCharPage';
import MyIdeaPage from './pages/MyIdeaPage';
import StoryBoxPage from './pages/StoryBoxPage';
import StoryEditPage from './pages/StoryEditPage';
import CharBoxPage from './pages/CharBoxPage';
import IdeaBoxPage from './pages/IdeaBoxPage';
import StudioPage from './pages/StudioPage';
import FindTeamPage from './pages/FindTeamPage';
import FindTeamDetail from './pages/FindTeamDetail';
import ProfilePage from './pages/ProfilePage';
import AIPaintingPage from './pages/AIPaintingPage';
import LoginPage from './pages/LoginPage';

// 공동 작업 영역 렌더링
import StoryDetail from './components/Plot/StoryDetail';

// 로그인 상태관리
import ProtectedRoute from './ProtecedRoute';

const App: React.FC = () => {
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
  const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState);
  console.log(accessToken)
  useEffect(() => {
    const setTokens = (newAccessToken: string) => {
      localStorage.setItem('access', newAccessToken);
      setAccessToken(newAccessToken);
      setRefreshToken(true);
    };

    const clearTokens = () => {
      localStorage.clear();
      setRefreshToken(false);
      window.location.href = '/login';
    };

    api.interceptors.response.use(
      response => response,
      async error => {
        const msg = error.response?.data?.message;
        const status = error.response?.status;

        if (status === 401 && msg === 'Access Token is Expired') {
          try {
            const response = await api.post('/api/reissue', {}, {
              headers: {
                'Content-Type': 'application/json',
              },
            });

            if (response.status === 200) {
              const newAccessToken = response.headers.authorization.split(' ')[1]; // 'Bearer' 제거
              setTokens(newAccessToken);

              error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
              return api.request(error.config);
            } else {
              clearTokens();
            }
          } catch (refreshError) {
            console.error('Failed to refresh token', refreshError);
            window.alert('시간이 경과하여 자동으로 로그아웃 되었습니다.');
            clearTokens();
            return Promise.reject(refreshError);
          }
        } else if ([400, 404, 409].includes(status)) {
          window.alert(`${status} : ${msg}`);
        }

        return Promise.reject(error);
      }
    );
  }, [setAccessToken, setRefreshToken]);

  const theme = createTheme({
    typography: {
      fontFamily: "'Noto Sans KR', sans-serif",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/loading" element={<LoginLoadingPage />} />
          <Route element={<ProtectedRoute isAuthentication={refreshToken} redirectPath="/login" />}>
            <Route path="storyboat" element={<MainPage />}>
              {/* 네브바에서 라우팅 */}
              <Route path="recent" element={<RecentPage />} />
              <Route path="mystory" element={<MyStoryPage />} />
              {/* <Route path="mystory/:storyId" element={<MyStoryDetail />} /> */}
              <Route path="mystoryedit" element={<MyStoryEditPage />} />
              <Route path="mychar" element={<MyCharPage />} />
              <Route path="AIPaintingPage" element={<AIPaintingPage />} />
              <Route path="myidea" element={<MyIdeaPage />} />
              <Route path="storybox" element={<StoryBoxPage />} />
              <Route path="storyedit" element={<StoryEditPage />} />
              <Route path="charbox" element={<CharBoxPage />} />
              <Route path="ideabox" element={<IdeaBoxPage />} />
              <Route path="invitations" element={<FindTeamPage />} />
              <Route path="invitations/:studioId" element={<FindTeamDetail />}/>
              <Route path="studios" element={<StudioPage />} />
              <Route path="profile" element={<ProfilePage />} />
              {/* 공동작업영역 라우팅 */}
              <Route path="mystory/:storyid" element={<StoryDetail/>} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
