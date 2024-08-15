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
import Faq from '../../components/Landing/Faq';
import LanReview from '../../components/Landing/LanReview';
import './LandingPage.css';

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
    const nextIndex = (currentSectionIndex + 1) % sectionRefs.current.length;
    scrollToSection(nextIndex);
  };

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const page = query.get('page');

    switch (page) {
      case 'lanstory':
        scrollToSection(1);
        break;
      case 'friends':
        scrollToSection(3);
        break;
      case 'MainAI':
        scrollToSection(5);
        break;
      case 'LanReview':
        scrollToSection(8);
        break;
      default:
        scrollToSection(0);
        break;
    }
  }, [location.search]);

  return (
    <>
      <div ref={el => (sectionRefs.current[0] = el)} className="section">
        <LandingNav />
        <LanIntro />
      </div>
      <div ref={el => (sectionRefs.current[1] = el)} className="section">
        <Lanstory />
      </div>
      <div ref={el => (sectionRefs.current[2] = el)} className="section">
        <Friends />
      </div>
      <div ref={el => (sectionRefs.current[3] = el)} className="section">
        <MidMenu />
      </div>
      <div ref={el => (sectionRefs.current[4] = el)} className="section">
        <Lanmid />
      </div>
      <div 
        ref={el => (sectionRefs.current[5] = el)} 
        className="section" 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          margin: '40px 0',
          width: '100%' 
        }}
      >
        <img src="/plot.gif" alt="Main AI" style={{ width: '70%', maxWidth: '100%', height: 'auto' }} />
      </div>
      <div 
        ref={el => (sectionRefs.current[6] = el)} 
        className="section" 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          margin: '40px 0',
          width: '100%' 
        }}
      >
        <img src="/write.gif" alt="Main AI 2" style={{ width: '70%', maxWidth: '100%', height: 'auto' }} />
      </div>
      <div 
        ref={el => (sectionRefs.current[7] = el)} 
        className="section" 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          margin: '40px 0',
          width: '100%' 
        }}
      >
        <img src="/AI_painting.gif" alt="Main AI 3" style={{ width: '70%', maxWidth: '100%', height: 'auto' }} />
      </div>
      <div ref={el => (sectionRefs.current[8] = el)} className="section">
        <LanReview />
      </div>
      <div ref={el => (sectionRefs.current[9] = el)} className="section">
        <Faq />
        <Footer />
      </div>
      <ButtonContainer>
        <CustomButton onClick={scrollToNextSection}>
          <KeyboardDoubleArrowDownIcon />
        </CustomButton>
      </ButtonContainer>
    </>
  );
};

export default LandingPage;
