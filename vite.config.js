import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
    plugins: [react(), svgr()],
    server: {
        proxy: {
            '/api': {
                target: 'http://3.35.204.188:8080',
                changeOrigin: true,
                secure: false,
                rewrite: (p) => p.replace(/^\/api/, ''), // '/api/auth/me' -> '/auth/me'
            },
        },
    },
});
