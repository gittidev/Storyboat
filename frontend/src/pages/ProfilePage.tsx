import React from "react";
import Profile from "../components/Profile/Profile";
import TabBar from "../components/Commons/TabBar";
import MyStudioList from "../components/Profile/MyStudioList";
import { BorderBox } from "../components/Commons/BorderBox";
import SubTopBar from "../components/Commons/SubTopBar";
import { Box } from "@mui/material";




const ProfilePage: React.FC = () => {
    const labels = ['일반 설정', '스튜디오 & 팀 관리'];
    
    const childrenComponents = [
        <Profile />, 
        <MyStudioList />
    ];

    return (
        <>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%", padding: "0px 20px 20px 20px" }}>
                <Box sx={{ flexGrow: 1 }}>
                    <SubTopBar title={"내 프로필"} content='프로필 정보를 관리하세요' />
                </Box>
                <Box sx={{ flexShrink: 0 }}>
                </Box>
            </Box>

            {/* 내용 들어갈 부분 */}
            <BorderBox>
                <Box sx={{ display: 'flex', justifyContent: 'center', padding:'20px' }}>
                <Box sx={{ width: '90%' }}>
                    <TabBar labels={labels} childrenComponents={childrenComponents} />
                </Box>
                </Box>
            </BorderBox>
        </>
    );
};

export default ProfilePage;
