import { styled } from '@mui/system'; 
import { Box } from "@mui/material"
import Button from './Button';
import { SearchBar } from './SearchBar';


interface SubTopBarProps {
  title?: string;
}

const StyledSubBar = styled(Box)`
    width : 100%;
    height : 50px;
    padding :5px 10px 10px 10px;
    font-size:30px;

`

const SubTopBar = (props: SubTopBarProps) => {
  return (
    <StyledSubBar sx={{ m: 0 }}>
      {props.title}
    </StyledSubBar>
  );
};

export default SubTopBar;


