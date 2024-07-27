import { styled } from '@mui/system'; 
import { Box, Typography } from "@mui/material"


interface SubTopBarProps {
  title?: string;
  content?:string;
}

const StyledSubBar = styled(Box)`
    width : 100%;
    height : 50px;
    padding :5px 10px 10px 10px;
`

const SubTopBar = (props: SubTopBarProps) => {
  return (
    <StyledSubBar>
      <Typography variant="h5" component="span">
        {props.title}
      </Typography>
      <Typography variant="body2" component="span" sx={{ color: 'gray', marginLeft: 1 }}>
        {props.content}
      </Typography>
    </StyledSubBar>
  );
};

export default SubTopBar;


