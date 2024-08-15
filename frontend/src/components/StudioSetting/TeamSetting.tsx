import Button from "../Commons/CustomButton"
import { Box, Modal, Typography, IconButton } from "@mui/material"
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import TeamTable from "./TeamTable";
import { useEffect, useState } from "react";
import axios from "axios";
import { fetchteams } from "../../utils/studioUtils";
import { teamState } from "../../recoil/atoms/studioAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import { selectedStudioState } from "../../recoil/atoms/studioAtom";
import { accessTokenState } from "../../recoil/atoms/authAtom";
import { updateInvitationStatus } from "../../utils/studioUtils";
import { updateRole } from "../../utils/studioUtils";
import '../FindTeam/TeamSetting.css'

const svURL = import.meta.env.VITE_SERVER_URL;

const TeamSetting = () => {
    const selectedStudioId = useRecoilValue(selectedStudioState);
    const accessToken = useRecoilValue(accessTokenState)
    const [teams, setTeams] = useRecoilState(teamState)
    const [invitationCode, setInvitationCode] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [role, setRole] = useState<string>(''); // 사용자 역할 상태
    const [isOwner, setIsOwner] = useState<boolean>(false); // 오너 여부 상태
    console.log(role)
    useEffect(() => {
        fetchteams(accessToken, selectedStudioId, setTeams)
        const fetchStudioDetails = async () => {
            try {
                const roleResponse = await axios.get(`${svURL}/api/studios/${selectedStudioId}/my`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                const userRole = roleResponse.data.data;
                setRole(userRole);
                setIsOwner(userRole === 'ROLE_OWNER');
            } catch (error) {
                console.error('스튜디오 정보를 불러오는 데 실패했습니다:', error);
            }
        };
        fetchStudioDetails();
    }, [selectedStudioId, setTeams, accessToken])

    // const studioId = useRecoilState(selectedStudioState)
    const handleMenuClick = async (index: number, value: string) => {
        const userId = teams[index].userId

        switch (value) {
            case 'accept':
                await updateInvitationStatus(accessToken, selectedStudioId, userId, 'accept');
                fetchteams(accessToken, selectedStudioId, setTeams)
                break;
            case 'reject':
                await updateInvitationStatus(accessToken, selectedStudioId, userId, 'rejection');
                fetchteams(accessToken, selectedStudioId, setTeams)
                break;
            case 'expel':
                await fetchteams(accessToken, selectedStudioId, setTeams)
                break;
            case 'editor':
                await updateRole(accessToken, selectedStudioId, userId, 'ROLE_VIEWER')
                fetchteams(accessToken, selectedStudioId, setTeams)
                console.log('권한 설정');
                break;
            case 'member':
                await updateRole(accessToken, selectedStudioId, userId, 'ROLE_MEMBER')
                fetchteams(accessToken, selectedStudioId, setTeams)
                console.log('권한 설정');
                break;
            default:
                console.log('알 수 없는 옵션 선택');
                break;
        }
    };

    // const handleInvitationChange = (index: number) => {
    //     const updatedRows = [...teams];
    //     updatedRows[index] = { ...updatedRows[index] };
    //     setTeams(updatedRows);
    // };

    const handleSendInvitation = async () => {
        try {
            const response = await axios.get(`${svURL}/api/invitations/code/${selectedStudioId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.data) {
                setInvitationCode(response.data.data);
            } else {
                const postResponse = await axios.post(
                    `${svURL}/api/invitations/code/${selectedStudioId}`,
                    {},
                    {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                setInvitationCode(postResponse.data.data);
            }
            setIsModalOpen(true);
        } catch (error) {
            console.error('초대 코드 요청 실패:', error);
            alert('초대 코드 요청에 실패했습니다.');
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setInvitationCode(null);
    };

    const handleCopyToClipboard = () => {
        if (invitationCode) {
            navigator.clipboard.writeText(invitationCode);
            alert('초대 코드가 복사되었습니다.');
        }
    };

    return (
        <>
            <div style={{ width: '100%' }}>

                <div className="teamsetting-head">
                    <h2>멤버 관리하기</h2>
                    {isOwner &&
                    <Box className="box">
                         <Button content='초대 링크 생성' bgcolor="#00C4BB" onClick={handleSendInvitation} />
                    </Box>}
                </div>

                {/* <Box sx={{ textAlign: 'right' }}>
                    <h1>팀원 초대하기</h1>
                    <Button content='초대 링크 생성' bgcolor="#00C4BB" onClick={handleSendInvitation} />
                </Box> */}
                <div className="centered"><br />
                    <TeamTable rows={teams} setRows={setTeams} studioId={selectedStudioId} handleMenuClick={handleMenuClick} />
                </div>


                <Modal
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={{ ...modalStyle }}>
                        <IconButton
                            onClick={handleCloseModal}
                            sx={{ position: 'absolute', right: 8, top: 8 }}>
                            <CloseIcon />
                        </IconButton>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            초대 코드
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                            <Typography
                                id="modal-modal-description"
                                sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', mr: 1 }}
                            >
                                {invitationCode}
                            </Typography>
                            <IconButton onClick={handleCopyToClipboard}>
                                <ContentCopyIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </Modal>
            </div>
        </>
    )
}

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

export default TeamSetting