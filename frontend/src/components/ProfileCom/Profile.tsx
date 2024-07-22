import React, {useEffect, useState} from 'react';
import { fetchProfile } from '../../apis/profileApi';
import { dummyProfile} from './ProfileData'
import type { Profile } from './ProfileData';
import './Profile.css';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchProfile();
        setProfile(data);
      } catch (err) {
        setError('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!profile) return <p>No profile data</p>;

  return (
    <div className="profile">
      <img src={profile.profilePicture} alt={`${profile.penName}'s profile`} className="profile-picture" />
      <div className="profile-details">
        <h2>{profile.penName}</h2>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>선호 장르:</strong> {profile.preferredGenres.join(', ')}</p>
        <p><strong>추가 정보:</strong> {profile.additionalInfo}</p>
      </div>
    </div>
  );
};

export default Profile;

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