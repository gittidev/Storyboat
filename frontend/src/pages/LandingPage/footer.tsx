import React from 'react';
import './footer.css';
import logo from '../../assets/logo.png';

const Footer: React.FC = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={logo}
            alt="로고"
            style={{ width: 40, height: 30, marginRight: 16 }}
          />
          <h1 className="logo">STORY BOAT</h1>
        </div>
        <br/>
        <div className="social-media-icons">
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook">SSAFY 광주 1반 C107조</a>
        </div>
        <div className="social-media-icons">
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook">김시온</a>
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter">김연지</a>
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">박보람</a>
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram">서한빈</a>
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="YouTube">이중현</a>
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram">정소영</a>
        </div>
        <div className="contact-info">
          <p>깃허브 : <a href="#m">https://lab.ssafy.com/S11P12C107.git</a></p>
        </div>
        <p>&copy; 2024년 08월 공통 프로젝트 </p>
        <div className='last'></div>
      </div>
    </footer>
  );
};

export default Footer;
