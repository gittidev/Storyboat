import NavBar from '../components/NavBar.tsx';
import { Outlet } from 'react-router-dom';
import TopBar from '../components/TopBar.tsx';
import { Box } from '@mui/material';
import { styled } from '@mui/system';

const StyledBox = styled(Box)`
    width : 100%;
    height : 50px;
    margin : 0px;
`
const MainPage = () => {
  return (
    <>
      <Box sx={{ display: "flex" , margin:'0px'}}>
      
        <NavBar/>

        <StyledBox sx={{ flexGrow: 1, p: 3 }}>
          <TopBar/>
          <Outlet/>
        </StyledBox>
      
      </Box>
    </>
  );
};

export default MainPage;

