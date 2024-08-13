import React, { useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Grid } from '@mui/material';
import { useRecoilState, useRecoilValue } from 'recoil';
import CustomButton from '../components/Commons/CustomButton';
import SubTopBar from '../components/Commons/SubTopBar';
import useModal from '../hooks/useModal';
import { BorderBox } from '../components/Commons/BorderBox';
import { selectedStudioState, ideaState, editIdeaState } from '../recoil/atoms/studioAtom';
import StudioIdeaForm from '../components/StudioIdea/StudioIdeaForm';
import CustomCard from '../components/Commons/CustomCard';
import CustomModal from '../components/Commons/CustomModal';
import { IdeaType } from '../types/StudioType';
import { Option } from '../components/Commons/LongMenu';
import { accessTokenState } from '../recoil/atoms/authAtom';
const svURL = import.meta.env.VITE_SERVER_URL;

const IdeaBoxPage: React.FC = () => {
  const { open, handleOpen, handleClose } = useModal();
  const [studioIdeas, setStudioIdeas] = useRecoilState<IdeaType[]>(ideaState);
  const [editIdea, setEditIdea] = useRecoilState(editIdeaState);
  const selectedStudioId = useRecoilValue(selectedStudioState);
  const accessToken = useRecoilValue(accessTokenState);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const response = await axios.get<{ data: IdeaType[] }>(
          `${svURL}/api/studios/${selectedStudioId}/ideas`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );
        setStudioIdeas(response.data.data);
      } catch (error) {
        console.error('Failed to fetch ideas:', error);
      }
    };

    fetchIdeas();
  }, [selectedStudioId, setStudioIdeas, accessToken]);

  const handleMenuClick = async (action: string, ideaId: number) => {
    if (action === 'put') {
      const ideaToEdit = studioIdeas.find((idea) => idea.ideaId === ideaId);
      if (ideaToEdit) {
        setEditIdea(ideaToEdit);
        handleOpen();
      }
    } else if (action === 'delete') {
      try {
        await axios.delete(
          `${svURL}/api/studios/${selectedStudioId}/ideas/${ideaId}`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );
        setStudioIdeas(studioIdeas.filter((idea) => idea.ideaId !== ideaId));
      } catch (error) {
        console.error('Failed to delete idea:', error);
      }
    }
  };


  const handleFormSubmit = async (title: string, content: string) => {
    if (editIdea) {
      try {
        const response = await axios.put<{ data: IdeaType }>(
          `${svURL}/api/studios/${selectedStudioId}/ideas/${editIdea.ideaId}`,
          { title, content },
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );
        setStudioIdeas(studioIdeas.map((idea) => (idea.ideaId === editIdea.ideaId ? response.data.data : idea)));
      } catch (error) {
        console.error('Failed to update idea:', error);
      } finally {
        setEditIdea(null);
        handleClose();
      }
    } else {
      // Create new idea logic if necessary
    }
  };

  const handleCreateIdea = async (title: string, content: string) => {
    try {
      const response = await axios.post<{ data: IdeaType }>(
        `${svURL}/api/studios/${selectedStudioId}/ideas`,
        { title, content },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      setStudioIdeas([...studioIdeas, response.data.data]);
    } catch (error) {
      console.error('Failed to create idea:', error);
    } finally {
      handleClose();
    }
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

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%", padding: "0px 20px 20px 20px" }}>
        <Box sx={{ flexGrow: 1 }}>
          <SubTopBar title={"스튜디오 아이디어 보관소"} content="스튜디오의 아이디어를 작성하세요" />
        </Box>
        <Box sx={{ flexShrink: 0 }}>
          <CustomButton content='+ 생성하기' bgcolor="lightgreen" hoverBgColor="green" onClick={handleOpen} />
        </Box>
      </Box>

      <CustomModal open={open} onClose={handleClose}>
        <StudioIdeaForm onClose={handleClose} onSubmit={editIdea ? handleFormSubmit : handleCreateIdea} />
      </CustomModal>

      <BorderBox>
        {studioIdeas.length === 0 ? (
          <Typography variant="body1">아이디어가 없습니다. 새 아이디어를 추가해보세요!</Typography>
        ) : (
          <Grid container spacing={2}>
            {studioIdeas.map((idea) => (
              <Grid item xs={12} sm={6} key={idea.ideaId}>
                <CustomCard
                  ideaId={idea.ideaId}
                  title={idea.title}
                  content={idea.content}
                  menuOptions={generateMenuOptions()}
                  onMenuClick={handleMenuClick} // 수정된 핸들러 사용
                  width="90%"
                />
              </Grid>
            ))}
          </Grid>
        )}
      </BorderBox>
    </>
  );
};

export default IdeaBoxPage;
