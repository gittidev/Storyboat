import { Routes, Route } from "react-router-dom"
import styled from "styled-components";

import NavBar from "../components/NavBar.tsx";
import TopBar from "../components/TopBar.tsx";


import MyStoryPage from "../pages/MyStoryPage.tsx"
import MyCharPage from "../pages/MyCharPage.tsx"
import MyIdeaPage from "../pages/MyIdeaPage.tsx"
import StoryBoxPage from "../pages/StoryBoxPage.tsx"
import StoryEditPage from "../pages/StoryEditPage.tsx"
import CharBoxPage from "../pages/CharBoxPage.tsx"
import IdeaBoxPage from "../pages/IdeaBoxPage.tsx"
import StudioPage from "../pages/StudioPage.tsx"
import FindTeamPage from "../pages/FindTeamPage.tsx"
import ProfilePage from "./ProfilePage.tsx";


const styledMainPage = styled.div`
  display : flex;
`


const MainPage = () => {

 
    return (
      <>
        <styledMainPage>

        <NavBar/> 
        <TopBar/>

        </styledMainPage>
    
        {/* 페이지 이동 경로 */}
        <Routes>    
          <Route path='/mystory' element={<MyStoryPage/>}/>
          <Route path='/mychar' element={<MyCharPage/>}/>
          <Route path='/myidea' element={<MyIdeaPage/>}/>
          <Route path='/storybox' element={<StoryBoxPage/>}/>
          <Route path='/storyedit' element={<StoryEditPage/>}/>
          <Route path='/charbox' element={<CharBoxPage/>}/>
          <Route path='/ideabox' element={<IdeaBoxPage/>}/>
          <Route path='/studio' element={<StudioPage/>}/>
          <Route path='/findteam' element={<FindTeamPage/>}/>
          <Route path='/profile' element={<ProfilePage/>}/>

        </Routes>
      </>
      
    )   
}

export default MainPage