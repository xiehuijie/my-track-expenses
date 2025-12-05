import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import UnoCSS from '@unocss/vite';
import { resolve } from 'path';
import { appVersion } from './version';

export default defineConfig({
    plugins: [vue(), UnoCSS()],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
    define: {
        __APP_VERSION__: JSON.stringify(appVersion),
    },
    optimizeDeps: {
        exclude: ['sql.js'],
    },
    server: {
        // Enable network access for remote debugging from other devices
        host: true,
        // Default port (can be overridden via CLI or env)
        port: 5173,
        // Enable CORS for remote connections
        cors: true,
    },
    // Enable source maps in development for better debugging experience
    css: {
        devSourcemap: true,
    },
});
