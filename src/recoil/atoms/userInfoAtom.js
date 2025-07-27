import { atom } from 'recoil';

export const userTelcoInfoAtom = atom({
    key: 'userTelcoInfo',
    default: {
        telco: '',
        hasMembership: null,
        grade: '',
    },
});
