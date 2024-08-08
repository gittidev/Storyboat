import { atom } from 'recoil';
import { UserType } from '../../types/UserType';


export const userState = atom<UserType | null>({
    key: 'UserState',
    default: null,
});