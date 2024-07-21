import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { styled } from '@mui/system';

import NavBar from '../components/NavBar';
import TopBar from '../components/TopBar';


import { Box } from '@mui/material';

const NavBarFrame = styled(Box)`
  width: ${(props) => (props.open ? '250px' : '50px')};
  height: 100%;
  border: 1px solid #d9d9d9;
  transition: width 0.3s;
`;

const MainPageFrame = styled(Box)`
  margin-left: ${(props) => (props.open ? '250px' : '50px')};
  width: calc(100% - ${(props) => (props.open ? '250px' : '50px')});
  transition: margin-left 0.3s, width 0.3s;
  display :flex;
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
      </NavBarFrame>

      <MainPageFrame open={isNavBarOpen}>
        <TopBar />
        <Outlet/>
      </MainPageFrame>
    </>
  );
};

export default MainPage;
