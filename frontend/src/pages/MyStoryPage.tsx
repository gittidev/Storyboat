import React, { useState } from 'react';
import { Box } from '@mui/material';
import SubTopBar from '../components/SubTopBar';
import CustomButton from '../components/CustomButton';
import CustomModal from '../components/CustomModal';
import useModal from '../hooks/useModal';
import MyStoryForm, { MyStory } from '../components/Mystory/MyStoryForm';
import { BorderBox } from '../components/BorderBox';
import CustomCard from '../components/CustomCard'; // Importing the CustomCard component

export interface MyStoryBoxProps extends MyStory {
  story_id: number;
  lastCollectedBy: string;
  lastDateEdited: string;
}

// Dummy data
const initialStories: MyStoryBoxProps[] = [
  {
    story_id: 1,
    title: 'The Great Adventure',
    description: 'A thrilling journey through unknown lands.',
    lastCollectedBy: 'Alice',
    lastDateEdited: '2023-07-20',
  },
  {
    story_id: 2,
    title: 'Mystery of the Lost City',
    description: 'An intriguing tale of a lost civilization.',
    lastCollectedBy: 'Bob',
    lastDateEdited: '2023-07-18',
  },
  {
    story_id: 3,
    title: 'Sci-Fi Extravaganza',
    description: 'A futuristic story of space exploration.',
    lastCollectedBy: 'Charlie',
    lastDateEdited: '2023-07-15',
  },
  {
    story_id: 4,
    title: 'Sci-Fi Extravaganza',
    description: 'A futuristic story of space exploration.',
    lastCollectedBy: 'Charlie',
    lastDateEdited: '2023-07-15',
  },
];

const MyStoryPage: React.FC = () => {
  const { open, handleOpen, handleClose } = useModal();
  const [mystory, setMystory] = useState<MyStoryBoxProps[]>(initialStories);

  const handleSave = (newStory: MyStory) => {
    const newStoryWithId: MyStoryBoxProps = {
      ...newStory,
      story_id: mystory.length + 1,
      lastCollectedBy: 'Default Collector', // Replace with actual user logic if needed
      lastDateEdited: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
    };
    console.log('mystory saved:', newStoryWithId);
    setMystory((prevMystories) => [...prevMystories, newStoryWithId]);
    handleClose();
  };

  return (
    <>
      {/* 상단 영역 */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "10px" }}>
        <Box sx={{ flexGrow: 1 }}>
          <SubTopBar title={'개인 스토리 보관함'} content='새로운 스토리를 작성하고 플롯을 추가하세요' />
        </Box>
        <Box sx={{ flexShrink: 0 }}>
          <CustomButton content={'+ 생성하기'} bgcolor="lightgreen" hoverBgColor="green" onClick={handleOpen} />
        </Box>
      </Box>

      {/* 모달 영역 */}
      <CustomModal open={open} onClose={handleClose}>
        <MyStoryForm onSave={handleSave} onClose={handleClose} />
      </CustomModal>

      {/* 내용 들어갈 부분 */}
      <BorderBox>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {mystory.map((story) => (
            <CustomCard
              key={story.story_id}
              title={story.title}
              content={story.description}
              lastCollectedBy={story.lastCollectedBy}
              lastDateEdited={story.lastDateEdited}
            />
          ))}
        </Box>
      </BorderBox>
    </>
  );
};

export default MyStoryPage;
