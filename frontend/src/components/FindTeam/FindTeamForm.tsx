import React, { useState } from 'react'
import CustomButton from '../Commons/CustomButton';
import { TextField } from '@mui/material';
import { FindTeamType } from '../../types/StudioType';
import { useRecoilState, useRecoilValue } from 'recoil';
import { findTeamState } from '../../recoil/atoms/studioAtom';
// import { fetchRefreshToken } from '../../apis/auth';
import axios from 'axios';
import { fetchFindteams } from '../../utils/studioUtils';
import { selectedStudioState } from '../../recoil/atoms/studioAtom';
import { accessTokenState } from '../../recoil/atoms/authAtom';
// import { Tag } from './Tag'
const svURL = import.meta.env.VITE_SERVER_URL;
interface FindTeamFormProps {
  onSave : (findteam : FindTeamType) => void;
  onClose: () => void;
}

const FindTeamForm: React.FC<FindTeamFormProps> = ({ onSave, onClose }) => {
  const [findTeamList, setfindTeamList] = useRecoilState<FindTeamType[]>(findTeamState)
  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [tags, setTags] = useState<string>("")
  const [loading, setLoading] = useState(false);

  // const setFindteams = useSetRecoilState(findTeamState)
  const studioId = useRecoilState(selectedStudioState)[0];
  const accessToken = useRecoilValue(accessTokenState);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true)
    const newFindteam = {
      title,
      description,
      tags,
      studioId
    };

    try {
      console.log('findteam access:', accessToken)
      console.log(studioId)

      const response = await axios.post(`${svURL}/api/invitations/${studioId}`, newFindteam, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization':  `Bearer ${accessToken}`
        }
      })

      const data = response.data;

      setfindTeamList([...findTeamList, data])

      if (onSave) {
        onSave(data);
      }

      fetchFindteams(accessToken, setfindTeamList)

      onClose()
    }catch(error){
      console.error('팀찾기 게시글 생성 중 오류 발생')
    }
    setLoading(false);

  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1rem' }}>

        <TextField
          required
          id="outlined-required"
          label="제목"
          placeholder='게시글 제목을 작성하세요'
          sx={{ marginBottom: '15px', width: '100%' }}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>

        <TextField
          required
          id="outlined-required"
          label="태그"
          placeholder='태그를 작성하세요'
          sx={{ marginBottom: '15px', width: '100%' }}
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <TextField
          required
          id="outlined-multiline-static"
          label="내용"
          multiline
          rows={4}
          placeholder='내용을 작성하세요'
          sx={{ marginBottom: '15px', width: '100%' }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>

        <CustomButton type="submit" content="생성하기" bgcolor='lightgreen' hoverBgColor='green' disabled={loading} width='' />
        <CustomButton type="button" content="취소하기" bgcolor='gray' hoverBgColor='red' onClick={onClose} />
        {loading && <p>저장 중...</p>}
      </div>

    </form>
  )
}

export default FindTeamForm