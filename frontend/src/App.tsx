



import MainPage from "./pages/MainPage.tsx";
import LandingPage from "./pages/LandingPage.tsx";

function App() { 
  const isLogin:number = 1
  




  if (isLogin!==1) {
        // 로그인 안되어있을땐 랜딩 페이지
    console.log('isLogin')
    return <LandingPage/>
  } 
  // 로그인 되어있으면 메인
  return <MainPage/>
  
}

export default App
