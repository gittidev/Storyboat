import { Box } from '@mui/material';
import SubTopBar from "../components/SubTopBar";
import CustomButton from "../components/CustomButton";
import { BorderBox } from '../components/BorderBox';

const MyIdeaPage = () => {
return (
    <>
    
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "10px" }}>
        <Box sx={{ flexGrow: 1}}>
        <SubTopBar title={'개인 아이디어 보관함'} content="나만의 아이디어를 작성하세요" />
        </Box>
        <Box sx={{ flexShrink: 0 }}>
        <CustomButton content='+ 생성하기' bgcolor="lightgreen" hoverBgColor="green" />
        </Box>
    </Box>

    {/* 내용 들어갈 부분 */}
    <BorderBox>

        
    </BorderBox>
    </>
);
}

export default MyIdeaPage;
