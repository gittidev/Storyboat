import React from 'react';
import type { ProfileProps } from './ProfileData';   
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import ProfileForm from './ProfileForm';
import './Profile.css';
import { Typography } from '@mui/material';
import CustomButton from '../Commons/CustomButton';


const style = {
  position: 'absolute',
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
  const [profiles, setProfiles] = React.useState<ProfileProps[]>([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSave = (profile: ProfileProps) => {
    console.log('Profile saved:', profile);
    setProfiles((prevProfiles) => [...prevProfiles, profile]);
    // Handle character save logic here
    handleClose();
  };

  return (
    <>
    <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
      <Typography variant="h6" component={'div'}>
        내 프로필 관리
      </Typography>
      <CustomButton content='프로필 수정' bgcolor='lightBlue.200' hoverBgColor='teal.A100' onClick={handleOpen}/>
    </Box>
      

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
      <Box>
        {profiles.map((profile, index) => (
          <Profile
            key={index}
            penName = {profile.penName}
            email = {profile.email}
            profilePicture = {profile.profilePicture}
            preferredGenres = {profile.preferredGenres}
            additionalInfo = {profile.additionalInfo}
          />
        ))}
      </Box>

    </>
  );
}

// const FileUploadComponent: React.FC = () => {
//   const [profilePicture, setProfilePicture] = useState<File | null>(null);

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files[0]) {
//       setProfilePicture(event.target.files[0]);
//     }
//   };

//   return (
//     <div className="form-group">
//       <label htmlFor="profilePicture">프로필 사진</label>
//       <input 
//         type="file" 
//         id="profilePicture" 
//         onChange={handleFileChange}
//         style={{ display: 'block', width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
//       />
//       {profilePicture && (
//         <div>
//           <p>Selected file: {profilePicture.name}</p>
//           <img 
//             src={URL.createObjectURL(profilePicture)} 
//             alt="Profile Preview" 
//             style={{ maxWidth: '100%', height: 'auto', marginTop: '1rem' }}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default FileUploadComponent;


//이게 기존 코드임
// const Profile: React.FC<ProfileProps> = ({ penName,profilePicture, preferredGenres, additionalInfo }) => {
const Profile: React.FC<ProfileProps> = ({ penName, email, profilePicture, preferredGenres, additionalInfo }) => {
  return (
    <div style={{ border: '1px solid #ddd', padding: '1rem', marginTop: '1rem' }}>
      <h2>{penName}</h2>
      <h2>{email}</h2>
      <p><strong>profilePicture:</strong> </p>
      <img 
            src={profilePicture} 
            alt="Profile Preview" 
            style={{ maxWidth: '100%', height: 'auto', marginTop: '1rem' }}
          />
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