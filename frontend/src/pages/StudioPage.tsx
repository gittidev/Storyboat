import SubTopBar from "../components/Commons/SubTopBar"
import TabBar from "../components/Commons/TabBar"
import StudioSetting from "../components/StudioSetting/StudioSetting"
import TeamSetting from "../components/StudioSetting/TeamSetting"
import { Container } from "@mui/material"
import { styled } from "@mui/system"
import { BorderBox } from "../components/Commons/BorderBox"
import { Box } from "@mui/material"

const StyledContainer = styled(Container)`
    margin-top: 10px;
`


const StudioPage = () => {
    const labels = ['일반 설정',  '팀 관리']
    const childrenComponents = [<StudioSetting/>, <TeamSetting/>]

    return (
        <> 

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%", padding: "0px 20px 20px 20px"}}>
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