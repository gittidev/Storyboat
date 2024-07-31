import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SubTopBar from '../components/Commons/SubTopBar';
// import CharacterCard from '../components/CharacterCard';
import Tag from '../components/Commons/Tag'; // Assuming Tag is a custom component you have

// Importing images
import img1 from '../images/img1.jpg';
import img2 from '../images/img2.jpg';
import img3 from '../images/img3.jpg';
import img4 from '../images/img4.jpg';
import img5 from '../images/img5.jpg';
import img6 from '../images/img6.jpg';
import img7 from '../images/img7.jpg';
import img8 from '../images/img8.jpg';

interface Character {
    id: number;
    name: string;
    description: string;
    imagePath: string; // New property for image path
}

const MyCharPage: React.FC = () => {
    const navigate = useNavigate();
    const characters: Character[] = [
        { id: 1, name: "LeonHeart", description: "A gallant blonde knight in armor", imagePath: img1 },
        { id: 2, name: "Lina", description: "A cute elementary school boy who loves playing the piano", imagePath: img2 },
        { id: 3, name: "Elena", description: "A fierce warrior with silver hair", imagePath: img3 },
        { id: 4, name: "Gerald", description: "A wise old wizard with a magical staff", imagePath: img4 },
        { id: 5, name: "Sylvia", description: "An adventurous archaeologist searching for lost treasures", imagePath: img5 },
        { id: 6, name: "Xavier", description: "A mysterious spy skilled in infiltration", imagePath: img6 },
        { id: 7, name: "Zara", description: "A tech-savvy engineer with a knack for inventions", imagePath: img7 },
        { id: 8, name: "Olivia", description: "A charming diplomat with a silver tongue", imagePath: img8 }
    ];

    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

    const handleCharacterClick = (character: Character) => {
        setSelectedCharacter(character);
    };

    const handleGoToAIPainting = () => {
        navigate('../AIPaintingPage');
    };

    return (
        <>
            <SubTopBar title={'내 캐릭터 보관함'}/>

            <button
                onClick={handleGoToAIPainting}
                style={{ backgroundColor: 'blue', color: 'white', padding: '10px', cursor: 'pointer' }}
            >
                AI Painting으로 이동
            </button>

            <br />
        
            <Tag />
            <br />
            <div className="character-list">
                {characters.map((character) => (
                    <div key={character.id} className="character-card" onClick={() => handleCharacterClick(character)}>
                        <img src={character.imagePath} alt={character.name} style={{ maxWidth: '100%', height: 'auto' }} />
                        <div>
                            <h3>{character.name}</h3>
                            <p>{character.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            {/* 선택된 캐릭터 정보를 오른쪽에 표시 */}
            <div className="character-details">
                {selectedCharacter && (
                    <div className="selected-character">
                        <img src={selectedCharacter.imagePath} alt={selectedCharacter.name} style={{ maxWidth: '100%', height: 'auto' }} />
                        <div>
                            <h2>{selectedCharacter.name}</h2>
                            <p>{selectedCharacter.description}</p>
                        </div>
                    </div>
                )}
            </div>
            <br />
        </>
    );
};

export default MyCharPage;
