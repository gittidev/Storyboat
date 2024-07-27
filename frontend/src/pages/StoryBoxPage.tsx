import { styled } from '@mui/system';
import CustomButton from '../components/CustomButton';
import SubTopBar from '../components/SubTopBar';


const StoryBoxPage = () => {
    return (
    <>
    <SubTopBar title={'StoryBox'} content='스튜디오의 스토리를 작성하고 새로운 플롯을 추가하세요'/>
    <CustomButton content='+ 생성하기' bgcolor="lightgreen" hoverBgColor="green"/>
    </>
    );
};

export default StoryBoxPage;
