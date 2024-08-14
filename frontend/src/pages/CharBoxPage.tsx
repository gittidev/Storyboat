// CharBoxPage.tsx

import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useRecoilState, useRecoilValue } from 'recoil';
import axios from 'axios';
import { Character } from '../types/Chartype'; 
import { accessTokenState } from '../recoil/atoms/authAtom';
import { selectedStudioState, charactersState, selectedCharacterState } from '../recoil/atoms/studioAtom';
import MakingCharacterteam from './MyChar/MakingCharacterteam';
import EditCharacterteam from './MyChar/EditCharacterteam';


const svURL = import.meta.env.VITE_SERVER_URL;

const CharBoxPage: React.FC = () => {
    const [characters, setCharacters] = useRecoilState<Character[]>(charactersState);
    const [selectedCharacter, setSelectedCharacter] = useRecoilState<Character | null>(selectedCharacterState);
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editMode, setEditMode] = useState(false);

    const token = useRecoilValue(accessTokenState);
    const SelectedStudioId = useRecoilValue(selectedStudioState);

    // Fetch characters when component mounts or when studio ID or token changes
    useEffect(() => {
        const loadCharacters = async () => {
            try {
                const response = await axios.get<{ message: string, data: Character[] }>(
                    `${svURL}/api/studios/${SelectedStudioId}/characters`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                );
                setCharacters(response.data.data);
            } catch (error) {
                console.error('Error fetching characters:', error);
            }
        };
        loadCharacters();
    }, [token, SelectedStudioId, setCharacters]);

    const handleCharacterClick = (character: Character) => {
        setSelectedCharacter(character);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedCharacter(null);
        setEditMode(false);
    };

    const handleUpdate = async () => {
        if (selectedCharacter) {
            try {
                const response = await axios.get<{ message: string, data: Character[] }>(
                    `${svURL}/api/studios/${SelectedStudioId}/characters/${selectedCharacter.id}/${SelectedStudioId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                );
                setCharacters(response.data.data);
            } catch (error) {
                console.error('Error fetching characters:', error);
            }
        } else {
            console.error('No character selected');
        }
    };
    

    const handleDelete = async () => {
        if (selectedCharacter) {
            const confirm = window.confirm('정말 삭제하시겠습니까?');
            if (confirm) {
                try {
                    await axios.delete(`${svURL}/api/studios/${SelectedStudioId}/characters/${selectedCharacter.id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    setCharacters(prevCharacters => prevCharacters.filter(character => character.id !== selectedCharacter.id));
                    handleClose();
                } catch (error) {
                    console.error('Error deleting character:', error);
                }
            }
        }
    };

    const filteredCharacters = characters.filter(character =>
        character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        character.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleCharacterCreated = async () => {
        await handleUpdate(); // Update the character list after creation
    };

    return (
        <>
            <MakingCharacterteam onCharacterCreated={handleCharacterCreated} />

            <Box sx={{ padding: 2 }}>
                <input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
            </Box>

            <div className='MyCharPage-body' style={{ padding: '0 15px' }}>
                <Grid container spacing={3}>
                    {filteredCharacters.map(character => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={character.id}>
                            <Card
                                sx={{ maxWidth: 345, height: 300, border: '1px solid #d3d3d3' }}
                                onClick={() => handleCharacterClick(character)}
                            >
                                <CardMedia
                                    component="img"
                                    alt={character.name}
                                    height="260"
                                    image={character.imageUrl}
                                    sx={{ height: 200, objectFit: 'contain', mt: 4 }}
                                />
                                <CardContent>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography gutterBottom variant="h6" component="div">
                                            {character.name}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '50%',
                    height: '50%',
                    bgcolor: 'background.paper',
                    p: 4,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1,
                    overflow: 'hidden'
                }}>
                    {selectedCharacter && (
                        <>
                            <Box sx={{ flexShrink: 0, width: '45%', height: 'auto', overflow: 'hidden' }}>
                                <CardMedia
                                    component="img"
                                    alt={selectedCharacter.name}
                                    image={selectedCharacter.imageUrl}
                                    sx={{
                                        width: '90%',
                                        height: 'auto',
                                        objectFit: 'cover'
                                    }}
                                />
                            </Box>
                            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                                <Typography id="modal-title" variant="h5" component="h2" gutterBottom>
                                    {selectedCharacter.name}
                                </Typography>
                                <Typography id="modal-description" variant="body2" color="text.secondary" sx={{ fontSize: '1.1rem' }} paragraph>
                                    {selectedCharacter.description}
                                </Typography>
                                {selectedCharacter.tags && selectedCharacter.tags.length > 0 && (
                                    <Box sx={{ marginTop: 1, fontSize: '1.1rem' }}>
                                        <Typography variant="h5" component="div" gutterBottom>
                                            
                                        </Typography>
                                        <Box sx={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 0.5,
                                        }}>
                                            {selectedCharacter.tags.map((tag, index) => (
                                                <Box
                                                    key={index}
                                                    sx={{
                                                        border: '1px solid rgb(1, 186, 138)',
                                                        borderRadius: '12px',
                                                        padding: '3px 6px',
                                                        backgroundColor: 'rgb(242, 243, 244)',
                                                        color: 'rgb(1, 186, 138)',
                                                        fontSize: '1.1rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    #{tag.trim()}
                                                </Box>
                                            ))}
                                        </Box>
                                    </Box>
                                )}
                                <br />
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => setEditMode(true)}
                                        sx={{ marginLeft: 1 }}
                                    >
                                        수정
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={handleDelete}
                                        sx={{ marginLeft: 1 }}
                                    >
                                        삭제
                                    </Button>
                                </div>
                            </Box>
                        </>
                    )}
                    {selectedCharacter && editMode && (
                        <EditCharacterteam
                            character={selectedCharacter}
                            open={editMode}
                            onClose={handleClose}
                            onUpdate={handleUpdate}
                        />
                    )}
                </Box>
            </Modal>
        </>
    );
};

export default CharBoxPage;
