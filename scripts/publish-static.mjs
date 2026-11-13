import {cp,mkdir,writeFile} from 'node:fs/promises';
// Publish only generated public files; editable source remains untouched.
// Hashed bundles are immutable: retain them for tabs running the previous release.
await mkdir('assets',{recursive:true});
await cp('dist/assets','assets',{recursive:true});
for(const name of ['index.html','icon.svg','manifest.webmanifest','sw.js','apple-touch-icon.png','icon-192.png','icon-512.png'])await cp(`dist/${name}`,name);
await writeFile('.nojekyll','');
console.log('Versión compilada preparada en la raíz para GitHub Pages.');
