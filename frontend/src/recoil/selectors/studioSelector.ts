console.log('selector')

// import { selector } from 'recoil';
// import { studioListState } from './../atoms/studioAtom';
// import { userState } from '../atoms/userAtom';
// import { StudioType } from '../../types/StudioType';


// // 1. 현재 로그인된 유저의 정보를 기준으로 myStudioState 상태 변경=>로그인시 state 변경해주기
// export const myStudioSelector = selector<StudioType[]>({
//   key: 'myStudioSelector',
//   get: ({ get }) => {
//     const user = get(userState); // 로그인된 유저 정보
//     const studios = get(studioListState); // 전체 스튜디오 목록

//     // 로그인된 유저의 studioId에 해당하는 스튜디오 찾기
//     return studios.filter(studio => studio.studioId === user.studioId);
//   },
// });


// // 2. 내 스튜디오를 제외한 스튜디오들을 반영(현재 내가 참여중인)
// export const otherStudiosSelector = selector<StudioType[]>({
//   key: 'otherStudiosSelector',
//   get: ({ get }) => {
//     const user = get(userState); // 로그인된 유저 정보
//     const studios = get(studioListState); // 전체 스튜디오 목록

//     // 내 스튜디오를 제외한 스튜디오 목록 반환
//     return studios.filter(studio => studio.studioId !== user.studioId);
//   },
// });



//3.현재 내가 선택한 스튜디오
// export const selectedStudioSelector =  selector<StudioType[]>({
//   key : 'selectedStudio',
//   get : ({ get }) => {
//     const 
//   }
// })


//4.스튜디오 생성- 백엔드 코드 완료시 사용예정
// export const studioCreationSelector = selector({
//     key: 'studioCreationSelector',
//     get: () => {
//       throw new Error('studioCreationSelector is read-only');
//     },

//     set: async ({ get, set }, newStudio: StudioType) => {

//       const response = await fetch('https://your-backend-api.com/studios', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(newStudio),
//       });
  
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
  
//       const result = await response.json();
//       const currentStudioList = get(studioListState);
//       set(studioListState, [...currentStudioList, result]);
//     },
//   });
