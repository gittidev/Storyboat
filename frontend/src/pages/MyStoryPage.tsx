import React, { useEffect, useState } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Pagination, IconButton,
  Menu, MenuItem, Snackbar, Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; // 삭제 아이콘 추가
import ExportIcon from '@mui/icons-material/Send'; // 내보내기 아이콘 추가
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 추가
import SubTopBar from '../components/Commons/SubTopBar';
import CustomButton from '../components/Commons/CustomButton';
import CustomModal from '../components/Commons/CustomModal';
import useModal from '../hooks/useModal';
import MyStoryForm from '../components/Mystory/MyStoryForm';
import { BorderBox } from '../components/Commons/BorderBox';
import { StoryType } from '../types/StudioType';
import { useRecoilState, useRecoilValue } from 'recoil';
import { myStoryState } from '../recoil/atoms/studioAtom';
import { accessTokenState } from '../recoil/atoms/authAtom';
import { myStudioState } from '../recoil/atoms/studioAtom';
import axios from 'axios';
import api from '../apis/api';
import './Mycss/MyStoryPage.css'

const svURL = import.meta.env.VITE_SERVER_URL;

const MyStoryPage: React.FC = () => {
  const { open, handleOpen, handleClose } = useModal();
  const [mystory, setMystory] = useRecoilState<StoryType[]>(myStoryState);
  const accessToken = useRecoilValue(accessTokenState);
  const myStudioId = useRecoilValue(myStudioState);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [studioMenuAnchorEl, setStudioMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [studioList, setStudioList] = useState<any[]>([]);
  const [selectedStudioId, setSelectedStudioId] = useState<number | null>(null);
  const [selectedStoryId, setSelectedStoryId] = useState<number | null>(null); // 선택된 스토리 ID 상태 추가
  const navigate = useNavigate();
  console.log(selectedStudioId)
  console.log(myStudioId)

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await api.get(
          `/api/studios/${myStudioId}/stories`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
            params: {
              page: page,
              size: itemsPerPage
            }
          }
        );

        const storyList: StoryType[] = response.data.data.content.map((story: StoryType) => ({
          ...story,
          lastModified: story.lastModified ? story.lastModified.substring(0, 10) : '날짜 없음'
        }));

        if (response.data.data && Array.isArray(response.data.data.content)) {
          setMystory(storyList);
          setTotalPages(response.data.data.totalPages);
        } else {
          console.error('데이터가 배열이 아닙니다:', response.data.data);
          setMystory([]);
        }
      } catch (error) {
        console.error('스토리 전체 조회 실패', error);
      }
    };
    fetchStory();
  }, [myStudioId, setMystory, accessToken, page]);

  const handleFormSubmit = async (title: string) => {
    try {
      const response = await axios.post(
        `${svURL}/api/studios/${myStudioId}/stories`,
        { title },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },    
        }
      );
      const data = response.data.data
      // const updatedData = {
      //   ...data,
      //   lastModified: data.lastModified.slice(0, 10) // lastModified의 앞 10글자만 저장
      // };
    
      setMystory([...mystory, data]);
      console.log(data)
    } catch (error) {
      console.error('Failed to update idea:', error);
    } finally {
      handleClose();
    }
  };

  const handleDelete = async (storyId: number) => {
    try {
      await axios.delete(
        `${svURL}/api/studios/${myStudioId}/stories/${storyId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      setMystory(mystory.filter(story => story.storyId !== storyId));
    } catch (error) {
      console.error('Failed to delete story:', error);
    }
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value - 1);
  };

  const handleTitleClick = (storyId: number) => {
    navigate(`/storyboat/mystory/${storyId}`);
  };

  const handleExportClick = (storyId: number) => {
    setSelectedStoryId(storyId);
    // 스튜디오 목록을 가져옵니다.
    axios.get(
      `${svURL}/api/studios`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    )
    .then(response => {
      setStudioList(response.data.data);
      setStudioMenuAnchorEl(document.querySelector(`[data-story-id="${storyId}"]`) as HTMLElement); // 버튼을 클릭한 요소를 anchor로 설정
    })
    .catch(error => {
      console.error('Failed to fetch studios:', error);
    });
  };

  const handleStudioSelect = async (studioId: number) => {
    setSelectedStudioId(studioId);
    if (selectedStoryId !== null) {
      try {
        await axios.post(
          `${svURL}/api/studios/${myStudioId}/stories/${selectedStoryId}/upload/${studioId}`,
          {},
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );
        setSnackbarMessage('내보내기 성공');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Failed to export story:', error);
        setSnackbarMessage('내보내기 실패');
        setSnackbarOpen(true);
      }
    }
    setStudioMenuAnchorEl(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>

    <div className='mystorystoreclass'>
      {/* 상단 영역 */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%", padding: "0px 20px 20px 20px" }}>
        <Box sx={{ flexGrow: 1 }}>
          <SubTopBar title={'개인 스토리 보관함'} content='새로운 스토리를 작성하고 플롯을 추가하세요' />
        </Box>
        <Box sx={{ flexShrink: 0 }}>
          <CustomButton content={'+ 생성하기'} bgcolor="#77E4C8" hoverBgColor="#4C3BCF" onClick={handleOpen} />
        </Box>
      </Box>

      {/* 모달 영역 */}
      <CustomModal open={open} onClose={handleClose}>
        <MyStoryForm
          onClose={handleClose}
          onSubmit={handleFormSubmit}
        />
      </CustomModal>








      <Box
    className='MystoryPage_body'
    sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '70vh', 
      padding: '1rem',
    }}
  >
    {/* 테이블 영역 */}
    <BorderBox
      sx={{
        flex: 1,
        minHeight: '70vh', 
      }}
    >
      <TableContainer 
        component={Paper}
        sx={{
          boxShadow: 'none', 
        }}
        >
        <Table>
          <TableHead>
            <TableRow sx={{ padding: '4px' }}>
              <TableCell align="center" sx={{ padding: '12px' }}>번호</TableCell> {/* 인덱스 표시 */}
              <TableCell align="center" sx={{ padding: '12px' }}>스토리 제목</TableCell>
              <TableCell align="center" sx={{ padding: '12px' }}>최종 수정일</TableCell>
              <TableCell align="center" sx={{ padding: '12px' }}>작업</TableCell> {/* 삭제 및 내보내기 버튼 추가 */}
            </TableRow>
          </TableHead>


          <TableBody>
              {mystory.map((story, index) => (
                <TableRow key={story.storyId} sx={{ height: '40px' }}> {/* 행의 높이 조정 */}
                  <TableCell 
                    align="center" 
                    sx={{ padding: '4px' }} // 패딩을 줄여서 셀 간의 높이 간격 줄이기
                  >
                    {page * itemsPerPage + index + 1}
                  </TableCell>
                  <TableCell
                    align="center"
                    onClick={() => handleTitleClick(story.storyId)}
                    sx={{ 
                      cursor: 'pointer', 
                      color: 'black',  
                      padding: '4px' // 패딩을 줄여서 셀 간의 높이 간격 줄이기
                    }}
                  >
                    {story.title}
                  </TableCell>
                  <TableCell 
                    align="center" 
                    sx={{ padding: '4px' }} // 패딩을 줄여서 셀 간의 높이 간격 줄이기
                  >
                    {story.lastModified}
                  </TableCell>
                  <TableCell sx={{ padding: '4px' }}> {/* 패딩을 줄여서 셀 간의 높이 간격 줄이기 */}
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                      <IconButton onClick={() => handleDelete(story.storyId)}>
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleExportClick(story.storyId)}
                        data-story-id={story.storyId}
                      >
                        <ExportIcon />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>




        </Table>
      </TableContainer>
      
    </BorderBox>

    {/* 페이지네이션 */}
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginTop: 'auto', 
        padding: '1rem',
        color: 'rgb(173, 216, 230)',
      }}
    >
      <Pagination
        count={totalPages}
        page={page + 1}
        onChange={handlePageChange}
        sx={{
          '& .MuiPaginationItem-root': {
            color: 'rgb(173, 216, 230) !important', // 페이지네이션 아이템의 텍스트 색상 설정
          },
          '& .Mui-selected': {
            backgroundColor: 'rgb(173, 216, 230) !important', // 선택된 페이지네이션 아이템의 배경 색상 설정
            color: 'white !important' , // 선택된 페이지네이션 아이템의 텍스트 색상 설정
          },
          '& .MuiPaginationItem-ellipsis': {
            color: 'rgb(173, 216, 230) !important', // '...' 아이템의 텍스트 색상 설정
          },
        }}
      />
    </Box>
  </Box>







      {/* 스튜디오 선택 메뉴 */}
      <Menu
        anchorEl={studioMenuAnchorEl}
        open={Boolean(studioMenuAnchorEl)}
        onClose={() => setStudioMenuAnchorEl(null)}
      >
        {studioList.map(studio => (
          <MenuItem key={studio.studioId} onClick={() => handleStudioSelect(studio.studioId)}>
            {studio.name}
          </MenuItem>
        ))}
      </Menu>

      {/* 스낵바 */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarMessage === '내보내기 성공' ? 'success' : 'error'}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      </div>
    </>
  );
};

export default MyStoryPage;
