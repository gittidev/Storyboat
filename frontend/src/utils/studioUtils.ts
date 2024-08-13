import axios from 'axios';
const svURL = import.meta.env.VITE_SERVER_URL;
import { StudioType, FindTeamType, IdeaType,  MemberType } from '../types/StudioType'; // StudioType이 정의된 경로로 대체하세요
export const fetchStudios = async (accessToken: string|null, setStudios: (studios: StudioType[]) => void): Promise<void> => {
  try {
    const response = await axios.get<{ data: StudioType[] }>(`${svURL}/api/studios`, {
      headers: {
        'Authorization':  `Bearer ${accessToken}`
      },
    });
    setStudios(response.data.data);
  } catch (error) {
    console.error('스튜디오 데이터를 가져오는 데 실패했습니다:', error);
  }
};

export const fetchIdeas = async(accessToken: string|null, studoId :string|number, setIdeas: (ideas: IdeaType[]) => void): Promise<void> => {
  try {
    const response = await axios.get<{ data: IdeaType[] }>(`${svURL}/api/studios/${studoId}/ideas`, {
      headers: {
        'Authorization':  `Bearer ${accessToken}`,
      },
    });
    setIdeas(response.data.data);
  } catch (error) {
    console.error('아이디어 데이터를 가져오는 데 실패했습니다:', error);
  }
};

export const fetchFindteams = async(accessToken: string|null, setFindteams: (findTeams: FindTeamType[]) => void): Promise<void> => {
  try {
    const response = await axios.get<{ data: FindTeamType[] }>(`${svURL}/api/invitations`, {
      headers: {
        'Authorization':  `Bearer ${accessToken}`,
      },
    });
    setFindteams(response.data.data);
  } catch (error) {
    console.error('아이디어 데이터를 가져오는 데 실패했습니다:', error);
  }
};

export const fetchteams = async (accessToken: string|null, studoId :string|number, setTeams:(teams:MemberType[])=>void):Promise<void> => {
  try {
      const response = await axios.get<{ data: MemberType[] }>(
          `${svURL}/api/studios/${studoId}/members`,
          {
              headers: {
                  'Authorization': `Bearer ${accessToken}`,
              }
          }
      );
      // console.log(response.data.data)
      const updatedTeams = response.data.data.map(team => ({
        ...team,
        role: team.role === 'ROLE_REQUESTER' ? '참여 요청' 
              : team.role === 'ROLE_MEMBER' ? '팀원' 
              : team.role === 'ROLE_VIEWER' ? '편집자' 
              : team.role === 'ROLE_OWNER' ? '팀장' 
              : team.role,
        regDate: team.regDate.slice(0, 10),
      }));
  
      setTeams(updatedTeams);
  } catch (error) {
      console.log('팀원 조회 실패')
  }
}

export const updateInvitationStatus = async (accessToken: string|null, studioId: string|number, userId: number, decision: 'accept' | 'rejection') => {
  try {
    await axios.put(`${svURL}/api/studios/${studioId}/join-requests/${userId}`, {decision}, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('참여 요청 수락');
  } catch (error) {
    console.error('참여 요청 거절', error);
  }
};

export const updateRole = async (accessToken: string|null, studioId: string|number, userId: number, role: 'ROLE_MEMBER' | 'ROLE_VIEWER') => {
  try {
    await axios.put(`${svURL}/api/studios/${studioId}/members/${userId}/roles`, {role}, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('팀원 역할 업데이트 성공');
  } catch (error) {
    console.error('팀원 역할 업데이트 실패:', error);
  }
};