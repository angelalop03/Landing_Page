// El sitio es estático: el "build" solo copia los archivos publicables a dist/ para Vercel.
import { cpSync, mkdirSync, rmSync } from 'node:fs';

const FILES = ['index.html', 'main.js', 'content.js', 'style.css', 'cv.pdf'];

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist');
for (const f of FILES) cpSync(f, `dist/${f}`);
console.log(`dist/ listo (${FILES.length} archivos)`);
