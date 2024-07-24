import styled from "styled-components"

import KakaoLoginButton from "../components/Login/KakaoLoginButton"
import GoogleLoginButton from "../components/Login/GoogleLoginButton"
import NaverLoginButton from "../components/Login/NaverLoginButton"

const LoginPage = () => {
    return (
        <>
        <h1>Login</h1>
        <KakaoLoginButton/>
        <br />
        <GoogleLoginButton/>
        <br />
        <NaverLoginButton/>

        </>
    )


}

export default LoginPage