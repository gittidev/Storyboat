import React, { useState } from 'react';
import { Box } from '@mui/material';
import SubTopBar from "../components/Commons/SubTopBar";
import CustomButton from "../components/Commons/CustomButton";
import { BorderBox } from '../components/Commons/BorderBox';
import useModal from '../hooks/useModal';
import CustomModal from '../components/Commons/CustomModal';
import MyIdeaForm, { MyIdea } from '../components/MyIdea/MyIdeaForm';
import CustomCard from '../components/Commons/CustomCard'; // Assuming you want to display ideas in CustomCard

export interface MyIdeaBoxProps extends MyIdea {
id: number;
lastCollectedBy: string;
lastDateEdited: string;
}

// Dummy data
const initialIdeas: MyIdeaBoxProps[] = [
{
id: 1,
title: 'The Great Idea',
description: 'A thrilling journey through unknown concepts.',
lastCollectedBy: 'Alice',
lastDateEdited: '2023-07-20',
},
{
id: 2,
title: 'Mystery of the Lost Concept',
description: 'An intriguing tale of a lost idea.',
lastCollectedBy: 'Bob',
lastDateEdited: '2023-07-18',
},
{
id: 3,
title: 'Sci-Fi Extravaganza',
description: 'A futuristic story of space exploration ideas.',
lastCollectedBy: 'Charlie',
lastDateEdited: '2023-07-15',
},
];

const MyIdeaPage: React.FC = () => {
const { open, handleOpen, handleClose } = useModal();
const [myIdeas, setMyIdeas] = useState<MyIdeaBoxProps[]>(initialIdeas);

const handleSave = (newIdea: MyIdea) => {
const newIdeaWithId: MyIdeaBoxProps = {
    ...newIdea,
    id: myIdeas.length + 1,
    lastCollectedBy: 'Default Collector', // Replace with actual user logic if needed
    lastDateEdited: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
};
console.log('idea saved:', newIdeaWithId);
setMyIdeas((prevMyIdeas) => [...prevMyIdeas, newIdeaWithId]);
handleClose();
};

return (
<>
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "10px" }}>
    <Box sx={{ flexGrow: 1 }}>
        <SubTopBar title={'개인 아이디어 보관함'} content="나만의 아이디어를 작성하세요" />
    </Box>
    <Box sx={{ flexShrink: 0 }}>
        <CustomButton content='+ 생성하기' bgcolor="lightgreen" hoverBgColor="green" onClick={handleOpen} />
    </Box>
    </Box>
    
    {/* 모달 */}
    <CustomModal open={open} onClose={handleClose}>
    <MyIdeaForm onSave={handleSave} onClose={handleClose} />
    </CustomModal>

    {/* 내용 들어갈 부분 */}
    <BorderBox>
    {myIdeas.map((idea) => (
        <CustomCard key={idea.id} title={idea.title} content={idea.description}/>
    ))}
    </BorderBox>
</>
);
}

export default MyIdeaPage;
