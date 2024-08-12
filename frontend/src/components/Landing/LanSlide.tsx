import React, { useState } from 'react';
import './LanSlide.css'; // CSS 파일을 따로 생성하여 스타일링
import lan1 from '../../images/landing/lan1.png'; 
import lan2 from '../../images/landing/lan2.png'; 
import lan3 from '../../images/landing/lan3.png'; 
import lan4 from '../../images/landing/lan4.png'; 
import lan5 from '../../images/landing/lan5.png'; 

const slides = [
  {
    id: 1,
    title: 'Slide 1',
    content: 'This is the content of Slide 1',
    img: lan1,
  },
  {
    id: 2,
    title: 'Slide 2',
    content: 'This is the content of Slide 2',
    img: lan2,
  },
  {
    id: 3,
    title: 'Slide 3',
    content: 'This is the content of Slide 3',
    img: lan3,
  },
  {
    id: 4,
    title: 'Slide 3',
    content: 'This is the content of Slide 3',
    img: lan4,
  },
  {
    id: 5,
    title: 'Slide 3',
    content: 'This is the content of Slide 3',
    img: lan5, 
  },
];

const LanSlide: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (

    <div className='mid-lanslide'>
          <div className="carousel">
      <div className="carousel-slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {slides.map((slide) => (
          <div className="carousel-slide" key={slide.id}>
            <img src={slide.img} alt={slide.title} />
            <h2>{slide.title}</h2>
            <p>{slide.content}</p>
          </div>
        ))}
      </div>
      <button className="carousel-button prev" onClick={prevSlide}>
        Prev
      </button>
      <button className="carousel-button next" onClick={nextSlide}>
        Next
      </button>
    </div>

    </div>
  );
};

export default LanSlide;
