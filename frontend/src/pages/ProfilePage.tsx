import SubTopBar from "../components/SubTopBar"
import TabBar from "../components/TabBar"
import ProfileForm from "../components/ProfileCom/ProfileForm"
import Profile from "../components/ProfileCom/Profile"

const ProfilePage = () => {
    return (
        <>
        <SubTopBar title={'프로필 페이지'}/>
        <>
        <TabBar/>
        </>
        
        
        <ProfileForm/>
        <Profile/>
        </>
    )


}

export default ProfilePage