import {defineConfig} from 'vite';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({base:'/inventory/',plugins:[tailwindcss()],build:{rollupOptions:{output:{manualChunks:{charts:['recharts'],motion:['motion/react']}}}}});
