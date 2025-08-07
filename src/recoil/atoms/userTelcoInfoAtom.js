// recoil/atoms/userTelcoInfoAtom.js
import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const userTelcoInfoAtom = atom({
    key: 'userTelcoInfo',
    default: {
        telco: '',
        hasMembership: null,
        grade: '',
    },
    effects_UNSTABLE: [persistAtom],
});
