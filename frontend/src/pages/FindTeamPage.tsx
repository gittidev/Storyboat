import React from "react"
import { SearchBar } from "../components/Commons/SearchBar"
import FindTeamBox from '../components/FindTeam/FindTeamBox'
import CustomButton from "../components/Commons/CustomButton"
import SubTopBar from "../components/Commons/SubTopBar"
import { BorderBox } from "../components/Commons/BorderBox"
import { Box } from "@mui/material"
// import useModal from "../hooks/useModal"

const FindTeamPage:React.FC = () => {
    // const { open, handleOpen, handleClose } = useModal();

    return (
        <>


        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "10px" }}>
            <Box sx={{ flexGrow: 1 }}>
            <SubTopBar title='항해하기' content="현재 팀원을 모집중인 스튜디오를 찾아보세요."/>
            </Box>
            <Box sx={{ flexShrink: 0 }}>
            <CustomButton content='+ 팀원 모집하기' bgcolor="lightgreen" hoverBgColor="green" />
            </Box>
            </Box>

            {/* 화면에 들어갈 내역 */}
            <BorderBox>
            <FindTeamBox/>
                <SearchBar/>
            </BorderBox>
        </>
    )


}

export default FindTeamPage
