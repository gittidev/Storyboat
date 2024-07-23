import { Box } from "@mui/material"
import SubTopBar from "../components/SubTopBar"
import TabBar from "../components/TabBar"
import { Outlet } from "react-router-dom"


const StudioPage = () => {
    return (
        <>
            <SubTopBar/>
            <TabBar/>
            <Box>
            <Outlet/>
            </Box>
            
        </>
        
        
    )


}

export default StudioPage