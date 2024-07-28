import React from 'react';
import { Typography, Box } from '@mui/material';

interface Studio {
    role: string;
    name: string;
    participationDate: string;
    }

// Dummy data
const dummyStudios: Studio[] = [
    {
    role: 'Member',
    name: 'Fantasy Writers Group',
    participationDate: '2022-01-15',
    },
    {
    role: 'Admin',
    name: 'Science Fiction Enthusiasts',
    participationDate: '2021-08-22',
    },
    {
    role: 'Moderator',
    name: 'Horror Storytellers',
    participationDate: '2023-03-10',
    },
    {
    role: 'Member',
    name: 'Mystery Writers Club',
    participationDate: '2020-12-05',
    },
];

const MyStudioList: React.FC = () => {
    return (
    <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div" gutterBottom>
        참여중인 스튜디오 목록
        </Typography>
        {dummyStudios.map((studio, index) => (
        <Box key={index} sx={{ mb: 2 }}>
            <Typography variant="subtitle1" component="div">
            {studio.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
            역할: {studio.role}
            </Typography>
            <Typography variant="body2" color="textSecondary">
            참여일: {studio.participationDate}
            </Typography>
        </Box>
        ))}
    </Box>
    );
};

export default MyStudioList;
