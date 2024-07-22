import { styled } from '@mui/system';

const StyledDiv = styled('div')`
    color: darkslategray;
    background-color: aliceblue;
    padding: 8px;
    border-radius: 4px;
`;

const StoryBoxPage = () => {
    return (
    <>
        <StyledDiv>
        스튜디오 스토리 작성하는 곳 페이지
        </StyledDiv>
    </>
    );
};

export default StoryBoxPage;
