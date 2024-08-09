import React, { useState } from 'react';
import { Card, CardContent, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import './MyChar/CharacterCard.css';

interface CharacterCardProps {
    name: string;
    description: string;
    imagePath: string; 
}

const CharacterCard: React.FC<CharacterCardProps> = ({ name, description, imagePath }) => {
    const [showModal, setShowModal] = useState(false); // 모달 표시 상태

    const handleCardClick = () => {
        setShowModal(true); // 카드 클릭 시 모달 열기
    };

    const handleCloseModal = () => {
        setShowModal(false); // 모달 닫기
    };

    return (
        <>
            <Card sx={{ width: 300, margin: 1, cursor: 'pointer' }} onClick={handleCardClick}>
                <CardContent>
                    <Typography variant="h6">{name}</Typography>
                    <Typography variant="body2" color="text.secondary">{description}</Typography>
                </CardContent>
            </Card>

            <Dialog open={showModal} onClose={handleCloseModal}>
                <DialogTitle>{name}</DialogTitle>
                <DialogContent>
                    <img src={imagePath} alt={name} style={{ maxWidth: '100%' }} />
                    <Typography variant="body1" paragraph>
                        {description}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">
                        닫기
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default CharacterCard;
