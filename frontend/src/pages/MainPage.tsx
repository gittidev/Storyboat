import { Routes, Route } from "react-router-dom"

import NavBar from "../components/NavBar.tsx";
import LandingPage from "../pages/LandingPage.tsx";
import MyStoryPage from "../pages/MyStoryPage.tsx"
import MyCharPage from "../pages/MyCharPage.tsx"
import MyIdeaPage from "../pages/MyIdeaPage.tsx"
import StoryBoxPage from "../pages/StoryBoxPage.tsx"
import StoryEditPage from "../pages/StoryEditPage.tsx"
import CharBoxPage from "../pages/CharBoxPage.tsx"
import IdeaBoxPage from "../pages/IdeaBoxPage.tsx"
import StudioPage from "../pages/StudioPage.tsx"
import FindTeamPage from "../pages/FindTeamPage.tsx"

const MainPage = () => {
 
    return (
        <>
    <NavBar/> 
    
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
    </Routes>
    </>
    )   
}

export default MainPage