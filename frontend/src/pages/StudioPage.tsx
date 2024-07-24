import { Box } from "@mui/material"
import SubTopBar from "../components/SubTopBar"
import TabBar from "../components/TabBar"
import { Outlet } from "react-router-dom"


const StudioPage = () => {
    return (
        <>
            <SubTopBar title={'스튜디오 페이지'}/>
            <TabBar/>
            <Box>
            <Outlet/>
            </Box>
            
        </>
        
        
    )


}

export default StudioPage