import styled from "styled-components"

import KakaoLoginButton from "../components/Login/KakaoLoginButton"
import GoogleLoginButton from "../components/Login/GoogleLoginButton"

const LoginPage = () => {
    return (
        <>
        <h1>Login</h1>
        <KakaoLoginButton/>
        <br />
        <GoogleLoginButton/>

        </>
    )


}

export default LoginPage