// Builds every SVG into assets/ and the README. Usage: node scripts/build.mjs [hero|about|stack|id|connect|readme]
import { write } from './lib.mjs';

const only = process.argv[2];
const jobs = {
  hero: async () => write('assets/hero.svg', (await import('./hero.mjs')).hero()),
  about: async () => write('assets/about-life.svg', (await import('./about.mjs')).about()),
  stack: async () => write('assets/stack.svg', (await import('./stack.mjs')).stack()),
  id: async () => write('assets/id-dashboard.svg', (await import('./id.mjs')).idDashboard()),
  connect: async () => write('assets/connect.svg', (await import('./connect.mjs')).connect()),
  readme: async () => (await import('./readme.mjs')).readme(),
};
for (const [k, fn] of Object.entries(jobs)) {
  if (only && only !== k) continue;
  try {
    const f = await fn();
    console.log('built', k, f ? `-> ${f}` : '');
  } catch (e) {
    const keepExistingHero = k === 'hero'
      && e.code === 'ENOENT'
      && e.path === path.join(ROOT, 'assets', 'src', 'frames')
      && fs.existsSync(path.join(ROOT, 'assets', 'hero.svg'));
    if (keepExistingHero) {
      console.log('skip hero (source frames unavailable; keeping existing assets/hero.svg)');
      continue;
    }
    if (only || !/Cannot find module/.test(String(e.message))) { console.error('FAILED', k, e); process.exitCode = 1; }
    else console.log('skip', k, '(not written yet)');
  }
}

// ---- well-formedness check for every generated SVG ----
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { ROOT } from './lib.mjs';
const dir = path.join(ROOT, 'assets');
for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.svg'))) {
  try { if (!fs.existsSync('/usr/bin/xmllint') && !fs.existsSync('/usr/local/bin/xmllint')) { console.log('xmllint not found, skipping XML check'); break; } execFileSync('xmllint', ['--noout', path.join(dir, f)], { stdio: 'pipe' }); console.log('xml ok', f, Math.round(fs.statSync(path.join(dir, f)).size / 1024) + 'KB'); }
  catch (e) { console.error('XML ERROR in', f, String(e.stderr || e.message).slice(0, 400)); process.exitCode = 1; }
}
