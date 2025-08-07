import { atom } from 'recoil';

export const cardCompanyAtom = atom({
    key: 'cardCompanyAtom',
    default: '',
});

export const cardNameAtom = atom({
    key: 'cardNameAtom',
    default: '',
});

export const searchResultAtom = atom({
    key: 'searchResultAtom',
    default: [],
});

export const registeredCardsAtom = atom({
    key: 'registeredCardsAtom',
    default: [],
});

export const showDeleteModalAtom = atom({
    key: 'showDeleteModalAtom',
    default: false,
});

export const pendingDeleteCardAtom = atom({
    key: 'pendingDeleteCardAtom',
    default: null,
});
