import React, { useEffect, useState } from 'react';
import {
    Box, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Pagination, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; // 삭제 아이콘 추가
// import ExportIcon from '@mui/icons-material/Send'; // 내보내기 아이콘 추가
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 추가
import SubTopBar from '../components/Commons/SubTopBar';
import CustomButton from '../components/Commons/CustomButton';
import CustomModal from '../components/Commons/CustomModal';
import useModal from '../hooks/useModal';
import { BorderBox } from '../components/Commons/BorderBox';
import { StoryType } from '../types/StudioType';
import { useRecoilState, useRecoilValue } from 'recoil';
import { storyState } from '../recoil/atoms/studioAtom';
import { accessTokenState } from '../recoil/atoms/authAtom';
import { selectedStudioState } from '../recoil/atoms/studioAtom';
import StoryForm from '../components/StroyForm';
import axios from 'axios';
const svURL = import.meta.env.VITE_SERVER_URL;

const StoryBoxPage = () => {
    const { open, handleOpen, handleClose } = useModal();
    const [story, setStory] = useRecoilState<StoryType[]>(storyState);
    const accessToken = useRecoilValue(accessTokenState);
    const studioId = useRecoilValue(selectedStudioState);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;
    const navigate = useNavigate();
    useEffect(() => {
        const fetchStory = async () => {
            try {
                const response = await axios.get(
                    `${svURL}/api/studios/${studioId}/stories`,
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
                    setStory(storyList);
                    setTotalPages(response.data.data.totalPages);
                } else {
                    console.error('데이터가 배열이 아닙니다:', response.data.data);
                    setStory([]);
                }
            } catch (error) {
                console.error('스토리 전체 조회 실패', error);
            }
        };
        fetchStory();
    }, [studioId, setStory, accessToken, page]);

    const handleFormSubmit = async (title: string) => {
        try {
            const response = await axios.post(
                `${svURL}/api/studios/${studioId}/stories`,
                { title },
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                }
            );
            setStory([...story, response.data.data]);
        } catch (error) {
            console.error('Failed to update idea:', error);
        } finally {
            handleClose();
        }
    };

    const handleDelete = async (storyId: number) => {
        try {
            await axios.delete(
                `${svURL}/api/studios/${studioId}/stories/${storyId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                }
            );
            setStory(story.filter(story => story.storyId !== storyId));
        } catch (error) {
            console.error('Failed to delete story:', error);
        }
    };

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value - 1);
    };

    const handleTitleClick = (storyId: number) => {
        navigate(`/storyboat/storybox/${storyId}`);
    };


    return (
        <>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%", padding: "0px 20px 20px 20px" }}>
                <Box sx={{ flexGrow: 1 }}>
                    <SubTopBar title={"스튜디오 STORY"} content='스튜디오의 스토리를 작성하고 새로운 플롯을 추가하세요' />
                </Box>
                <Box sx={{ flexShrink: 0 }}>
                    <CustomButton content='+ 생성하기' bgcolor="#77E4C8" hoverBgColor="#4C3BCF" onClick={handleOpen} />
                </Box>
            </Box>
            {/* 모달 영역 */}
            <CustomModal open={open} onClose={handleClose}>
                <StoryForm
                    onClose={handleClose}
                    onSubmit={handleFormSubmit}
                />
            </CustomModal>

            {/* 내용 들어갈 부분 */}
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
                            {story.map((story, index) => (
                                <TableRow key={story.storyId} sx={{ height: '40px' }}>
                                    <TableCell align="center" sx={{ padding: '4px' }}>{page * itemsPerPage + index + 1}</TableCell> {/* 인덱스를 1부터 시작 */}
                                    <TableCell
                                        align="center"
                                        onClick={() => handleTitleClick(story.storyId)}
                                        sx={{ cursor: 'pointer', color: 'black', padding: '4px' }} // 클릭 커서와 글씨 색상 설정
                                    >
                                        {story.title}
                                    </TableCell >
                                    <TableCell align="center"  sx={{ padding: '4px' }} > {story.lastModified}</TableCell>
                                    <TableCell align="center"  sx={{ padding: '4px' }} >
                                        <IconButton onClick={() => handleDelete(story.storyId)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* 페이지네이션 */}

                <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center', // 가로 중앙 정렬
                    alignItems: 'center', // 세로 중앙 정렬
                    position: 'fixed', // 고정 위치
                    bottom: '20px', // 바닥에서의 거리
                    left: '60%', // 왼쪽에서 중앙으로 위치 조정
                    transform: 'translateX(-50%)', // X축 중앙 정렬
                    width: '100%', // 전체 너비
                }}
                >
                <Pagination
                    count={totalPages}
                    page={page + 1}
                    onChange={handlePageChange}
                    // color="primary"
                    sx={{ 
                        
                    marginTop: "20px", 
                    display: "flex", 
                    justifyContent: "center", 
                    color: 'rgb(173, 216, 230)' ,
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
            </BorderBox>

        </>
    );
};




export default StoryBoxPage;
