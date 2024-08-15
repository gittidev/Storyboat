import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import './LanIntro.css';

const Lanmid: React.FC = () => {
  const [boxHeight, setBoxHeight] = useState('43vh'); // 초기 높이를 43vh로 설정

  const updateHeight = () => {
    const newHeight = window.innerHeight * 0.43; // 사용자가 보는 화면의 43% 계산
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
        minHeight: boxHeight, // 동적으로 계산된 높이 적용
        padding: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '.blue': {
          color: 'rgb(43,126,255);',  
        },
      }}
      className="background-wrapper"
    >
    <div className="container-lan">
    <h2 className="heading-lan"><span className='blue'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;실시간으로 함께 만들어가는 협업 스토리</span></h2>
    <h2>당신과 동료들이 함께 써 내려가는 최고의 창작 플랫폼</h2>
    {/* <p className="subheading">같은 열정으로 모인 작가들과<br />더 쉽게, 더 멋진 이야기를 만들어보세요 😊</p> */}
    </div>
    </Box>
  );
};

export default Lanmid;
