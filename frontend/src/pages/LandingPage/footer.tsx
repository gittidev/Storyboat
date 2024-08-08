import React from 'react';
import './footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <h1 className="logo">스토리 보트</h1>
        <nav className="nav">
          <a className="nav-link" href="/">홈</a>
          <a className="nav-link" href="/about">회사 소개</a>
          <a className="nav-link" href="/services">서비스</a>
          <a className="nav-link" href="/contact">연락처</a>
          <a className="nav-link" href="/blog">블로그</a>
          <a className="nav-link" href="/careers">채용</a>
          <a className="nav-link" href="/support">지원</a>
          <a className="nav-link" href="/faq">자주 묻는 질문</a>
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
          <p>이메일: <a href="mailto:info@storyboat.com">info@storyboat.com</a></p>
          <p>전화: <a href="tel:+1234567890">+1 (234) 567-890</a></p>
          <p>주소: 123 창작로, 스토리타운, 문학국</p>
        </div>
        <div className="legal-links">
          <a href="/privacy-policy">개인정보 처리방침</a>
          <a href="/terms-of-service">이용 약관</a>
          <a href="/cookies-policy">쿠키 정책</a>
        </div>

        <p>&copy; 2024 스토리 보트. 모든 권리 보유.</p>
        <div className='last'></div>
      </div>
    </footer>
  );
};

export default Footer;
