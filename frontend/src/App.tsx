import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { refreshTokenState, accessTokenState } from './recoil/atoms/authAtom';
import { myStudioState } from './recoil/atoms/studioAtom';
import api from './apis/api';
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
import MyOverviewFlow from './components/Mystory/MyOverviewFlow';
import StudioOverviewFlow from './components/StudioStoryBox/StudioOverviewFlow';
import TextEditPage from './components/Plot/TextEditPage';
// 로그인 상태관리
import ProtectedRoute from './ProtecedRoute';
// const svURL = import.meta.env.VITE_SERVER_URL;
import MyTextEditPage from './components/Mystory/MyTextEditPage'
import { nameState } from './recoil/atoms/userAtom';


const App: React.FC = () => {
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
  const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState);
  console.log(accessToken)
  const setStudioId = useSetRecoilState(myStudioState);
  const setPenName = useSetRecoilState(nameState);

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/api/users/profiles`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      });

      if (response.status === 200) {
        const { data } = response.data;
        if (data && data.privateStudio && data.privateStudio.studioId) {
          setStudioId(data.privateStudio.studioId);
        }
        setPenName(data.penName)
      } else {
        throw new Error('프로필 정보를 가져오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('프로필 정보를 가져오는데 오류가 발생했습니다:', error);
    } 
  };

  useEffect(() => {
    console.log(refreshToken)
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
    fetchProfile();
  }, [setAccessToken, setRefreshToken]);

  const theme = createTheme({
    typography: {
      fontFamily: "SBAggroB"
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
            <Route index element={<Navigate to="mystory" replace />} />
              {/* 네브바에서 라우팅 */}
              <Route path="recent" element={<RecentPage />} />
              <Route path="mystory" element={<MyStoryPage />} />
              <Route path="mystory/:storyId" element={<MyOverviewFlow />} />
              <Route path="mystoryedit" element={<MyStoryEditPage />} />
              <Route path="mychar" element={<MyCharPage />} />
              <Route path="AIPaintingPage" element={<AIPaintingPage />} />
              <Route path="myidea" element={<MyIdeaPage />} />
              <Route path="storybox" element={<StoryBoxPage />} />
              <Route path="storybox/:storyId" element={<StudioOverviewFlow />} />
              <Route path="storybox/:storyId/edit" element={<TextEditPage />} />
              <Route path="mystory/:storyId/edit" element={<MyTextEditPage />} />
              <Route path="storyedit" element={<StoryEditPage />} />
              <Route path="charbox" element={<CharBoxPage />} />
              <Route path="ideabox" element={<IdeaBoxPage />} />
              <Route path="invitations" element={<FindTeamPage />} />
              <Route path="invitations/:studioId" element={<FindTeamDetail />}/>
              <Route path="studios" element={<StudioPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
