import React, {useState} from "react"

import styled from "styled-components"
import { Tag } from "../components/Tag"
import { SearchBar } from "../components/SearchBar"
import Button from "../components/Button"
import BasicCard from "../components/Card"
import FindTeam from "../components/FindTeam"


// interface CardProps {
//     tags :
// }

const FindTeamPage:React.FC = () => {
    const [visible,setVisible] = useState(false)

    return (
        <>
        <Tag/>
        <SearchBar/>
        <Button/>
        <button>글 작성</button>
        <h2>팀찾기</h2>
        <BasicCard 
        />
        <button
        onClick={()=>{
            setVisible(!visible)
        }}
        >
            {visible ? "작성하기" : "보이기"}
        </button>
        {visible && <FindTeam/>}
        </>
    )


}

export default FindTeamPage
