import CustomButton from '../components/CustomButton';
import SubTopBar from '../components/SubTopBar';
import { Box } from '@mui/material';
import { BorderBox } from '../components/BorderBox';


const StoryBoxPage = () => {
    return (
    <>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "10px" }}>
            <Box sx={{ flexGrow: 1}}>
                <SubTopBar title={"스튜디오's STORY 보관함"} content='스튜디오의 스토리를 작성하고 새로운 플롯을 추가하세요'/>
                </Box>
                <Box sx={{ flexShrink: 0 }}>
                <CustomButton content='+ 생성하기' bgcolor="lightgreen" hoverBgColor="green"/>
            </Box>
        </Box>

        {/* 내용 들어갈 부분 */}
        <BorderBox>

            
        </BorderBox>
    </>
    );
};




export default StoryBoxPage;
