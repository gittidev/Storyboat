import { styled } from '@mui/system'; 
import { Box } from "@mui/material"
// import ThemeToggle from './ThemeToggle';


const StyledTopBar = styled(Box)`
    width : 100%;
    height : 45px;
    background: -webkit-linear-gradient(to right, #c2e59c, #64b3f4); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to left, #c2e59c, #64b3f4);
    color : white;
    text-align: center;
    line-height:45px;

`

const TopBar = ()=> {
    return (
        <>
        <StyledTopBar>
            스토리 보트에 오신 것을 환영합니다 
        </StyledTopBar>
        </>
    )
}

export default TopBar