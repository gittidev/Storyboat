import { styled } from '@mui/system'; 
import { Box, Typography } from "@mui/material"

const StyledTopBar = styled(Box)`
    width: 100%;
    height: 45px;
    background: -webkit-linear-gradient(to right, #c2e59c, #64b3f4); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to left, #c2e59c, #64b3f4);
    color: white;
    display: flex;               /* Flexbox로 설정 */
    justify-content: center;     /* 가로 방향으로 가운데 정렬 */
    align-items: center;         /* 세로 방향으로 가운데 정렬 */
`;

const TopBar = () => {
    return (
        <StyledTopBar>
            <Typography 
                variant="h6" 
                sx={{ 
                    fontFamily: 'Roboto, sans-serif',  // 원하는 글씨체로 변경
                    fontWeight: 'bold',                // 글씨를 두껍게
                    fontSize: '1.2rem',                // 글씨 크기 조정
                    letterSpacing: '0.1em',            // 글씨 사이 간격 추가
                    textAlign: 'center'                // 텍스트 중앙 정렬
                }}
            >
                WELCOME TO STORYBOAT
            </Typography>
        </StyledTopBar>
    )
}

export default TopBar;
