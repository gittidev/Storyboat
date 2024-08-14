// CharBoxPage.tsx

import React, { useState, useEffect } from 'react';
// import SubTopBarteam from '../components/Commons/SubTopBarteam';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import MakingCharacterteam from './MyChar/MakingCharacterteam';

import Button from '@mui/material/Button';
import { useRecoilValue } from 'recoil';
import axios from 'axios';
import { Character } from '../types/Chartype'; 
import { accessTokenState } from '../recoil/atoms/authAtom';

// import { myStudioState } from '../recoil/atoms/studioAtom';
// 나중에 이걸로 바꿔야 함
import { selectedStudioState} from '../recoil/atoms/studioAtom';

import EditCharacterteam from './MyChar/EditCharacterteam'; 
import api from '../apis/api';


// import img11 from '../images/img11.jpg';
// import img12 from '../images/img12.jpg';
// import img13 from '../images/img13.jpg';
// import img14 from '../images/img14.jpg';
// import img15 from '../images/img15.jpg';
// import img16 from '../images/img16.jpg';
// import img17 from '../images/img17.jpg';
// import img18 from '../images/img18.jpg';

// import img21 from '../images/img21.jpg';
// import img22 from '../images/img22.jpg';
// import img23 from '../images/img23.jpg';
// import img24 from '../images/img24.jpg';
// import img25 from '../images/img25.jpg';
// import img26 from '../images/img26.jpg';
// import img27 from '../images/img27.jpg';
// import img28 from '../images/img28.jpg';

const svURL = import.meta.env.VITE_SERVER_URL;

