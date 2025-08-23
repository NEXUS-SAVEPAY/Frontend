import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist(); // localStorage 자동 저장

export const authAtom = atom({
    key: 'auth',
    default: {
        isAuthed: false,
        accessToken: null,
        refreshToken: null,
        user: null, // 필요 시 /me로 채워넣기
    },
    effects_UNSTABLE: [persistAtom],
});
