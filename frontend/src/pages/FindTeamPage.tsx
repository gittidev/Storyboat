import React, { useEffect, useState } from "react"
import { SearchBar } from "../components/Commons/SearchBar"
import { FindteamBox } from "../components/FindTeam/FindTeamBox"
import CustomButton from "../components/Commons/CustomButton"
import SubTopBar from "../components/Commons/SubTopBar"
import { BorderBox } from "../components/Commons/BorderBox"
import { Box, Pagination, Chip } from "@mui/material"
import useModal from "../hooks/useModal"
import CustomModal from '../components/Commons/CustomModal'
import { FindteamBoxProps } from "../components/FindTeam/FindTeamBox"
import FindTeamForm from "../components/FindTeam/FindTeamForm"
import { useRecoilValue, useRecoilState } from "recoil"
import { findTeamState, selectedStudioState } from "../recoil/atoms/studioAtom"
import { FindTeamType } from "../types/StudioType"
import { accessTokenState } from "../recoil/atoms/authAtom"
// import { fetchRefreshToken } from "../apis/auth"
import axios from "axios"

const svURL = import.meta.env.VITE_SERVER_URL;

const FindTeamPage: React.FC = () => {
    const { open, handleOpen, handleClose } = useModal();
    const [findTeams, setFindTeams] = useRecoilState<FindTeamType[]>(findTeamState);
    const studioId = useRecoilValue(selectedStudioState);
    const accessToken = useRecoilValue(accessTokenState);
    const [page, setPage] = useState(0); // 페이지를 0부터 시작하도록 수정
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 4; // 페이지 당 항목 수 설정

    useEffect(() => {
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
                    setFindTeams([]);
                }
            } catch (error) {
                console.error('팀 찾기 데이터를 가져오지 못했습니다:', error);
            }
        };

        fetchFindTeams();
    }, [studioId, setFindTeams, accessToken, page]);

    const handleSave = (findTeam: FindteamBoxProps) => {
        console.log('팀 저장됨:', findTeam);
        // setFindTeams((prevfindTeams) => [...prevfindTeams, findTeam]);
        handleClose();
    };

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value - 1); // MUI Pagination은 1부터 시작하므로 0 기반 인덱스로 변환
    };

    return (
        <>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%", padding: "0px 20px 20px 20px" }}>
                <Box sx={{ flexGrow: 1 }}>
                    <SubTopBar title='항해하기' content="현재 팀원을 모집중인 스튜디오를 찾아보세요." />
                </Box>
                <Box sx={{ flexShrink: 0 }}>
                    <CustomButton content='+ 팀원 모집하기' bgcolor="lightgreen" hoverBgColor="green" onClick={handleOpen} />
                </Box>
            </Box>

            <CustomModal open={open} onClose={handleClose}>
                <FindTeamForm onSave={handleSave} onClose={handleClose} />
            </CustomModal>

            {/* 화면에 들어갈 내역 */}
            <BorderBox>
                <SearchBar />
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "10px" }}>
                    {findTeams.map((findTeam, index) => (
                        <Box 
                            key={index}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                justifyContent: "center",
                                width: "90%",
                                padding: "20px",
                                marginBottom: "20px",
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                            }}
                        >
                            <FindteamBox
                                title={findTeam.title}
                                description={findTeam.description}
                                studioId={findTeam.studioId}
                            />
                            <Box sx={{ display: "flex", flexWrap: "wrap", marginTop: "10px" }}>
                                {findTeam.tags.map((tag, tagIndex) => (
                                    <Chip 
                                        key={tagIndex} 
                                        label={tag.name} 
                                        sx={{ 
                                            backgroundColor: tag.color,
                                            color: "white", 
                                            marginRight: "8px", 
                                            marginBottom: "8px" 
                                        }} 
                                    />
                                ))}
                            </Box>
                        </Box>
                    ))}
                    <Pagination 
                        count={totalPages} 
                        page={page + 1} // 0 기반 인덱스를 1 기반 인덱스로 변환하여 MUI Pagination에 전달
                        onChange={handlePageChange} 
                        color="primary"
                        sx={{ marginTop: "20px" }}
                    />
                </Box>
            </BorderBox>
        </>
    )
}

export default FindTeamPage
