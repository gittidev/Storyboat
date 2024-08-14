// LanIntro.tsx

import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import './LanIntro.css';
import backgroundImage from '../../images/back2.gif'; // 이미지 파일을 import

const LanIntro: React.FC = () => {
  const [boxHeight, setBoxHeight] = useState('40vh'); // 초기 높이를 43vh로 설정

  const updateHeight = () => {
    const newHeight = window.innerHeight * 0.95; // 사용자가 보는 화면의 43% 계산
    setBoxHeight(`${newHeight}px`); // 상태 업데이트
  };

  useEffect(() => {
    updateHeight(); // 컴포넌트가 마운트될 때 높이 업데이트
    window.addEventListener('resize', updateHeight); // 창 크기 변경 시 높이 업데이트

    return () => {
      window.removeEventListener('resize', updateHeight); // 클린업 함수
    };
  }, []);

  return (
    <Box
      sx={{
        backgroundImage: `url(${backgroundImage})`, // url() 함수로 이미지 경로 지정
        backgroundSize: 'cover', // 이미지가 전체를 덮도록 설정
        backgroundPosition: 'center', // 이미지의 위치를 중앙으로 설정
        minHeight: boxHeight, // 동적으로 계산된 높이 적용
        padding: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: -1,
        clipPath: 'inset(0 0 10% 0)', // 이미지의 하단 20%를 잘라냄
      }}
      className="background-wrapper"
    >
      <div className="container-lanintro">
        <h1 className="heading">웹소설 작가를 위한 <br />종합 창작 플랫폼 <span >"StoryBoat"</span></h1>
        <br />
        <p className="subheading">동료 작가들과 협력하여 <br />보다 편리하게 멋진 원고를 작성해보세요 😊</p>
      </div>
    </Box>
  );
};
// <span style={{ color: 'rgb(43,126,255)' }}>"StoryBoat"</span>
{/* <span style={{ color: 'rgb(43,126,255)' }}>"StoryBoat"</span> */}
export default LanIntro;
