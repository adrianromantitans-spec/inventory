import {rename,cp,access} from 'node:fs/promises';
await rename('dist/application.html','dist/index.html');
// Pages Actions deploys dist; branch-based Pages deploys the repository root.
// Both must keep immutable modules referenced by already-open tabs.
try{await access('assets')}catch(error){if(error.code!=='ENOENT')throw error;process.exit(0)}
await cp('assets','dist/assets',{recursive:true,force:false,errorOnExist:false});
