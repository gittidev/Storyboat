import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import './ProfileForm.css';

type ProfileFormValues = {
  penName: string;
  profilePicture: FileList;
  preferredGenres: string;
  additionalInfo: string;
};

const ProfileForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>();

  const onSubmit: SubmitHandler<ProfileFormValues> = (data) => {
    console.log(data);
    // 폼 데이터를 서버로 전송하는 로직을 여기에 추가
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="profile-form">
      <div className="form-group">
        <label htmlFor="penName">필명</label>
        <input id="penName" {...register('penName', { required: true })} />
        {errors.penName && <span className="error">필명이 필요합니다.</span>}
      </div>

      {/* <div className="form-group">
        <label htmlFor="profilePicture">프로필 사진</label>
        <input type="file" id="profilePicture" {...register('profilePicture', { required: true })} />
        {errors.profilePicture && <span className="error">프로필 사진이 필요합니다.</span>}
      </div> */}

      <div className="form-group">
        <label htmlFor="preferredGenres">선호 장르</label>
        <input id="preferredGenres" {...register('preferredGenres', { required: true })} />
        {errors.preferredGenres && <span className="error">선호 장르가 필요합니다.</span>}
      </div>

      <div className="form-group">
        <label htmlFor="additionalInfo">추가 설명</label>
        <textarea id="additionalInfo" {...register('additionalInfo')} />
      </div>

      <button type="submit">저장</button>
    </form>
  );
};

export default ProfileForm;