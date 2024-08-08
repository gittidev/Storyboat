import React, { useEffect } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import SubTopBar from "../components/Commons/SubTopBar";
import CustomButton from "../components/Commons/CustomButton";
import { BorderBox } from '../components/Commons/BorderBox';
import useModal from '../hooks/useModal';
import CustomModal from '../components/Commons/CustomModal';
import IdeaForm from '../components/MyIdea/MyIdeaForm';
import CustomCard from '../components/Commons/CustomCard';
import { myIdeaState, editIdeaState, myStudioState } from '../recoil/atoms/studioAtom';
import { useRecoilValue, useRecoilState } from 'recoil';
import { IdeaType } from '../types/StudioType';
import { accessTokenState } from '../recoil/atoms/authAtom';
import axios from 'axios';
import { Option } from '../components/Commons/LongMenu';

const svURL = import.meta.env.VITE_SERVER_URL;

const MyIdeaPage: React.FC = () => {
  const { open, handleOpen, handleClose } = useModal();
  const [myIdeas, setMyIdeas] = useRecoilState<IdeaType[]>(myIdeaState);
  const [editIdea, setEditIdea] = useRecoilState(editIdeaState);
  const accessToken = useRecoilValue(accessTokenState);
  const myStudioId = useRecoilValue(myStudioState);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const response = await axios.get<{ data: IdeaType[] }>(
          `${svURL}/api/studios/${myStudioId}/ideas`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );
        setMyIdeas(response.data.data);
      } catch (error) {
        console.error('Failed to fetch ideas:', error);
      }
    };

    fetchIdeas();
  }, [myStudioId, setMyIdeas, accessToken]);

  const handleMenuClick = async (action: string, ideaId: number) => {
    if (action === 'put') {
      const ideaToEdit = myIdeas.find((idea) => idea.ideaId === ideaId);
      if (ideaToEdit) {
        setEditIdea(ideaToEdit);
        handleOpen();
      }
    } else if (action === 'delete') {
      try {
        await axios.delete(
          `${svURL}/api/studios/${myStudioId}/ideas/${ideaId}`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );
        setMyIdeas(myIdeas.filter((idea) => idea.ideaId !== ideaId));
      } catch (error) {
        console.error('Failed to delete idea:', error);
      }
    }
  };

  const handleFormSubmit = async (title: string, content: string) => {
    if (editIdea) {
      try {
        const response = await axios.put<{ data: IdeaType }>(
          `${svURL}/api/studios/${myStudioId}/ideas/${editIdea.ideaId}`,
          { title, content },
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );
        setMyIdeas(myIdeas.map((idea) => (idea.ideaId === editIdea.ideaId ? response.data.data : idea)));
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
        `${svURL}/api/studios/${myStudioId}/ideas`,
        { title, content },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      setMyIdeas([...myIdeas, response.data.data]);
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
          <SubTopBar title={'개인 아이디어 보관함'} content="나만의 아이디어를 작성하세요" />
        </Box>
        <Box sx={{ flexShrink: 0 }}>
          <CustomButton content='+ 생성하기' bgcolor="lightgreen" hoverBgColor="green" onClick={handleOpen} />
        </Box>
      </Box>
      
      {/* 모달 */}
      <CustomModal open={open} onClose={handleClose}>
        <IdeaForm onClose={handleClose} onSubmit={editIdea ? handleFormSubmit : handleCreateIdea} />
      </CustomModal>

      {/* 내용 들어갈 부분 */}
      <BorderBox>
        {myIdeas.length === 0 ? (
          <Typography variant="body1">아이디어가 없습니다. 새 아이디어를 추가해보세요!</Typography>
        ) : (
          <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
            {myIdeas.map((idea) => (
              <Grid item xs={12} sm={6} md={4} key={idea.ideaId}>
                <CustomCard 
                  ideaId={idea.ideaId} 
                  title={idea.title} 
                  content={idea.content} 
                  menuOptions={generateMenuOptions()} 
                  onMenuClick={handleMenuClick} 
                />
              </Grid>
            ))}
          </Grid>
        )}
      </BorderBox>
    </>
  );
};

export default MyIdeaPage;
