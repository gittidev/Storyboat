import React, { useState } from 'react';
import { Profile } from './ProfileData';
// import { useForm, SubmitHandler } from 'react-hook-form';
import './ProfileForm.css';

// interface ProfileFormProps {
//   onSave : (profile : Profile) => void;
// }

interface ProfileFormProps {
  onSave: (profile: Profile) => void;
  onClose: () => void;
}

// interface Profile  {
//   penName: string;
//   profilePicture: FileList;
//   preferredGenres: string;
//   additionalInfo: string;
// }

const ProfileForm: React.FC<ProfileFormProps> = ({onSave}) => {
  const [penName, setpenName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [preferredGenres, setPreferredGenres] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState<string>('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // const profile: Profile = { penName, profilePicture, preferredGenres, additionalInfo };
    const profile: Profile = {  penName, email, profilePicture, preferredGenres, additionalInfo };
    onSave(profile);
    setpenName('');
    setEmail('');
    setProfilePicture(null);
    setPreferredGenres([]);
    setAdditionalInfo('');
  };

  // const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>();

  // const onSubmit: SubmitHandler<ProfileFormValues> = (data) => {
  //   console.log(data);
  //   // 폼 데이터를 서버로 전송하는 로직을 여기에 추가
  // };

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      <div className="form-group">
        <label htmlFor="penName">필명</label>
        <input 
        type="text"
        id="penName" 
        onChange={(e) => setpenName(e.target.value)}
        style={{ display: 'block', width: '100%', padding: '0.5rem', boxSizing: 'border-box', height: '100px' }}
        />
        {/* {errors.penName && <span className="error">필명이 필요합니다.</span>} */}
      </div>

      <div className="form-group">
        <label htmlFor="profilePicture">프로필 사진</label>
        <input 
        type="file" 
        id="profilePicture" 
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            // setprofilePicture(e.target.files[0]);
          }
        }}
        style={{ display: 'block', width: '100%', padding: '0.5rem', boxSizing: 'border-box', height: '100px' }}
        />
        {/* {errors.profilePicture && <span className="error">프로필 사진이 필요합니다.</span>} */}
      </div>

      <div className="form-group">
        <label htmlFor="preferredGenres">선호 장르</label>
        <input 
        type="text" 
        id = 'preferredGenres'
        value = {preferredGenres}
        // onChange={(e) => setPreferredGenres(e.target.value)}
        onChange={(e) => setPreferredGenres(e.target.value.split(',').map(genre => genre.trim()))}
        style={{ display: 'block', width: '100%', padding: '0.5rem', boxSizing: 'border-box', height: '100px' }}
        />
        {/* {errors.preferredGenres && <span className="error">선호 장르가 필요합니다.</span>} */}
      </div>

      <div className="form-group">
        <label htmlFor="additionalInfo">추가 설명</label>
        <textarea 
        id="additionalInfo" 
        value = {additionalInfo}
        onChange={(e) => setAdditionalInfo(e.target.value)}
        style={{ display: 'block', width: '100%', padding: '0.5rem', boxSizing: 'border-box', height: '100px' }}
        />
      </div>

      <button type="submit">저장</button>
    </form>
  );
};

export default ProfileForm;