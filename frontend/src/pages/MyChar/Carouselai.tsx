import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

// 이미지 경로
import main11 from '../../images/main11.png';
import main12 from '../../images/main12.png';
import main13 from '../../images/main13.png';
import main14 from '../../images/main14.png';
import main15 from '../../images/main15.png';
import main16 from '../../images/main16.png';
import main17 from '../../images/main17.png';
import main18 from '../../images/main18.png';
import main19 from '../../images/main19.png';
import main110 from '../../images/main110.png';

// 슬라이드 데이터
const slides = [
  { src: main11, title: '판타지' },
  { src: main12, title: '코믹' },
  { src: main13, title: '미스터리' },
  { src: main14, title: '로맨스' },
  { src: main15, title: '공포' },
  { src: main16, title: '과학 소설' },
  { src: main17, title: '역사 소설' },
  { src: main18, title: '모험' },
  { src: main19, title: '드라마' },
  { src: main110, title: '시크릿' }
];

const Carouselai: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // 다음 슬라이드로 이동
  const nextSlide = () => {
    if (currentSlide < slides.length - 1) { 
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) { 
      setCurrentSlide((prev) => prev - 1);
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden', padding: '0 16px' }}>
      <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mb: 2 }}>
        {/* MUI Carouselai */}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          transition: 'transform 0.5s ease-in-out',
          transform: `translateX(-${currentSlide * (100 / 3 + 10)}%)`,
          width: `${(slides.length * (100 / 3 + 10))}%)`, // 컨테이너 너비 조정
        }}
      >
        {slides.map((slide, index) => (
          <Box
            key={index}
            sx={{
              minWidth: `${100 / 3}%`, // 각 슬라이드의 너비
              height: 650,
              marginRight: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center', // 슬라이드 내용 중앙 정렬
              alignItems: 'center', // 슬라이드 내용 중앙 정렬
              textAlign: 'center',
              position: 'relative'
            }}
          >
            <img src={slide.src} alt={slide.title} style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
            <Typography >
              {/* {slide.title} */}
            </Typography>
          </Box>
        ))}
      </Box>

      <Button
        onClick={prevSlide}
        // disabled={currentSlide === slides.length - 1}
        sx={{
          position: 'absolute',
          left: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          color: '#fff',
          fontSize: '3.5rem', // 버튼 내 아이콘의 크기 조정
          width: '160px', // 버튼의 너비
          height: '300px', // 버튼의 높이
          minWidth: '80px', // 버튼의 최소 너비
          minHeight: '80px', // 버튼의 최소 높이
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent', // 기본 배경색 제거
          boxShadow: 'none', // 클릭 시 그림자 효과 제거
          border: 'none', // 클릭 시 테두리 효과 제거
          '&:hover': {
            backgroundColor: 'transparent', // hover 시 배경색 유지
            boxShadow: 'none', // hover 시 그림자 효과 제거
          },
          '&:focus': {
            outline: 'none', // 포커스 시 아웃라인 제거
          },
          '&:active': {
            backgroundColor: 'transparent', // 클릭 시 배경색 유지
            boxShadow: 'none', // 클릭 시 그림자 효과 제거
          }
        }}
      >
        <ArrowBackIosNewIcon sx={{ fontSize: 'inherit' }} /> {/* 아이콘 크기 조정 */}
      </Button>

      <Button
        onClick={nextSlide}
        sx={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          color: '#fff',
          fontSize: '3.5rem', // 버튼 내 아이콘의 크기 조정
          width: '160px', // 버튼의 너비
          height: '300px', // 버튼의 높이
          minWidth: '80px', // 버튼의 최소 너비
          minHeight: '80px', // 버튼의 최소 높이
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent', // 기본 배경색 제거
          boxShadow: 'none', // 클릭 시 그림자 효과 제거
          border: 'none', // 클릭 시 테두리 효과 제거
          '&:hover': {
            backgroundColor: 'transparent', // hover 시 배경색 유지
            boxShadow: 'none', // hover 시 그림자 효과 제거
          },
          '&:focus': {
            outline: 'none', // 포커스 시 아웃라인 제거
          },
          '&:active': {
            backgroundColor: 'transparent', // 클릭 시 배경색 유지
            boxShadow: 'none', // 클릭 시 그림자 효과 제거
          }
        }}
      >
        <ArrowForwardIosIcon sx={{ fontSize: 'inherit' }} /> {/* 아이콘 크기 조정 */}
      </Button>
    </Box>
  );
};

export default Carouselai;
