import {cp,mkdir,writeFile,rm} from 'node:fs/promises';
// Publish only generated public files; editable source remains untouched.
await rm('assets',{recursive:true,force:true});
await mkdir('assets',{recursive:true});
await cp('dist/assets','assets',{recursive:true});
for(const name of ['index.html','icon.svg','manifest.webmanifest','sw.js'])await cp(`dist/${name}`,name);
await writeFile('.nojekyll','');
console.log('Versión compilada preparada en la raíz para GitHub Pages.');
