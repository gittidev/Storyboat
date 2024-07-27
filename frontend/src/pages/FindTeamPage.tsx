import React from "react"
import Tag  from "../components/Tag"
import { SearchBar } from "../components/SearchBar"
import FindTeamBox from '../components/FindTeamBox'
import CustomButton from "../components/CustomButton"
import SubTopBar from "../components/SubTopBar"

const FindTeamPage:React.FC = () => {

    return (
        <>
        <SubTopBar title='항해하기' content="다른 스튜디오 및 글쓰기를 탐색할수 있는 공간입니다."/>
        <Tag/>
        <SearchBar/>
        <CustomButton content='+ 생성하기' bgcolor="lightgreen" hoverBgColor="green"/>
        <FindTeamBox/>

        </>
    )


}

export default FindTeamPage