const CharBoxPage: React.FC = () => {
    // const navigate = useNavigate();

    const [characters, setCharacters] = useState<Character[]>([]);
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [editMode, setEditMode] = useState(false);

    const token = useRecoilValue(accessTokenState);
    const myStudioId = useRecoilValue(selectedStudioState);
    console.log(myStudioId)

    // selectedStudioState
    
//     const characters: Character[] = [
//       {
//           id: 1,
//           name: "지안",
//           description: "지안은 현대 도시에서 살아가는 15세의 예술가입니다. 그녀는 스트리트 아트와 그래피티에 열정을 가지고 있으며, 도시의 벽과 거리에서 자신의 작품을 만들어내는 것으로 유명합니다. 지안은 비판적 사고와 자유로운 창의성을 겸비하고 있으며, 자신의 작업을 통해 사회적인 메시지를 전달하고 싶어 합니다. 그녀는 혼자만의 시간을 소중히 여기며, 고독 속에서도 영감을 얻고 새로운 아이디어를 찾습니다. 지안의 작품은 도시의 풍경에 새로운 색깔을 더하며, 그녀의 예술적 접근 방식은 많은 사람들에게 새로운 시각을 제공합니다.",
//           imagePath: img11,
//           tags: ["스트리트 아트", "창의성", "사회적 메시지"]
//       },
//       {
//           id: 2,
//           name: "루미",
//           description: "루미는 별을 사랑하는 12세의 천문학 소녀입니다. 그녀는 별자리와 우주에 대한 깊은 호기심을 가지고 있으며, 밤하늘을 관찰하며 별의 움직임을 기록합니다. 루미는 자신만의 별자리 관측 일지를 작성하고, 각 별의 신화와 전설에 대한 이야기를 연구하는 것을 좋아합니다. 그녀의 꿈은 천체 물리학자가 되어 우주의 비밀을 푸는 것입니다. 루미는 친구들에게 우주에 대한 신비로운 이야기를 들려주며, 별에 대한 열정을 전파하는 것을 즐깁니다.",
//           imagePath: img12,
//           tags: ["천문학", "별자리", "우주"]
//       },
//       {
//           id: 3,
//           name: "카일",
//           description: "카일은 미래의 환경 과학자이자 자연 보호 활동가입니다. 18세의 카일은 지구 환경을 지키기 위한 혁신적인 솔루션을 개발하는 데 열정을 가지고 있으며, 재활용과 지속 가능한 에너지에 대한 연구를 하고 있습니다. 그는 자신이 개발한 친환경 기술을 통해 지구의 문제를 해결하고 싶어하며, 지역 사회에서 환경 보호 캠페인을 이끌고 있습니다. 카일의 목표는 환경 문제를 해결하고 다음 세대에게 더 나은 지구를 물려주는 것입니다.",
//           imagePath: img13,
//           tags: ["환경", "지속 가능성", "혁신"]
//       },
//       {
//           id: 4,
//           name: "미오",
//           description: "미오는 일본의 전통 공예를 사랑하는 16세의 청소년입니다. 그녀는 주로 도자기와 직물 공예에 관심을 가지며, 가족이 운영하는 공방에서 전통 기술을 배우고 있습니다. 미오는 자신의 작품에 현대적인 감각을 더하여 전통과 현대를 결합한 독특한 작품을 만들어냅니다. 그녀는 공예를 통해 예술의 전통을 이어가고자 하며, 지역 사회의 문화적 유산을 보존하기 위해 노력하고 있습니다. 미오의 작품은 아름다움과 정성을 담아내어 많은 이들에게 감동을 줍니다.",
//           imagePath: img14,
//           tags: ["전통 공예", "도자기", "직물"]
//       },
//       {
//           id: 5,
//           name: "엘라",
//           description: "엘라는 20세의 국제적인 댄서로, 다양한 문화의 춤을 섭렵하는 것을 즐깁니다. 그녀는 각 나라의 전통 춤과 현대 춤을 연구하며, 자신의 춤에 통합하여 새로운 스타일을 창조하는 데 열정을 쏟고 있습니다. 엘라는 세계 여러 나라를 여행하며, 각지의 문화와 사람들로부터 영감을 얻습니다. 그녀의 공연은 감동적이고 다채로우며, 관객들에게 깊은 인상을 남깁니다. 엘라는 춤을 통해 문화의 다양성과 아름다움을 널리 알리고자 합니다.",
//           imagePath: img15,
//           tags: ["댄스", "문화", "창조"]
//       },
//       {
//           id: 6,
//           name: "노아",
//           description: "노아는 14세의 열정적인 소설가입니다. 그는 판타지와 공상 과학 장르의 소설을 쓰며, 자신의 상상력을 통해 독특한 세계를 창조합니다. 노아는 글쓰기에 대한 사랑과 탐구심으로 가득 차 있으며, 매일 새로운 이야기와 캐릭터를 만들어 나갑니다. 그는 자신의 작품을 통해 독자들에게 새로운 세상을 보여주고, 상상의 힘을 믿습니다. 노아는 미래에 유명한 소설가가 되어 자신의 이야기를 전 세계와 나누고 싶어 합니다.",
//           imagePath: img16,
//           tags: ["소설", "상상력", "판타지"]
//       },
//       {
//           id: 7,
//           name: "엘릭",
//           description: "엘릭은 17세의 열혈적인 스포츠 선수로, 각종 운동 종목에서 뛰어난 능력을 발휘합니다. 그는 체육과 피트니스에 대한 강한 열정을 가지고 있으며, 매일 훈련과 연습에 매진하고 있습니다. 엘릭은 팀워크와 협동의 중요성을 믿으며, 자신의 팀을 이끌어 성과를 이루는 것을 목표로 하고 있습니다. 그의 끊임없는 노력과 헌신은 주변 사람들에게 큰 영감을 주며, 그의 성공적인 경기는 많은 사람들에게 도전 정신을 불어넣습니다.",
//           imagePath: img17,
//           tags: ["스포츠", "훈련", "팀워크"]
//       },
//       {
//           id: 8,
//           name: "하나",
//           description: "하나는 22세의 도시 농부로, 도심 속에서도 자연을 즐기고 싶어 하는 인물입니다. 그녀는 도시의 옥상에서 작은 정원을 가꾸며, 채소와 꽃을 재배합니다. 하나는 도시와 자연의 조화를 이루는 방법을 찾고 있으며, 자신의 정원을 통해 지역 사회와 연결되기를 바랍니다. 그녀의 정원은 사람들에게 도시 생활 속에서도 자연과의 접촉을 제공하며, 자연의 아름다움과 중요성을 알리고 있습니다. 하나의 열정과 헌신은 도시 환경에서도 자연의 가치를 높이는 데 기여하고 있습니다.",
//           imagePath: img18,
//           tags: ["도시 농업", "정원", "자연"]
//       },
//       {
//         id: 9,
//         name: "리오",
//         description: "리오는 17세의 열정적인 사진작가입니다. 그는 도시와 자연을 탐험하며 독특한 순간을 포착하는 데 능숙합니다. 리오는 사진을 통해 세상의 아름다움과 일상의 소중함을 사람들에게 전달하려고 합니다. 그는 최신 기술과 전통적인 기법을 조화롭게 활용하여, 감동적인 스토리를 담은 사진을 만들어냅니다. 그의 작품은 색다른 시각과 감동을 선사하며, 많은 이들에게 깊은 인상을 남깁니다.",
//         imagePath: img21,
//         tags: ["사진", "탐험", "스토리"]
//       },
//       {
//         id: 10,
//         name: "미래",
//         description: "미래는 19세의 창의적인 게임 디자이너입니다. 그녀는 가상 현실과 증강 현실을 활용하여 몰입감 있는 게임 세상을 만들고자 합니다. 미래는 게임을 통해 사람들에게 새로운 경험을 제공하고, 상상력을 자극하는 것을 목표로 하고 있습니다. 그녀의 게임은 깊이 있는 스토리와 혁신적인 디자인으로 많은 팬들을 보유하고 있으며, 게임 산업에 새로운 변화를 가져오고 있습니다.",
//         imagePath: img22,
//         tags: ["게임 디자인", "VR", "상상력"]
//       },
//       {
//         id: 11,
//         name: "준호",
//         description: "준호는 21세의 젊은 엔지니어로, 최신 기술을 이용한 혁신적인 기계 장비를 개발하고 있습니다. 그는 특히 로봇 공학과 인공지능에 큰 관심을 가지고 있으며, 기술이 사람들의 삶을 어떻게 변화시킬 수 있을지에 대해 고민하고 있습니다. 준호는 자신의 기술적 상상력을 현실로 바꾸기 위해 끊임없이 연구하고 실험하며, 미래의 기술에 대한 비전을 실현해 나가고 있습니다.",
//         imagePath: img23,
//         tags: ["로봇 공학", "인공지능", "혁신"]
//       },
//       {
//         id: 12,
//         name: "아리",
//         description: "아리는 16세의 재능 있는 만화가입니다. 그녀는 독특한 그림 스타일과 매력적인 캐릭터들로 유명합니다. 아리는 자신의 만화를 통해 다양한 사회적 이슈를 재미있게 풀어내고, 사람들에게 중요한 메시지를 전달하려고 합니다. 그녀의 작품은 상상력과 깊이가 넘치며, 독자들에게 큰 감동을 줍니다.",
//         imagePath: img24,
//         tags: ["만화", "사회적 이슈", "상상력"]
//       },
//       {
//         id: 13,
//         name: "다이안",
//         description: "다이안은 23세의 전문적인 요리사로, 다양한 세계의 요리를 연구하고 개발합니다. 그녀는 음식의 조화와 창의적인 레시피로 유명하며, 매일 새로운 요리 아이디어를 실험하고 있습니다. 다이안은 자신의 요리를 통해 사람들에게 즐거움과 만족을 제공하며, 음식에 대한 깊은 이해와 열정을 가지고 있습니다.",
//         imagePath: img25,
//         tags: ["요리", "세계 요리", "창의성"]
//       },
//       {
//         id: 14,
//         name: "태오",
//         description: "태오는 15세의 청소년 환경 운동가입니다. 그는 학교와 지역 사회에서 환경 보호를 위한 다양한 캠페인을 이끌고 있으며, 재활용과 에너지 절약의 중요성을 널리 알리고 있습니다. 태오는 자신의 열정과 리더십을 통해 사람들을 환경 문제에 대한 인식을 높이고, 지속 가능한 미래를 위해 노력하고 있습니다.",
//         imagePath: img26,
//         tags: ["환경 보호", "캠페인", "지속 가능성"]
//       },
//       {
//         id: 15,
//         name: "솔라",
//         description: "솔라는 18세의 열정적인 패션 디자이너로, 다양한 문화와 시대의 영향을 받은 독창적인 의상을 창조합니다. 그녀는 전통적인 패션 기법과 현대적인 디자인 요소를 결합하여, 패션 산업에 새로운 바람을 일으키고자 합니다. 솔라의 디자인은 신선하고 혁신적이며, 그녀의 패션 쇼는 항상 큰 주목을 받고 있습니다.",
//         imagePath: img27,
//         tags: ["패션 디자인", "문화", "혁신"]
//       },
//       {
//         id: 16,
//         name: "루카",
//         description: "루카는 20세의 음악 프로듀서로, 다양한 장르의 음악을 실험하며 독창적인 사운드를 만들어냅니다. 그는 음악을 통해 감정을 표현하고, 사람들에게 깊은 감동을 주기 위해 노력하고 있습니다. 루카는 매일 새로운 음악 프로젝트에 참여하며, 그의 창의적인 작업은 음악 팬들 사이에서 큰 인기를 끌고 있습니다.",
//         imagePath: img28,
//         tags: ["음악", "사운드 디자인", "창의성"]
//       }

//   ];
  
    useEffect(() => {
        // 캐릭터 불러오기
        const loadCharacters = async () => {
            try {
                const response = await api.get<{ message: string, data: Character[] }>(
                    `/api/studios/${myStudioId}/characters`,
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
            <MakingCharacterteam />
            {/* <SubTopBarteam /> */}

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

            {/* <CharacTag /> */}
            <div className='MyCharPage-body' style={{ padding: '0 15px' }}>
            <Grid container spacing={3}>
                
                {filteredCharacters.map((character) => (
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
                                sx={{ height: 200, objectFit: 'contain', mt: 4  }} 
                            />
                            <CardContent>
                                  <Box sx={{ textAlign: 'center' }}>
                                <Typography gutterBottom variant="h6" component="div">
                                    {character.name}
                                </Typography>
                                {/* <Typography variant="body2" color="text.secondary">
                                    {character.description}
                                </Typography> */}
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
                    width: 800,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'flex-start', 
                    gap: 2, 
                }}>
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
                                {selectedCharacter.tags && (
                                    <Box sx={{ marginTop: 2 }}>
                                        <Typography variant="h6" component="div" gutterBottom>
                                            {/* Tags */}
                                        </Typography>
                                        <Box sx={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 1,
                                        }}>
                                            {selectedCharacter.tags.map((tag, index) => (
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
                        <EditCharacterteam
                            character={selectedCharacter}
                            open={editMode}
                            onClose={handleClose}
                            onUpdate={handleUpdate}
                            // token={token}
                        />
                    )}


                </Box>
            </Modal>


            <br />
        </>
    );
};

export default CharBoxPage;
