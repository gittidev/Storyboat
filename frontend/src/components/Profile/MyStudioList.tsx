import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { fetchStudioDataTest } from '../../apis/stuioApites';
import { StudioType } from '../../types/StudioType';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '../../recoil/atoms/authAtom';

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

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" component="div" gutterBottom>
                참여중인 스튜디오 목록
            </Typography>
            {studios.length === 0 ? (
                <Typography variant="body1" component="div">
                    참여중인 스튜디오가 없습니다.
                </Typography>
            ) : (
                studios.map((studio, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" component="div">
                            {studio.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {/* 역할: {studio.role} */}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {/* 참여일: {studio.participationDate} */}
                        </Typography>
                    </Box>
                ))
            )}
        </Box>
    );
};

export default MyStudioList;
