import { styled } from '@mui/system'; 
import { Box } from "@mui/material"
import Button from './Button';
import { SearchBar } from './SearchBar';

const StyledSubBar = styled(Box)`
    width : 100%;
    height : 40px;
    padding : 0px;
    border-bottom : 1px solid #D1D5DB;

`

const SubTopBar = () => {
  return (
    <StyledSubBar sx={{ m: 0 }} >
      유동적 공간
    </StyledSubBar>
  )


}

export default SubTopBar


