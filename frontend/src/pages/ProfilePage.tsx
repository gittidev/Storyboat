import Profile from "../components/Profile/Profile"
import TabBar from "../components/TabBar"
import ProfileForm from "../components/Profile/ProfileForm"
import MyStudioList from "../components/Profile/MyStudioList"


const ProfilePage = () => {
    const labels = ['일반 설정', '스튜디오 & 팀 관리']
    const childrenComponents = [<ProfileForm/> , <MyStudioList/> ]
    return (
        <>
        {/* <ProfileForm/> */}
        <Profile/>
        <TabBar labels={labels} childrenComponents={childrenComponents}/>
        </>
    )


}

export default ProfilePage