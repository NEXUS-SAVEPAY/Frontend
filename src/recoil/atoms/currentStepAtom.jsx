import { atom } from 'recoil';

export const currentStepAtom = atom({
    key: 'currentStepAtom',
    default: 1, // 초기 단계는 1
});
