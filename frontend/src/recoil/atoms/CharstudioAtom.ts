import { atom } from 'recoil';
import { CharacterType } from '../../types/StudioTypeChar';
// import { dummyStudios } from '../DummyDatas/dummyStudios';
// import { testUserType } from '../../types/TestUserType';
// import { dummyMyStory } from '../DummyDatas/dummyStudios';


// 테스트를 위한 유저 정보 => 로그인 시 로그인한 유저의 정보로 대체될 예정
// export const studioTestUserState = atom<testUserType>({
//   key: 'studioTestUserState',
//   default: {
//     username: "testUser",     // 테스트 사용자 이름
//     studioId: 1,              // 테스트 스튜디오 ID
//     userId: 11,            // 테스트 사용자 ID
//     penName: "Test Pen Name", // 테스트 필명
//   },
// });


//팀 Atom
// export const teamState = atom<TeamType[]>({
//   key: 'teamState',
//   default: [],
// });




// // 나의 스튜디오
// export const myStudioState = atom<string | number>({
//   key: 'myStudioState',
//   default: '',
// });



// // 현재 스튜디오의 목록들
// export const studioListState = atom<StudioType[]>({
//   key: 'studioListState',
//   default: [],
// });



// // 선택된 스튜디오의 정보
// export const selectedStudioState = atom<string | number>({
//   key: 'selectedStudioState',
//   default: '',
// });




// //내 스튜디오를 제외한 스튜디오=>스튜디오 전환 목록에 들어감
// export const otherStudioState = atom<StudioType[]>({
//   key: 'otherStudioState',
//   default : [],
// })



//캐릭터 Atom
export const myCharState = atom<CharacterType[]>({
  key: 'myCharState',
  default: [],
});

//캐릭터 Atom
export const charState = atom<CharacterType[]>({
  key: 'charState',
  default: [],
});

