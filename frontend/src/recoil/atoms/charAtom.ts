// src/recoil/atoms/charAtom.ts

import { atom } from 'recoil';
import { Character } from '../../types/Chartype';

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
