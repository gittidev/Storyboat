import styled from "styled-components"


const StyledTopBar = styled.div`
    width : 100%;
    height : 50px;
`



const TopBar = ()=> {
    return (
        <>
        <StyledTopBar/>
            TopBar가 들어갈 공간입니다.
            사이즈 규격을 위한 빈공간입니다.
        </>
    )
}

export default TopBar