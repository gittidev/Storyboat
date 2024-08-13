//사용자 프로필 페이지용, 유저 정보 조회
export interface ProfileType {
  penName: string;
  introduction: string;
  imageUrl: string;
  tags: {
    tagId: number;
    name: string;
    color: string;
  }[];
  privateStudio: {
    studioId: number;
    name: string;
    description: string;
  };
}

export interface UserType {
  id : string;
}
