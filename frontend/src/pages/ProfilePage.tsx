import LoginPage from "./LoginPage"
// import { BrowserRouter, Routes, Route } from "react-router-dom"

import ProfileForm from "../components/ProfileCom/ProfileForm"
import Profile from "../components/ProfileCom/Profile"

const ProfilePage = () => {
    return (
        <>
        프로필 페이지
        {/* <LoginPage/>  */}
        <ProfileForm/>
        <Profile/>
        </>
    )


}

export default ProfilePage