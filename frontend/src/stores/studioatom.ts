import { atom } from 'recoil';

export const selectedStudioState = atom<string | number>({
  key: 'selectedStudioState',
  default: '',
});
