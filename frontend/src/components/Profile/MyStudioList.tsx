import React, { useState, useEffect } from 'react';
import {
    Typography, Box, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import { fetchStudioDataTest } from '../../apis/stuioApites';
import { StudioType } from '../../types/StudioType';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '../../recoil/atoms/authAtom';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';
import Tooltip from '@mui/material/Tooltip';
// import { BorderBox } from '../Commons/BorderBox';

const svURL = import.meta.env.VITE_SERVER_URL;

const MyStudioList: React.FC = () => {
    const [studios, setStudios] = useState<StudioType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const token = useRecoilValue(accessTokenState);

    useEffect(() => {
        const fetchData = async (token: string) => {
            try {
                console.log('Fetching data with token:', token); // 디버깅 로그
                const data = await fetchStudioDataTest(token);
                console.log('Fetched data:', data); // 디버깅 로그
                if (Array.isArray(data)) {
                    setStudios(data);
                } else {
                    throw new Error('Data is not an array');
                }
            } catch (err) {
                console.error('Error fetching data:', err); // 디버깅 로그
                setError('스튜디오 데이터를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchData(token);
        } else {
            setLoading(false);
            setError('토큰이 유효하지 않습니다.');
        }
    }, [token]);

    if (loading) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography variant="h6" component="div" gutterBottom>
                    로딩 중...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography variant="h6" component="div" gutterBottom>
                    {error}
                </Typography>
            </Box>
        );
    }

    const handleLeaveStudio = async (studioId: number) => {
        try {
            const response = await axios.delete(`${svURL}/studios/${studioId}/members`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.status === 200) {
                setStudios((prevStudios) => prevStudios.filter((studio) => studio.studioId !== studioId));
            } else {
                throw new Error('Failed to leave the studio');
            }
        } catch (err) {
            console.error('Error leaving the studio:', err); // Debugging log
            setError('스튜디오에서 탈퇴하는 중 오류가 발생했습니다.');
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" component="div" gutterBottom>
                참여 중인 스튜디오 목록
            </Typography>
            <br/>
            {studios.length === 0 ? (
                <Typography variant="body1" component="div">
                    스튜디오를 생성해주세요 😊
                </Typography>
            ) : (
                <TableContainer
                component={Paper}
                style={{
                  borderRadius: '10px',
                  padding: '1px',
                  height: 'auto',
                  border: '1px solid transparent',
                  backgroundImage: 'linear-gradient(#fff, #fff), linear-gradient(0deg, #ebffde 0%, #cde4ff 100%)',
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'content-box, border-box',
                  overflow: 'auto',
                  boxShadow: 'none'
                }}
              >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">스튜디오 이름</TableCell>
                                {/* <TableCell>역할</TableCell> */}
                                <TableCell align="center">탈퇴</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {studios.map((studio) => (
                                <TableRow key={studio.studioId}>
                                    <TableCell align="center">{studio.name}</TableCell>
                                    {/* <TableCell>{studio.role}</TableCell> */}
                                    <TableCell align="center">
                                        <Tooltip title="스튜디오 나가기">
                                            <IconButton onClick={() => handleLeaveStudio(studio.studioId)}>
                                                <DeleteIcon/>
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default MyStudioList;