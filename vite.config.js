// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api/ncparcels': {
                target: 'https://services.nconemap.gov',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/ncparcels/, ''),
            },
        },
    },
});
