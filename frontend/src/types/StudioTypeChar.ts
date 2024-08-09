// src/types/StudioType.ts
export interface StudioType {
  studioId: number;
  name: string;
  description: string;
}

export interface CharacterType{
  id: number;               // 캐릭터의 고유 ID
  name: string;            // 캐릭터의 이름
  description: string;     // 캐릭터의 설명
  imageUrl: string;        // 캐릭터 이미지의 URL (필드 이름 수정)
  tags?: string[];         // 캐릭터에 대한 태그 (선택적 필드)
}

export interface TeamData {
  name: string;
  role: string;
  date: string;
  invitation: string;
}

export interface TeamType {
  teamName: string;
  members: MemberType[]; 
}


export interface MemberType {
  userId: number;
  name: string;
  role: '팀장' | '팀원' | '편집자';
}

export interface StoryType {
  storyId : number;
  title: string;
  lastmodified: string;
}

export interface IdeaType {
  ideaId : number;
  title: string;
  content: string;
}

// src/types/UserType.ts
export interface UserType {
  studioId: number;
  username: string;
  userId: number;
  penName: string;
  introduction: string;
  imageUrl: string | null;
}

export interface FindTeamType {
  invitationId: number;
  studioId:number;
  title : string;
  description : string;
  tags : string;
}