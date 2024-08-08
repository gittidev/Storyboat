import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import SubTopBar from '../components/Commons/SubTopBar';
import CustomButton from '../components/Commons/CustomButton';
import CustomModal from '../components/Commons/CustomModal';
import useModal from '../hooks/useModal';
import MyStoryForm from '../components/Mystory/MyStoryForm';
import { BorderBox } from '../components/Commons/BorderBox';
import CustomCard from '../components/Commons/CustomCard'; // Importing the CustomCard component
import { StoryType } from '../types/StudioType';
import { useRecoilState } from 'recoil';
import { myStoryState } from '../recoil/atoms/studioAtom';
import { Option } from '../components/Commons/LongMenu';
// import { useCallback } from 'react';
// import { IdeaType } from '../types/StudioType';
// import { ideaState } from '../recoil/atoms/studioAtom';

const MyStoryPage: React.FC = () => {
  const { open, handleOpen, handleClose } = useModal();
  const [mystory, setMystory] = useRecoilState(myStoryState);

  // const studioIdeas = useRecoilValue<IdeaType[]>(ideaState);
  // const [studioIdeas, setStudioIdeas] = useRecoilState<IdeaType[]>(ideaState);


  const handleSave = (newStory: StoryType) => {
    const newStoryWithId: StoryType = {
      ...newStory,
      storyid: mystory.length + 1,
    };
    console.log('내 스토리 저장완료:', newStoryWithId);
    setMystory((prevMystories) => [...prevMystories, newStoryWithId]);
    handleClose();
  };

  const generateMenuOptions = (): Option[] => [
    {
      label: '수정',
      value: 'put',
    },
    {
      label: '삭제',
      value: 'delete',
    },
  ];

  // const handleMenuClick = useCallback(async (ideaId: number) => {
  //   // const accessToken = useRecoilValue(accessTokenState)
  //     const ideaToEdit = studioIdeas.find((idea) => idea.ideaId === ideaId);
  //     if (ideaToEdit) {
  //       handleOpen();
  //     }
  // }, [handleOpen, studioIdeas]);

  return (
    <>
      {/* 상단 영역 */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%", padding: "0px 20px 20px 20px" }}>
        <Box sx={{ flexGrow: 1 }}>
          <SubTopBar title={'개인 스토리 보관함'} content='새로운 스토리를 작성하고 플롯을 추가하세요' />
        </Box>
        <Box sx={{ flexShrink: 0 }}>
          <CustomButton content={'+ 생성하기'} bgcolor="lightgreen" hoverBgColor="green" onClick={handleOpen} />
        </Box>
      </Box>

      {/* 모달 영역 */}
      <CustomModal open={open} onClose={handleClose}>
        <MyStoryForm
          onSave={handleSave}
          onClose={handleClose}
          nextstoryid={mystory.length + 1} // 추가된 부분
        />
      </CustomModal>

      {/* 내용 들어갈 부분 */}
      <BorderBox>
        <Grid container spacing={2} padding={1}>
          {mystory.length > 0 ? (
            mystory.map((story) => (
              <Grid item xs={12} sm={6} md={3} key={story.storyid}>
                  <CustomCard
                    title={story.title}
                    width='100%'
                    storyid={story.storyid}
                    menuOptions={generateMenuOptions()}
                    // onMenuClick={handleMenuClick}
                  />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="h6" align="center" color="textSecondary">
                아직 생성된 스토리가 없습니다. 새 스토리를 작성해보세요!
              </Typography>
            </Grid>
          )}
        </Grid>
      </BorderBox>
    </>
  );
};

export default MyStoryPage;
