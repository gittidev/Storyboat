import React, { useEffect, useState } from "react";
import { SearchBar } from "../components/Commons/SearchBar";
import { FindteamBox } from "../components/FindTeam/FindTeamBox";
import CustomButton from "../components/Commons/CustomButton";
import SubTopBar from "../components/Commons/SubTopBar";
import { BorderBox } from "../components/Commons/BorderBox";
import { Box, Pagination } from "@mui/material";
import useModal from "../hooks/useModal";
import CustomModal from '../components/Commons/CustomModal';
import { FindteamBoxProps } from "../components/FindTeam/FindTeamBox";
import FindTeamForm from "../components/FindTeam/FindTeamForm";
import { useRecoilValue, useRecoilState } from "recoil";
import { findTeamState, selectedStudioState } from "../recoil/atoms/studioAtom";
import { FindTeamType } from "../types/StudioType";
import { accessTokenState } from "../recoil/atoms/authAtom";
import axios from "axios";


const svURL = import.meta.env.VITE_SERVER_URL;

const FindTeamPage: React.FC = () => {
    const { open, handleOpen, handleClose } = useModal();
    const [findTeams, setFindTeams] = useRecoilState<FindTeamType[]>(findTeamState || []);
    const studioId = useRecoilValue(selectedStudioState);
    const accessToken = useRecoilValue(accessTokenState);
    const [page, setPage] = useState(0); // 페이지를 0부터 시작하도록 수정
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 6; // 페이지 당 항목 수 설정

    const fetchFindTeams = async () => {
        try {
            const response = await axios.get(`${svURL}/api/invitations`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                params: {
                    page: page, // API 요청에 페이지 번호 전달
                    size: itemsPerPage
                }
            });

            console.log(response.data); // 응답 데이터 구조 확인을 위해 콘솔에 출력

            if (response.data.data && Array.isArray(response.data.data.content)) {
                setFindTeams(response.data.data.content);
                setTotalPages(response.data.data.totalPages);
            } else {
                console.error('데이터가 배열이 아닙니다:', response.data.data);
                setFindTeams([]);  // 예상치 못한 데이터가 올 경우 빈 배열로 설정
            }
        } catch (error) {
            console.error('팀 찾기 데이터를 가져오지 못했습니다:', error);
            setFindTeams([]);  // 에러가 발생한 경우 빈 배열로 설정
        }
    };
    useEffect(() => {

        fetchFindTeams();
    }, [studioId, setFindTeams, accessToken, page]);

    const handleSave = (findTeam: FindteamBoxProps) => {
        console.log('팀 저장됨:', findTeam);
        fetchFindTeams()
        handleClose();
    };

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value - 1); // MUI Pagination은 1부터 시작하므로 0 기반 인덱스로 변환
    };

    const handleSearch = async (category: string, keyword: string) => {
        try {
            const response = await axios.get(`${svURL}/api/invitations/search`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                params: {
                    category,
                    keyword,
                    page: page,
                    size: itemsPerPage
                }
            });

            if (response.data.data && Array.isArray(response.data.data.content)) {
                setFindTeams(response.data.data.content);
                setTotalPages(response.data.data.totalPages);
            } else {
                console.error('데이터가 배열이 아닙니다:', response.data.data);
                setFindTeams([]);  // 예상치 못한 데이터가 올 경우 빈 배열로 설정
            }
        } catch (error) {
            console.error('검색 실패:', error);
            setFindTeams([]);  // 에러가 발생한 경우 빈 배열로 설정
        }
    };

    return (
        <>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%", padding: "0px 20px 20px 20px" }}>
                <Box sx={{ flexGrow: 1 }}>
                    <SubTopBar title='항해하기' content="현재 팀원을 모집중인 스튜디오를 찾아보세요." />
                </Box>
                <Box sx={{ flexShrink: 0 }}>
                    <CustomButton content='+ 팀원 모집하기' bgcolor="#77E4C8" hoverBgColor="#4C3BCF" onClick={handleOpen} />
                </Box>
            </Box>
    
            <CustomModal open={open} onClose={handleClose}>
                <FindTeamForm onSave={handleSave} onClose={handleClose} />
            </CustomModal>

            {/* 화면에 들어갈 내역 */}
            <BorderBox>
                {/* SearchBar를 중앙에 배치 */}
                <Box sx={{ paddingTop: "20px", display: "flex", justifyContent: "center" }}>
                    <SearchBar onSearch={handleSearch} />
                </Box>
                
<Box
    sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)', // 2열로 설정
        gap: '16px', // 카드 간의 간격 설정 (픽셀 단위로 조정 가능)
        padding: '0 5%', // padding 설정
        height: 'auto', // 높이를 자동으로 설정
        overflowY: 'auto', // 콘텐츠가 넘칠 경우 스크롤 가능
    }}
>
    {Array.isArray(findTeams) && findTeams.length > 0 ? (
        findTeams.map((findTeam, index) => (
            <Box
                key={index}
                sx={{
                    borderRadius: '4px',
                    
                    backgroundColor: 'white', // 카드 배경 색상
                }}
            >
                <FindteamBox
                    title={findTeam.title}
                    description={findTeam.description}
                    studioId={findTeam.studioId}
                    tags={findTeam.tags}
                />
            </Box>
        ))
    ) : (
        <p>팀을 만들어주세요 👨‍👨‍👧‍👦</p>
    )}
<Box
    sx={{
        display: 'flex',
        justifyContent: 'center', // 가로 중앙 정렬
        alignItems: 'center', // 세로 중앙 정렬
        position: 'fixed', // 고정 위치
        bottom: '50px', // 바닥에서의 거리
        left: '60%', // 왼쪽에서 중앙으로 위치 조정
        transform: 'translateX(-50%)', // X축 중앙 정렬
        width: '100%', // 전체 너비
    }}
>
    <Pagination 
        count={totalPages} 
        page={page + 1} 
        onChange={handlePageChange} 
        sx={{
            '& .MuiPaginationItem-root': {
                color: 'rgb(173, 216, 230) !important',
            },
            '& .Mui-selected': {
                backgroundColor: 'rgb(173, 216, 230) !important',
                color: 'white !important',
            },
            '& .MuiPaginationItem-ellipsis': {
                color: 'rgb(173, 216, 230) !important',
            },
        }}
    />
</Box>
</Box>




                
            </BorderBox>
        </>
    );
}

export default FindTeamPage;
