import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const cardCompanyAtom = atom({
    key: 'cardCompanyAtom',
    default: '',
    effects_UNSTABLE: [persistAtom],
});

export const cardNameAtom = atom({
    key: 'cardNameAtom',
    default: '',
    effects_UNSTABLE: [persistAtom],
});

export const searchResultAtom = atom({
    key: 'searchResultAtom',
    default: [],
    effects_UNSTABLE: [persistAtom],
});

export const registeredCardsAtom = atom({
    key: 'registeredCardsAtom',
    default: [],
    effects_UNSTABLE: [persistAtom],
});

export const showDeleteModalAtom = atom({
    key: 'showDeleteModalAtom',
    default: false,
    effects_UNSTABLE: [persistAtom],
});

export const pendingDeleteCardAtom = atom({
    key: 'pendingDeleteCardAtom',
    default: null,
    effects_UNSTABLE: [persistAtom],
});
