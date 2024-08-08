import { atom } from 'recoil';
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({});

// 엑세스 토큰 string으로 저장
export const accessTokenState = atom<string>({
  key: 'accessTokenState',
  default: '',
  effects_UNSTABLE: [persistAtom],
});

// 리프레쉬 토큰==로그인 상태
// export const refreshTokenState = atom<string>({
//   key: 'refreshTokenState',
//   default: '',
//   effects_UNSTABLE: [persistAtom],
// });
export const refreshTokenState = atom<boolean>({
  key: 'refreshTokenState',
  default: false,
  effects_UNSTABLE: [persistAtom],
});

// 권한 상태(승인)
export const authState = atom<boolean>({
  key: 'authState',
  default: false,
  effects_UNSTABLE: [persistAtom],
});
