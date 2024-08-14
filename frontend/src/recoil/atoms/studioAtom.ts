import { atom } from 'recoil';
import { StudioType,  MemberType, IdeaType, StoryType, FindTeamType } from '../../types/StudioType';
import { Character } from '../../types/Chartype';

//팀 Atom
export const teamState = atom({
  key: 'teamState',
  default: [] as MemberType[], // 빈 배열로 초기화, MemberType으로 타입 설정
});




// 나의 스튜디오
export const myStudioState = atom<string | number>({
  key: 'myStudioState',
  default: '',
});



// 현재 스튜디오의 목록들
export const studioListState = atom<StudioType[]>({
  key: 'studioListState',
  default: [],
});



// 선택된 스튜디오의 정보
export const selectedStudioState = atom<string | number>({
  key: 'selectedStudioState',
  default: '',
});




//내 스튜디오를 제외한 스튜디오=>스튜디오 전환 목록에 들어감
export const otherStudioState = atom<StudioType[]>({
  key: 'otherStudioState',
  default : [],
})


// 내 스토리 Atom=============================================================
export const myStoryState = atom<StoryType[]>({
  key: 'myStoryState',
  default: [],
});

// 팀 스토리 Atom
export const storyState = atom<StoryType[]>({
  key: 'storyState',
  default: [],
});



//팀 아이디어 Atom
export const ideaState = atom<IdeaType[]>({
  key: 'ideaState',
  default: [],
});

//팀 수정 아이디어 Atom
export const editIdeaState = atom<IdeaType | null>({
  key: 'editIdeaState',
  default: null,
});

//내 아이디어 Atom
export const myIdeaState = atom<IdeaType[]>({
  key: 'myIdeaState',
  default: [],
});





// 모든 캐릭터 목록 Atom
export const charactersState = atom<Character[]>({
  key: 'charactersState',
  default: [],
});

// 선택된 캐릭터 Atom
export const selectedCharacterState = atom<Character | null>({
  key: 'selectedCharacterState',
  default: null,
});


// 팀찾기 Atom
export const findTeamState = atom<FindTeamType[]>({
  key : 'findTeamState',
  default: [],
})

// 팀찾기 Atom
export const findTeamDetailState = atom<FindTeamType>({
  key: 'findTeamDetailState',
  default: {
    invitationId: 0,
    studioId: 0,
    title: '',
    description: '',
    tags: [],
  },
});