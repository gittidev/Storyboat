// src/types/StudioType.ts
export interface StudioType {
  studioId: number;
  name: string;
  description: string;
}

export interface CharacterType{
  characterId : number;
  name :string;
  description : string;
  image? : string ;
}

export interface TeamData {
  name: string;
  role: string;
  date: string;
  invitation: string;
}

export interface TeamType {
  // teamName: string;
  members: MemberType[]; 
}


export interface MemberType {
  userId: number;
  penName: string;
  // name: string;
  regDate: string;
  setting : string;
  role: 'ROLE_OWNER' | 'ROLE_MEMBER' | 'ROLE_VIEWER' | 'ROLE_REQUESTER' | '팀장' | '팀원' | '편집자' | '참여 요청';
}

// export type TranslatedRole = '팀장' | '팀원' | '편집자' | '참여 요청';

export interface StoryType {
  storyId : number;
  content: string;
  title:string;
  lastModified: string | null;
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
  tags: {
    tagId: number;
    name: string;
    color: string;
  }[];
}