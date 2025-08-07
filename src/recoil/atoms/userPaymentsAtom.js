// recoil/atoms/userPaymentsAtom.js
import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const userPaymentsAtom = atom({
    key: 'userPaymentsAtom',
    default: '',
    effects_UNSTABLE: [persistAtom],
});
