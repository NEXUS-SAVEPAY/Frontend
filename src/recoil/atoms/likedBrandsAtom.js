// src/recoil/atoms/likedBrandsAtom.js
import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const likedBrandsAtom = atom({
    key: 'likedBrands',
    default: {
        '올리브영': true,
        '스타벅스': true,
        '맥도날드': true,
        '메가박스': true,
    },
    effects_UNSTABLE: [persistAtom],
});
