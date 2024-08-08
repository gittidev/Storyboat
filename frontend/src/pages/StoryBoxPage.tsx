import CustomButton from '../components/Commons/CustomButton';
import SubTopBar from '../components/Commons/SubTopBar';
import { Box } from '@mui/material';
import { BorderBox } from '../components/Commons/BorderBox';


const StoryBoxPage = () => {
    return (
    <>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%", padding: "0px 20px 20px 20px"}}>
            <Box sx={{ flexGrow: 1}}>
                <SubTopBar title={"스튜디오 STORY"} content='스튜디오의 스토리를 작성하고 새로운 플롯을 추가하세요'/>
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
