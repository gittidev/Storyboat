import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtecedRoute";

//랜딩 페이지, 메인페이지(navbar+각 하위 페이지)
import MainPage from "./pages/MainPage";
import LandingPage from "./pages/LandingPage/LandingPage";
//로딩, 에러 페이지
import LoadingPage from "./pages/LoadingPage";

//네브바 하위 라우팅 페이지
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

import StudioSetting from "./components/Studio/StudioSetting";
import SubscriptionPlan from "./components/Studio/SubscriptionPlan";
import TeamSetting from "./components/Studio/TeamSetting";

function App() {
  const isAuthenticated = true;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route element={<ProtectedRoute isAuthentication={isAuthenticated} redirectPath="/" />}>
          <Route path="/main" element={<MainPage />}>
            <Route path="recent" element={<RecentPage />} />
            <Route path="mystory" element={<MyStoryPage />} />
            <Route path="mychar" element={<MyCharPage />}/>
            <Route path="AIPaintingPage" element={<AIPaintingPage />} />
            <Route path="myidea" element={<MyIdeaPage />} />
            <Route path="storybox" element={<StoryBoxPage />} />
            <Route path="storyedit" element={<StoryEditPage />} />
            <Route path="charbox" element={<CharBoxPage />} />
            <Route path="ideabox" element={<IdeaBoxPage />} />
            <Route path="findteam" element={<FindTeamPage />} />
            <Route path="studio" element={<StudioPage />}>
              {/* <Route path="studioSettings" element={<StudioSetting />} />
              <Route path="subscription" element={<SubscriptionPlan />} />
              <Route path="teamsetting" element={<TeamSetting />} /> */}
            </Route>
            <Route path="profile" element={<ProfilePage />} />
          </Route>

        </Route>
        <Route path="/loading" element={<LoadingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
