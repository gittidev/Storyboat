import KakaoLoginButton from "../components/Login/KakaoLoginButton";
import GoogleLoginButton from "../components/Login/GoogleLoginButton";
import NaverLoginButton from "../components/Login/NaverLoginButton";

import { Box } from "@mui/material";
import loginstory from '../images/login/loginstory.png';

const LoginPage = () => {
  return (
    <>
    
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh", // 화면 전체 높이를 채우도록 설정
        }}
      >
        <img src={loginstory} alt="Kakao Login" style={{ width: '300px', height: 'auto',marginRight: '110px' }} />
        <br/>
        {/* <h1>Login</h1> */}
        <GoogleLoginButton />
        <br />
        <KakaoLoginButton />
        <br />
        <NaverLoginButton />
      </Box>
    </>
  );
};

export default LoginPage;
