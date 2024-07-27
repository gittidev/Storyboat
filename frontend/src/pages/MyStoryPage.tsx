import { MyStoryBoxProps } from '../components/Mystory/MyStoryBox';
import { useState } from 'react';
import { Box } from '@mui/material';
import SubTopBar from "../components/SubTopBar";
import CustomButton from "../components/CustomButton";
import CustomModal from '../components/CustomModal'
import useModal from '../hooks/useModal';
import MyStoryForm from '../components/Mystory/MyStoryForm';



const MyStoryPage = () => {
    const { open, handleOpen, handleClose } = useModal();

    const [mystory, setMystory] = useState<MyStoryBoxProps[]>([]);
    
    const handleSave = (mystory: MyStoryBoxProps) => {
        console.log('mystory saved:', mystory);
        setMystory((prevMystories) => [...prevMystories, mystory]);
        handleClose();
    };



return (
    <>
    {/* 상단 영역 */}
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "10px" }}>
        <Box sx={{ flexGrow: 1}}>
        <SubTopBar title={'개인 스토리 보관함'} content='새로운 스토리를 작성하고 플롯을 추가하세요' />
        </Box>
        <Box sx={{ flexShrink: 0 }}>
        <CustomButton content={'+ 생성하기'} bgcolor="lightgreen" hoverBgColor="green" onClick={handleOpen}/>
        </Box>
    </Box>

    {/* 모달 영역 */}
    <CustomModal open={open} onClose={handleClose}>
    <MyStoryForm onSave={handleSave} onClose={handleClose} />
    </CustomModal>

    {/* 스토리 목록 영역 */}

    </>
);
}

export default MyStoryPage;
