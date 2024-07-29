import NavBar from '../components/Commons/NavBar.tsx';
import { Outlet } from 'react-router-dom';
import TopBar from '../components/Commons/TopBar.tsx';
import { Box, Container } from '@mui/material';
import { styled } from '@mui/system';
import { useEffect } from 'react';

const StyledBox = styled(Box)` 
    width : 100%;
    height : 50px;
`
const MainPage = () => {
  useEffect(() => {
    // refresh_token 쿠키에 저장된 것 확인
    console.log('cookie :',document.cookie);

  }, []);

  return (

      <Box sx={{ display: "flex"}}>
        <NavBar/>
        <StyledBox sx={{ flexGrow: 1 }}>
          <TopBar/>
          <Container maxWidth='xl' sx={{display:'flex', flexDirection:'column'}}>
          <Outlet/>
          </Container>
        </StyledBox>
      </Box>

  );
};

export default MainPage;