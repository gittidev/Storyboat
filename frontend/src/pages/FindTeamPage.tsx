import React from "react"
// import React, {useState} from "react"

// import styled from "styled-components"
// import { Tag }  from "../components/Tag"
import Tag  from "../components/Tag"
import { SearchBar } from "../components/SearchBar"
import Button from "../components/CustomButton"
// import BasicCard from "../components/Card"
// import FindTeamForm from "../components/FindTeamForm"
import FindTeamBox from '../components/FindTeamBox'


// interface CardProps {
//     tags :
// }

const FindTeamPage:React.FC = () => {
    // const [visible,setVisible] = useState(false)

    return (
        <>
        <Tag/>
        <SearchBar/>
        <Button/>
        <FindTeamBox/>

        </>
    )


}

export default FindTeamPage
