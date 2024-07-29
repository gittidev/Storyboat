// import React, { useState } from 'react';
// import { Card, Modal, Button } from 'react-bootstrap';
// import './CharacterCard.css';

// interface CharacterCardProps {
//     name: string;
//     description: string;
//     imagePath: string; 
// }

// const CharacterCard: React.FC<CharacterCardProps> = ({ name, description, imagePath }) => {
//     const [showModal, setShowModal] = useState(false); // 모달 표시 상태

//     const handleCardClick = () => {
//         setShowModal(true); // 카드 클릭 시 모달 열기
//     };

//     const handleCloseModal = () => {
//         setShowModal(false); // 모달 닫기
//     };

//     return (
//         <>
//             <Card style={{ width: '18rem', margin: '10px', cursor: 'pointer' }} onClick={handleCardClick}>
//                 <Card.Body>
//                     <Card.Title>{name}</Card.Title>
//                     <Card.Text>{description}</Card.Text>
//                 </Card.Body>
//             </Card>

//             <Modal show={showModal} onHide={handleCloseModal} dialogClassName="custom-modal">
//                 <Modal.Header closeButton>
//                     <Modal.Title>{name}</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <img src={imagePath} alt={name} style={{ maxWidth: '100%' }} /> 
//                     {description}
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={handleCloseModal}>
//                         닫기
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         </>
//     );
// };

// export default CharacterCard;
