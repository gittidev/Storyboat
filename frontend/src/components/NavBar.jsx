import logo from "../images/logo.svg";
import "../App.css";

const NavBar = () => {
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
      
      </a>
    </header>
  );
}

export default NavBar;
