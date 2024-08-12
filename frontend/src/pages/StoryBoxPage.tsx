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
        navigate(`/storyboat/mystory/${storyId}`);
    };


    return (
        <>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%", padding: "0px 20px 20px 20px" }}>
                <Box sx={{ flexGrow: 1 }}>
                    <SubTopBar title={"스튜디오 STORY"} content='스튜디오의 스토리를 작성하고 새로운 플롯을 추가하세요' />
                </Box>
                <Box sx={{ flexShrink: 0 }}>
                    <CustomButton content='+ 생성하기' bgcolor="lightgreen" hoverBgColor="green" onClick={handleOpen} />
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
            <BorderBox>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">번호</TableCell> {/* 인덱스 표시 */}
                                <TableCell align="center">스토리 제목</TableCell>
                                <TableCell align="center">최종 수정일</TableCell>
                                <TableCell align="center">작업</TableCell> {/* 삭제 및 내보내기 버튼 추가 */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {story.map((story, index) => (
                                <TableRow key={story.storyId}>
                                    <TableCell>{page * itemsPerPage + index + 1}</TableCell> {/* 인덱스를 1부터 시작 */}
                                    <TableCell
                                        onClick={() => handleTitleClick(story.storyId)}
                                        sx={{ cursor: 'pointer', color: 'black' }} // 클릭 커서와 글씨 색상 설정
                                    >
                                        {story.title}
                                    </TableCell>
                                    <TableCell>{story.lastModified}</TableCell>
                                    <TableCell>
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
                <Pagination
                    count={totalPages}
                    page={page + 1}
                    onChange={handlePageChange}
                    color="primary"
                    sx={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
                />

            </BorderBox>

        </>
    );
};




export default StoryBoxPage;
