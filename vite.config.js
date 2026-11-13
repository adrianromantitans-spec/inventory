import {defineConfig} from 'vite';
import tailwindcss from '@tailwindcss/vite';
// Keep a compiled root index for branch-based Pages and a separate source entry.
const entry={
  name:'aura-html-entry',
  configureServer(server){server.middlewares.use((req,_res,next)=>{if(req.url?.split('?')[0]==='/inventory/'||req.url?.split('?')[0]==='/')req.url=req.url.replace(/\/$/,'/application.html');next()})},
};
export default defineConfig({base:'/inventory/',plugins:[entry,tailwindcss()],build:{rollupOptions:{input:'application.html',output:{assetFileNames:asset=>asset.names?.some(name=>name.endsWith('.mjs'))?'assets/[name]-[hash].js':'assets/[name]-[hash][extname]',manualChunks:{charts:['recharts'],motion:['motion/react']}}}}});
