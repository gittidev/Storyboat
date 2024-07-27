
import SubTopBar from "../components/SubTopBar"
import TabBar from "../components/TabBar"
import StudioSetting from "../components/Studio/StudioSetting"
import SubscriptionPlan from "../components/Studio/SubscriptionPlan"
import TeamSetting from "../components/Studio/TeamSetting"
import { Container } from "@mui/material"
import { styled } from "@mui/system"
import CustomButton from "../components/CustomButton"

const StyledContainer = styled(Container)`
    margin-top: 10px;
`


const StudioPage = () => {
    const labels = ['일반 설정', '요금제 & 플랜', '팀 관리']
    const childrenComponents = [<StudioSetting/>, <SubscriptionPlan/>, <TeamSetting/>]

    return (
        <> 
            <SubTopBar title={'스튜디오 페이지'}/>
            <CustomButton content='+ 생성하기' bgcolor="lightgreen" hoverBgColor="green"/>
            <StyledContainer>
            <TabBar labels={labels} childrenComponents={childrenComponents}/>
            </StyledContainer>
        </>
    )


}

export default StudioPage