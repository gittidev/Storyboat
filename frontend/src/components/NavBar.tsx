import { Link } from "react-router-dom"
import styled from "styled-components"





const NavBar = () =>{
    return(
        <>
        <Link to='/mystory'>나만의 스토리</Link>
        <Link to='/mychar'>나만의 캐릭터</Link>
        <Link to='/myidea'>나만의 아이디어</Link>
        <Link to='/storybox'>Story Box</Link>
        <Link to='/storyedit'>Story 보관소</Link>
        <Link to='/charbox'>캐릭터 보관소</Link>
        <Link to='/ideabox'>아이디어 보관소</Link>
        <Link to='/studio'>스튜디오 설정</Link>
        <Link to='/findteam'>팀 찾기</Link>
        </>
    )

}

export default NavBar