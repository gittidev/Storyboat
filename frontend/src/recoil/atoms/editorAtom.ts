import { atom } from 'recoil';

export const editorContentState = atom<string>({
  key: 'editorContentState', 
  default: '', 
});