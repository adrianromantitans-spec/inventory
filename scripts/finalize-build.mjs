import {rename} from 'node:fs/promises';
await rename('dist/application.html','dist/index.html');
