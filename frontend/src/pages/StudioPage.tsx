import SubTopBar from "../components/SubTopBar"
import TabBar from "../components/TabBar"
import StudioSetting from "../components/Studio/StudioSetting"
import SubscriptionPlan from "../components/Studio/SubscriptionPlan"
import TeamSetting from "../components/Studio/TeamSetting"
import { Container } from "@mui/material"
import { styled } from "@mui/system"
import { BorderBox } from "../components/BorderBox"
import { Box } from "@mui/material"

const StyledContainer = styled(Container)`
    margin-top: 10px;
`


const StudioPage = () => {
    const labels = ['일반 설정', '요금제 & 플랜', '팀 관리']
    const childrenComponents = [<StudioSetting/>, <SubscriptionPlan/>, <TeamSetting/>]

    return (
        <> 


        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "10px" }}>
            <Box sx={{ flexGrow: 1}}>
                <SubTopBar title={"스튜디오 설정하기"} content='스튜디오 정보를 관리하세요'/>
            </Box>

        </Box>

        <BorderBox>
        <StyledContainer>
            <TabBar labels={labels} childrenComponents={childrenComponents}/>
            </StyledContainer>
        </BorderBox>
        </>
    )


}

export default StudioPage