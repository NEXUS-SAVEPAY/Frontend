// src/recoil/atoms/likedBrandsAtom.js
import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const likedBrandsAtom = atom({
    key: 'likedBrands',
    default: {},
    effects_UNSTABLE: [persistAtom],
});
