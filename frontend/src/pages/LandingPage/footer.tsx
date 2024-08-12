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

        <nav className="nav">
          <br/>
          <a className="nav-link" href="#">홈</a>
          <a className="nav-link" href="#">회사 소개</a>
          <a className="nav-link" href="#">서비스</a>
          <a className="nav-link" href="#">연락처</a>
          <a className="nav-link" href="#">블로그</a>
          <a className="nav-link" href="#">채용</a>
          <a className="nav-link" href="#">지원</a>
          <a className="nav-link" href="#">자주 묻는 질문</a>
        </nav>
        <div className="social-media-icons">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">페이스북</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">트위터</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">링크드인</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">인스타그램</a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">유튜브</a>
        </div>
        <div className="contact-info">
          <p><strong>연락처</strong></p>
          <p>이메일: <a href="#m">info@storyboat.com</a></p>
          <p>전화: <a href="#">+1 (234) 567-890</a></p>
          <p>주소: 123 창작로, 스토리타운, 문학국</p>
        </div>
        <div className="legal-links">
          <a href="#">개인정보 처리방침</a>
          <a href="#">이용 약관</a>
          <a href="#">쿠키 정책</a>
        </div>

        <p>&copy; 2024 스토리 보트. 모든 권리 보유.</p>
        <div className='last'></div>
      </div>
    </footer>
  );
};

export default Footer;
