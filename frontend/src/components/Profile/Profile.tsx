import React, {useEffect, useState} from 'react';
import { fetchProfile } from '../../apis/profileApi';
import { dummyProfile} from './ProfileData'
import type { Profile } from './ProfileData';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import ProfileForm from './ProfileForm';
import './Profile.css';


const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function BasicModal() {
  const [open, setOpen] = React.useState(false);
  const [profiles, setProfiles] = React.useState<Profile[]>([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSave = (profile: Profile) => {
    console.log('Profile saved:', profile);
    setProfiles((prevProfiles) => [...prevProfiles, profile]);
    // Handle character save logic here
    handleClose();
  };

  return (
    <div>
      <Button onClick={handleOpen}>프로필 수정</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <ProfileForm onSave={handleSave} onClose={handleClose} />
        </Box>
      </Modal>
      <div>
        <h3>프로필</h3>
        {/* <p>{Character}</p> */}
        {profiles.map((profile, index) => (
          <Profile
            key={index}
            penName = {profile.penName}
            // email = {profile.email}
            preferredGenres = {profile.tags}
            additionalInfo = {profile.additionalInfo}
          />
        ))}
      </div>

    </div>
  );
}

interface ProfileProps {
  penName : string;
  email : string;
  preferredGenres : string;
  additionalInfo : string;
}

const CharBox: React.FC<ProfileProps> = ({ penName, email, preferredGenres, additionalInfo }) => {
  return (
    <div style={{ border: '1px solid #ddd', padding: '1rem', marginTop: '1rem' }}>
      <h2>{penName}</h2>
      <p><strong>email:</strong> {email}</p>
      <p><strong>선호장르:</strong> {preferredGenres}</p>
      <p><strong>추가정보:</strong> {additionalInfo}</p>
    </div>
  );
};


























///////////////////////////////////////////////////////////////////

// const Profile: React.FC = () => {
//   const [profile, setProfile] = useState<Profile | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const loadProfile = async () => {
//       try {
//         const data = await fetchProfile();
//         setProfile(data);
//       } catch (err) {
//         setError('Failed to fetch profile');
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadProfile();
//   }, []);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;
//   if (!profile) return <p>No profile data</p>;

//   return (
//     <div className="profile">
//       <img src={profile.profilePicture} alt={`${profile.penName}'s profile`} className="profile-picture" />
//       <div className="profile-details">
//         <h2>{profile.penName}</h2>
//         <p><strong>Email:</strong> {profile.email}</p>
//         <p><strong>선호 장르:</strong> {profile.preferredGenres.join(', ')}</p>
//         <p><strong>추가 정보:</strong> {profile.additionalInfo}</p>
//       </div>
//     </div>
//   );
// };

// export default Profile;

// const Profile: React.FC = () => {
//   const profile: Profile = dummyProfile;

//   return (
//     <div className="profile">
//       <img src={profile.profilePicture} alt={`${profile.penName}'s profile`} className="profile-picture" />
//       <div className="profile-details">
//         <h2>{profile.penName}</h2>
//         <p><strong>Email:</strong> {profile.email}</p>
//         <p><strong>선호장르:</strong> {profile.preferredGenres.join(', ')}</p>
//         <p><strong>추가정보:</strong> {profile.additionalInfo}</p>
//       </div>
//     </div>
//   );
// };

// export default Profile;