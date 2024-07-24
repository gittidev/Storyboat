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
          <Box sx={{ border : '1px solid #D1D5DB', borderRadius : '5px', padding:'5px'}}>
          <Outlet/>
          </Box>
        
        </StyledBox>
      
      </Box>
    </>
  );
};

export default MainPage;

