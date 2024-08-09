import React from "react";
import logo from '../../images/logo.svg'
import "../../pages/MyChar/App.css";

const NavBar: React.FC = () => {
  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" width={100} />
      {/* <p>책 일러스트 만들기</p> */}
      <a
        className="App-link"
        href="https://www.segmind.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        {/* 빈 a 태그 안에 텍스트가 없어 보이므로, 필요하다면 추가해 주세요 */}
      </a>
    </header>
  );
}

export default NavBar;
