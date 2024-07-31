import React, { useState } from 'react';
import { ProfileProps } from './ProfileData';
import './ProfileForm.css';

interface ProfileFormProps {
  onSave: (profile: ProfileProps) => void;
  onClose: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onSave, onClose }) => {
  const [penName, setPenName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [profilePicture, setProfilePicture] = useState<string | undefined>(undefined);
  const [preferredGenres, setPreferredGenres] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const profile: ProfileProps = { penName, email, profilePicture, preferredGenres, additionalInfo };
    onSave(profile);
    setPenName('');
    setEmail('');
    setProfilePicture(profilePicture);
    setPreferredGenres([]);
    setAdditionalInfo('');
    onClose(); // Close the form after saving
  };

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      <div className="form-group">
        <label htmlFor="penName">필명</label>
        <input
          type="text"
          id="penName"
          value={penName}
          onChange={(e) => setPenName(e.target.value)}
          style={{ display: 'block', width: '100%', padding: '0.5rem', boxSizing: 'border-box', height: '100px' }}
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">이메일</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: 'block', width: '100%', padding: '0.5rem', boxSizing: 'border-box', height: '100px' }}
        />
      </div>

      <div className="form-group">
        <label htmlFor="profilePicture">프로필 사진</label>
        <input
          type="file"
          id="profilePicture"
          onChange={handleFileChange}
          style={{ display: 'block', width: '100%', padding: '0.5rem', boxSizing: 'border-box', height: '100px' }}
        />
        {profilePicture && (
          <div>
            <p>Selected file preview:</p>
            <img
              src={profilePicture}
              alt="Profile Preview"
              style={{ maxWidth: '100%', height: 'auto', marginTop: '1rem' }}
            />
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="preferredGenres">선호 장르</label>
        <input
          type="text"
          id="preferredGenres"
          value={preferredGenres.join(', ')}
          onChange={(e) => setPreferredGenres(e.target.value.split(',').map(genre => genre.trim()))}
          style={{ display: 'block', width: '100%', padding: '0.5rem', boxSizing: 'border-box', height: '100px' }}
        />
      </div>

      <div className="form-group">
        <label htmlFor="additionalInfo">추가 설명</label>
        <textarea
          id="additionalInfo"
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          style={{ display: 'block', width: '100%', padding: '0.5rem', boxSizing: 'border-box', height: '100px' }}
        />
      </div>

      <button type="submit">저장</button>
      <button type="button" onClick={onClose}>취소</button>
    </form>
  );
};

export default ProfileForm;
