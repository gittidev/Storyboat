import KakaoLoginButton from "../components/Login/KakaoLoginButton";
import GoogleLoginButton from "../components/Login/GoogleLoginButton";
import NaverLoginButton from "../components/Login/NaverLoginButton";

import { Box } from "@mui/material";

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
        <h1>Login</h1>
        <KakaoLoginButton />
        <br />
        <GoogleLoginButton />
        <br />
        <NaverLoginButton />
      </Box>
    </>
  );
};

export default LoginPage;
