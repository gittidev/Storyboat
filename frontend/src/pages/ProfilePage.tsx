import Profile from "../components/Profile/Profile"
import TabBar from "../components/Commons/TabBar"
import MyStudioList from "../components/Profile/MyStudioList"
import { BorderBox } from "../components/Commons/BorderBox"
import SubTopBar from "../components/Commons/SubTopBar"
import { Box } from "@mui/material"


const ProfilePage = () => {
    const labels = ['일반 설정', '스튜디오 & 팀 관리']
    const childrenComponents = [<Profile/> , <MyStudioList/> ]
    return (
        <>
        
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "10px" }}>
            <Box sx={{ flexGrow: 1}}>
                <SubTopBar title={"내 프로필"} content='프로필 정보를 관리하세요'/>
            </Box>
            <Box sx={{ flexShrink: 0 }}>

            </Box>
        </Box>

         {/* 내용 들어갈 부분 */}
        <BorderBox>
        <TabBar labels={labels} childrenComponents={childrenComponents}/>

                    
        </BorderBox>
        </>
    )


}

export default ProfilePage