import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { styled } from '@mui/system';
import { Container as MuiContainer } from '@mui/material';
import NavBar from '../components/NavBar';
import TopBar from '../components/TopBar';
import Logo from '../assets/logo.png';

import { Box } from '@mui/material';

const NavBarFrame = styled(Box)`
  width: ${(props) => (props.open ? '250px' : '50px')};
  height: 100%;
  border: 1px solid #d9d9d9;
  transition: width 0.3s;
  // z-index:2;
`;

const MainPageFrame = styled(Box)`
  margin-left: ${(props) => (props.open ? '250px' : '50px')};
  width: calc(100% - ${(props) => (props.open ? '250px' : '50px')});
  transition: margin-left 0.3s, width 0.3s;

`;

const MainPage = () => {
  const [isNavBarOpen, setIsNavBarOpen] = useState(true); // Default state of NavBar

  const handleNavBarToggle = (open: boolean) => {
    setIsNavBarOpen(open);
  };

  return (
    <>
      <NavBarFrame open={isNavBarOpen}>
        <NavBar onToggle={handleNavBarToggle} />
            <button
            onClick={handleNavBarToggle}
            sx={{
              border: '1px solid #D9D9D9',
              padding: '10px',
              borderRadius: '0px 16px 16px 0px',
            }}
          >
            <img src={Logo} width={30} />
          </button>
      </NavBarFrame>

      <MuiContainer maxWidth={'xl'}>
      <MainPageFrame open={isNavBarOpen}>
        <TopBar />
        <Outlet/>
      </MainPageFrame>
      </MuiContainer>
    </>
  );
};

export default MainPage;
