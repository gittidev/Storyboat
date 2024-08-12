import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useRecoilValue } from 'recoil';
import axios from 'axios';
import { Character } from '../types/Chartype'; 
import { accessTokenState } from '../recoil/atoms/authAtom';
import { myStudioState } from '../recoil/atoms/studioAtom';
import MakingCharacter from './MyChar/MakingCharacter';
import SubTopBar from '../components/Commons/SubTopBar';
import EditCharacter from './MyChar/EditCharacter'; 

const svURL = import.meta.env.VITE_SERVER_URL;

const MyCharPage: React.FC = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [editMode, setEditMode] = useState(false);

    const token = useRecoilValue(accessTokenState);
    const myStudioId = useRecoilValue(myStudioState);

    useEffect(() => {
        // 캐릭터 불러오기
        const loadCharacters = async () => {
            try {
                const response = await axios.get<{ message: string, data: Character[] }>(
                    `${svURL}/api/studios/${myStudioId}/characters`,
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
    }, [token, myStudioId]);

    const handleCharacterClick = (character: Character) => {
        setSelectedCharacter(character);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedCharacter(null);
        setEditMode(false); 
    };

    const handleUpdate = () => {
        // Reload characters to reflect updates
        const loadCharacters = async () => {
            try {
                const response = await axios.get<{ message: string, data: Character[] }>(
                    `${svURL}/api/studios/${myStudioId}/characters`,
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
    };

    const filteredCharacters = characters.filter(character =>
        character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        character.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleDelete = async () => {
        if (selectedCharacter) {
            const confirm = window.confirm('정말 삭제하시겠습니까?');
            if (confirm) {
                try {
                    await axios.delete(`${svURL}/api/studios/${myStudioId}/characters/${selectedCharacter.id}`, {
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

    return (
        <>
            <MakingCharacter />
            <SubTopBar />
            {/* Search Input */}
            <Box sx={{ padding: 2 }}>
                <input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
            </Box>

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
                    width: 800,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                }}>
                    {/* {selectedCharacter && !editMode && ( */}
                    {selectedCharacter && (
                        <>
                            <Box sx={{ flexShrink: 0 }}>
                                <CardMedia
                                    component="img"
                                    alt={selectedCharacter.name}
                                    height="400"
                                    image={selectedCharacter.imageUrl} 
                                    sx={{ width: 300, height: 'auto' }}
                                />
                            </Box>
                            <Box>
                                <Typography id="modal-title" variant="h4" component="h2" gutterBottom>
                                    {selectedCharacter.name}
                                </Typography>
                                <Typography id="modal-description" variant="body1" color="text.secondary" paragraph>
                                    {selectedCharacter.description}
                                </Typography>

                                {selectedCharacter.tags && selectedCharacter.tags.length > 0 && (
                                    <Box sx={{ marginTop: 2 }}>
                                        <Typography variant="h6" component="div" gutterBottom>
                                            {/* 태그 부분 추가 가능 */}
                                        </Typography>
                                        <Box sx={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 1,
                                        }}>
                                            {selectedCharacter.tags.map((tag, index)  => (
                                                <Box
                                                    key={index}
                                                    sx={{
                                                        border: '1px solid rgb(1, 186, 138)',
                                                        borderRadius: '15px',
                                                        padding: '4px 8px',
                                                        backgroundColor: 'rgb(242, 243, 244)',
                                                        color: 'rgb(1, 186, 138)',
                                                        fontSize: '14px',
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
                                <br/>
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }} className='buttoncss'>

                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => setEditMode(true)} // 수정 모드 활성화
                                        sx={{ marginLeft: 2 }}
                                    >
                                        수정
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={handleDelete}
                                        sx={{ marginLeft: 2 }}
                                    >
                                        삭제
                                    </Button>

                                </div>

                            </Box>
                        </>
                    )}

                    {/* 수정 모드가 활성화된 경우 수정 컴포넌트 표시 */}
                    {selectedCharacter && editMode && (
                        <EditCharacter
                            character={selectedCharacter}
                            open={editMode}
                            onClose={handleClose}
                            onUpdate={handleUpdate}
                            // token={token}
                        />
                    )}
                </Box>
            </Modal>
        </>
    );
};

export default MyCharPage;
