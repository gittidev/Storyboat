// src/pages/LandingPage/LandingPage.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { styled } from '@mui/system';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import { useLocation } from 'react-router-dom';
import Footer from './footer';
import LandingNav from './LandingNav';
import LanIntro from '../../components/Landing/LanIntro';
import Lanmid from '../../components/Landing/Lanmid';
import Lanstory from '../../components/Landing/Lanstory';
import Friends from '../../components/Landing/Friends';
import MidMenu from '../../components/Landing/MidMenu';
import MainAI from '../../components/Landing/MainAI';
import MainAI2 from '../../components/Landing/MainAI2';
import MainAI3 from '../../components/Landing/MainAI3';
import Faq from '../../components/Landing/Faq';
import LanReview from '../../components/Landing/LanReview';

const CustomButton = styled(Button)`
  margin: 8px;
  padding-bottom: 20px;
  color: gray !important;
  background-color: rgba(173, 216, 230, 0);
  min-width: 150px; 
  font-size: 500px !important;
  text-align: center; 
  height: 70px;
  box-shadow: none !important; 
  transition: none !important;

  .MuiSvgIcon-root {
    font-size: 60px; 
    color: gray !important;
  }

  &:hover {
    background-color: rgba(173, 216, 230, 0);
    box-shadow: none !important;
    transition: none !important;
  }

  &:active {
    background-color: rgba(173, 216, 230, 0);
    box-shadow: none !important;
    transition: none !important;
  }
`;

const ButtonContainer = styled(Box)`
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  font-size: 150px;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const LandingPage: React.FC = () => {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const location = useLocation();

  const scrollToSection = (index: number) => {
    if (sectionRefs.current[index]) {
      sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth' });
      setCurrentSectionIndex(index);
    }
  };

  const scrollToNextSection = () => {
    if (sectionRefs.current.length === 0) return;

    const nextIndex = (currentSectionIndex + 1) % sectionRefs.current.length;
    sectionRefs.current[nextIndex]?.scrollIntoView({ behavior: 'smooth' });
    setCurrentSectionIndex(nextIndex);
  };
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const page = query.get('page');

    switch (page) {
        case 'lanstory':
            setTimeout(() => scrollToSection(1), 100);
            break;
        case 'friends':
            setTimeout(() => scrollToSection(3), 100);
            break;
        case 'MainAI':
            setTimeout(() => scrollToSection(4), 100);
            break;
        case 'LanReview':
            setTimeout(() => scrollToSection(8), 100);
            break;
        default:
            scrollToSection(0);
            break;
    }
}, [location.search]);


  return (
    <>
      <div ref={el => (sectionRefs.current[0] = el)}>
        <LandingNav />
        <LanIntro />
      </div>
      <div ref={el => (sectionRefs.current[1] = el)}>
        <Lanstory />
      </div>
      <div ref={el => (sectionRefs.current[2] = el)}>
        <Friends />
      </div>
      <div ref={el => (sectionRefs.current[3] = el)}>
        <MidMenu />
      </div>
      <div ref={el => (sectionRefs.current[4] = el)}>
        <Lanmid />
      </div>
      <div ref={el => (sectionRefs.current[5] = el)}>
        <MainAI />
      </div>
      <div ref={el => (sectionRefs.current[6] = el)}>
        <MainAI2 />
      </div>
      <div ref={el => (sectionRefs.current[7] = el)}>
        <MainAI3 />
      </div>
      <div ref={el => (sectionRefs.current[8] = el)}>
        <LanReview />
      </div>
      <div ref={el => (sectionRefs.current[9] = el)}>
        <Faq />
      </div>
      <Footer />
      <ButtonContainer>
        <CustomButton onClick={scrollToNextSection}>
          <KeyboardDoubleArrowDownIcon />
        </CustomButton>
      </ButtonContainer>
    </>
  );
};

export default LandingPage;
