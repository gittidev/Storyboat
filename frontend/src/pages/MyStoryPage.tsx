import React from 'react';
import { Box } from '@mui/material';
import SubTopBar from "../components/SubTopBar";
import CustomButton from "../components/CustomButton";

const MyStoryPage = () => {
return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "10px" }}>
        <Box sx={{ flexGrow: 1}}>
        <SubTopBar title={'내 Story 보관함'} content='새로운 스토리를 작성하고 플롯을 추가하세요' />
        </Box>
        <Box sx={{ flexShrink: 0 }}>
        <CustomButton content={'+ 생성하기'} />
        </Box>
    </Box>
);
}

export default MyStoryPage;
