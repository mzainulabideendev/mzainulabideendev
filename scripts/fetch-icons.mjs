// Optional: swap the hand-drawn glyphs for the real Simple Icons paths.
// Run once on a machine with network access:  node scripts/fetch-icons.mjs && node scripts/build.mjs
// It reads each icon's SVG from the Simple Icons CDN and stores just the path data in assets/src/simple-icons.json.
import fs from 'node:fs';
import path from 'node:path';
import { SRC } from './lib.mjs';

const SLUGS = {
  react: 'react', dotnet: 'dotnet', csharp: 'csharp', angular: 'angular', flutter: 'flutter', firebase: 'firebase', mysql: 'mysql',
  sqlite: 'sqlite', cloudflare: 'cloudflare', python: 'python', typescript: 'typescript', javascript: 'javascript', git: 'git',
  github: 'github', kotlin: 'kotlin', vite: 'vite', mui: 'mui', html: 'html5', css: 'css3', java: 'openjdk',
  androidstudio: 'androidstudio', visualstudio: 'visualstudio', postman: 'postman', cpp: 'cplusplus', php: 'php',
  devto: 'devdotto', facebook: 'facebook', instagram: 'instagram', linkedin: 'linkedin',
};
const out = {};
for (const [key, slug] of Object.entries(SLUGS)) {
  try {
    const r = await fetch(`https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${slug}.svg`);
    if (!r.ok) { console.log('missing', slug, r.status); continue; }
    const m = (await r.text()).match(/<path d="([^"]+)"/);
    if (m) out[key] = m[1];
  } catch (e) { console.log('failed', slug, e.message); }
}
fs.writeFileSync(path.join(SRC, 'simple-icons.json'), JSON.stringify(out));
console.log('saved', Object.keys(out).length, 'icons');
