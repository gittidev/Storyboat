import React from 'react';
import { RecoilRoot } from 'recoil';
// import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtecedRoute';

// Import pages
import MainPage from './pages/MainPage';
import LandingPage from './pages/LandingPage/LandingPage';
import LoadingPage from './pages/LoadingPage';
import RecentPage from './pages/RecentPage';
import MyStoryPage from './pages/MyStoryPage';
import MyCharPage from './pages/MyCharPage';
import MyIdeaPage from './pages/MyIdeaPage';
import StoryBoxPage from './pages/StoryBoxPage';
import StoryEditPage from './pages/StoryEditPage';
import CharBoxPage from './pages/CharBoxPage';
import IdeaBoxPage from './pages/IdeaBoxPage';
import StudioPage from './pages/StudioPage';
import FindTeamPage from './pages/FindTeamPage';
import ProfilePage from './pages/ProfilePage';
import AIPaintingPage from './pages/AIPaintingPage';
import LoginPage from './pages/LoginPage';

const App: React.FC = () => {
  // const [isDarkMode, setIsDarkMode] = useState(false);

  // const darkTheme = createTheme({
  //   palette: {
  //     mode: isDarkMode ? 'dark' : 'light',
  //   },
  // });

  // const handleToggle = () => {
  //   setIsDarkMode(!isDarkMode);
  // };

  const isAuthenticated = true;

  return (
    <RecoilRoot>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="/loading" element={<LoadingPage />} />
          <Route element={<ProtectedRoute isAuthentication={isAuthenticated} redirectPath="/" />}>
            <Route path="/storyboat" element={<MainPage />}>
              <Route path="recent" element={<RecentPage />} />
              <Route path="mystory" element={<MyStoryPage />} />
              <Route path="mychar" element={<MyCharPage />} />
              <Route path="AIPaintingPage" element={<AIPaintingPage />} />
              <Route path="myidea" element={<MyIdeaPage />} />
              <Route path="storybox" element={<StoryBoxPage />} />
              <Route path="storyedit" element={<StoryEditPage />} />
              <Route path="charbox" element={<CharBoxPage />} />
              <Route path="ideabox" element={<IdeaBoxPage />} />
              <Route path="findteam" element={<FindTeamPage />} />
              <Route path="studio" element={<StudioPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
