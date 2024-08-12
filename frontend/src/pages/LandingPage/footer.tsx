import React from 'react';
import './footer.css';
import logo from '../../assets/logo.png';

const Footer: React.FC = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
      {/* <img src={logo} alt="로고" style={{ width: 40, height: 40, marginRight: 16 }} />
        <h1 className="logo">스토리 보트</h1> */}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src={logo}
              alt="로고"
              style={{ width: 40, height: 40, marginRight: 16 }}
            />
            <h1 className="logo">스토리 보트</h1>
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
          {/* <p><strong>연락처</strong></p> */}
          <p>깃허브 : <a href="#m">https://lab.ssafy.com/S11P12C107.git</a></p>
          {/* <p>전화: <a href="#">+1 (234) 567-890</a></p> */}
          {/* <p>주소: 123 창작로, 스토리타운, 문학국</p> */}
        </div>
        {/* <div className="legal-links">
          <a href="#">개인정보 처리방침</a>
          <a href="#">이용 약관</a>
          <a href="#">쿠키 정책</a>
        </div> */}
        <p>&copy; 2024년 08월 공통 프로젝트 </p>
          {/* <p>모든 권리 보유</p> */}
        <div className='last'></div>
      </div>
    </footer>
  );
};

export default Footer;
