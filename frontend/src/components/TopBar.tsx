import { styled } from '@mui/system'; 
import { Box } from "@mui/material"


const StyledTopBar = styled(Box)`
    width : 100%;
    height : 50px;
    border : 1px solid #D9D9D9;
`

const TopBar = ()=> {
    return (
        <>
        <StyledTopBar>
        TopBar가 들어갈 공간입니다.
        사이즈 규격을 위한 빈공간입니다.
        </StyledTopBar>
        </>
    )
}

export default TopBar