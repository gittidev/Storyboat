import { styled } from '@mui/system'; 
import { Box } from "@mui/material"


const StyledTopBar = styled(Box)`
    width : 100%;
    height : 20px;
    margin : 0px;
`

const TopBar = ()=> {
    return (
        <>
        <StyledTopBar>

        사이즈 규격을 위한 빈공간
        </StyledTopBar>
        </>
    )
}

export default TopBar