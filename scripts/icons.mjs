// Brand glyphs, each drawn in a 24x24 box centred on (0,0).
// If assets/src/simple-icons.json exists ({ "react": "M14.23 12.004...", ... } = Simple Icons path data),
// the real Simple Icons path is used instead of the hand-drawn glyph. Run `node scripts/fetch-icons.mjs` once
// on a machine with network access to create it.
import fs from 'node:fs';
import path from 'node:path';
import { SRC } from './lib.mjs';

export const BRAND = {
  react: '#61dafb', dotnet: '#8f6bf2', csharp: '#b86bd6', angular: '#ff3a52', flutter: '#54c5f8', firebase: '#ffb300',
  mysql: '#2aa3c4', sqlite: '#4aa8e0', cloudflare: '#f6821f', python: '#ffd43b', typescript: '#3b8be0', javascript: '#f7df1e',
  git: '#f05133', github: '#e8eaf6', kotlin: '#a07bff', vite: '#a78bfa', mui: '#2b8fff', html: '#e34f26', css: '#1e8bd6',
  java: '#f89820', androidstudio: '#3ddc84', vscode: '#2aa0ec', visualstudio: '#9b6fd8', postman: '#ff6c37', cpp: '#3b9be0',
  php: '#8f94d6', website: '#22d3ee', linkedin: '#3b9bf0', instagram: '#f472b6', devto: '#e8eaf6', vsmarket: '#9b6fd8', facebook: '#4a90ff',
};
export const LABEL = {
  react: 'React', dotnet: '.NET', csharp: 'C#', angular: 'Angular', flutter: 'Flutter', firebase: 'Firebase', mysql: 'MySQL', sqlite: 'SQLite',
  cloudflare: 'Cloudflare', python: 'Python', typescript: 'TypeScript', javascript: 'JavaScript', git: 'Git', github: 'GitHub', kotlin: 'Kotlin',
  vite: 'Vite', mui: 'MUI', html: 'HTML5', css: 'CSS3', java: 'Java', androidstudio: 'Android Studio', vscode: 'VS Code',
  visualstudio: 'Visual Studio', postman: 'Postman', cpp: 'C++', php: 'PHP',
};

let SI = {};
try { SI = JSON.parse(fs.readFileSync(path.join(SRC, 'simple-icons.json'), 'utf8')); } catch { /* hand-drawn fallback */ }

const tile = (fill, r = 5) => `<rect x="-12" y="-12" width="24" height="24" rx="${r}" fill="${fill}"/>`;
const txt = (s, size, fill = '#fff', y = 0) => `<text class="mb" text-anchor="middle" y="${y + size * .35}" font-size="${size}" fill="${fill}">${s}</text>`;

const G = {
  react: () => `<g fill="none" stroke="#61dafb" stroke-width="1.35"><ellipse rx="10.5" ry="4.2"/><ellipse rx="10.5" ry="4.2" transform="rotate(60)"/><ellipse rx="10.5" ry="4.2" transform="rotate(120)"/></g><circle r="2" fill="#61dafb"/>`,
  dotnet: () => tile('#512bd4') + txt('.NET', 8.6),
  csharp: () => tile('#7a2a9a') + txt('C#', 11),
  angular: () => `<path d="M0-11.5 10.5-8 9 6.5 0 11.5-9 6.5-10.5-8Z" fill="#dd0031"/><path d="M0-6.6-5.6 5.6h2.1l1.1-2.8h4.8l1.1 2.8h2.1Zm0 4.1 1.5 3.8h-3Z" fill="#fff" fill-rule="evenodd"/>`,
  flutter: () => `<path d="M3-11.5h8.5L-6.5 6.5-11 2Z" fill="#54c5f8"/><path d="M3 0.5h8.5L5 7l-4.5 4.5L-4 7Z" fill="#54c5f8"/><path d="M-4 7l4.5-4.5L5 7 .5 11.5Z" fill="#01579b"/>`,
  firebase: () => `<defs><linearGradient id="ifb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffca28"/><stop offset="1" stop-color="#f57c00"/></linearGradient></defs><path d="M-8 8.5-5.2-10.5-1.8-3.6 1.4-11 8 8.5 0 12Z" fill="url(#ifb)"/><path d="M-8 8.5-1.4 1.5 1.6 4.6 0 12Z" fill="#ff8f00" opacity=".75"/>`,
  mysql: () => tile('#00758f') + txt('SQL', 8.4),
  sqlite: () => tile('#0f80cc') + txt('SQ', 9.5),
  cloudflare: () => `<g fill="#f6821f"><circle cx="-4.6" cy="2" r="4.4"/><circle cx="1.6" cy="-1.4" r="6"/><circle cx="7" cy="3" r="3.9"/><rect x="-9" y="2" width="20" height="5.4" rx="2.6"/></g>`,
  python: () => `<rect x="-10.5" y="-10.5" width="12.5" height="12.5" rx="4.2" fill="#3776ab"/><rect x="-2" y="-2" width="12.5" height="12.5" rx="4.2" fill="#ffd43b"/><circle cx="-6" cy="-6" r="1.3" fill="#fff"/><circle cx="6" cy="6" r="1.3" fill="#3776ab"/>`,
  typescript: () => tile('#3178c6', 4) + txt('TS', 10.5),
  javascript: () => tile('#f7df1e', 4) + txt('JS', 10.5, '#111'),
  git: () => `<rect x="-7.6" y="-7.6" width="15.2" height="15.2" rx="2.6" transform="rotate(45)" fill="#f05133"/><g stroke="#fff" stroke-width="1.5" fill="none"><path d="M-1-4v8M-1-.5 3.4-4"/></g><g fill="#fff"><circle cx="-1" cy="-4.2" r="1.6"/><circle cx="-1" cy="4.2" r="1.6"/><circle cx="3.6" cy="-.6" r="1.6"/></g>`,
  github: () => `<circle r="11" fill="#e8eaf6"/><path d="M-5.2-2.2v-4.4L-2.4-4.6h4.8L5.2-6.6v4.4C6.4 3.6 3.4 6.6 0 6.6S-6.4 3.6-5.2-2.2Z" fill="#0d0e16"/>`,
  kotlin: () => `<defs><linearGradient id="ikt" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#e44857"/><stop offset=".5" stop-color="#c711e1"/><stop offset="1" stop-color="#7f52ff"/></linearGradient></defs><path d="M-11-11H11L0 0 11 11H-11Z" fill="url(#ikt)"/>`,
  vite: () => `<defs><linearGradient id="ivt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#41d1ff"/><stop offset="1" stop-color="#bd34fe"/></linearGradient></defs><path d="M-11-10 0 11 11-10 0-7.4Z" fill="url(#ivt)"/><path d="M5-10 .4-1.6-.8-1.6l1.2 6.2 5.2-10.4Z" fill="#ffd34d" transform="translate(-.4 0)"/>`,
  mui: () => tile('#007fff') + txt('MUI', 7.4),
  html: () => `<path d="M-9.5-10.5h19l-1.6 18.8L0 11l-7.9-2.7Z" fill="#e34f26"/>` + txt('5', 11, '#fff', 0),
  css: () => `<path d="M-9.5-10.5h19l-1.6 18.8L0 11l-7.9-2.7Z" fill="#1572b6"/>` + txt('3', 11, '#fff', 0),
  java: () => `<circle r="11" fill="#f89820"/>` + txt('J', 12, '#fff'),
  androidstudio: () => `<circle r="11" fill="#3ddc84"/>` + txt('AS', 9, '#0d0e16'),
  vscode: () => tile('#007acc', 4) + txt('VS', 9.5),
  visualstudio: () => tile('#5c2d91', 4) + txt('VS', 9.5),
  postman: () => `<circle r="11" fill="#ff6c37"/>` + txt('P', 12),
  cpp: () => tile('#00599c', 4) + txt('C++', 8.6),
  php: () => `<ellipse rx="12" ry="8" fill="#777bb4"/>` + txt('php', 7.6),
  website: () => `<g fill="none" stroke="#22d3ee" stroke-width="1.6"><circle r="10"/><ellipse rx="4.2" ry="10"/><path d="M-10 0h20M-8.6-5h17.2M-8.6 5h17.2"/></g>`,
  linkedin: () => tile('#0a66c2', 5) + txt('in', 12.5),
  instagram: () => `<defs><linearGradient id="iig" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#fdc468"/><stop offset=".5" stop-color="#df4996"/><stop offset="1" stop-color="#7a4cff"/></linearGradient></defs><rect x="-10.5" y="-10.5" width="21" height="21" rx="6.2" fill="none" stroke="url(#iig)" stroke-width="2"/><circle r="4.6" fill="none" stroke="url(#iig)" stroke-width="2"/><circle cx="6.4" cy="-6.4" r="1.4" fill="#df4996"/>`,
  devto: () => tile('#111', 5) + `<rect x="-11.5" y="-11.5" width="23" height="23" rx="4.6" fill="none" stroke="#e8eaf6" stroke-width="1"/>` + txt('DEV', 7.4),
  vsmarket: () => tile('#5c2d91', 5) + `<path d="M-6 3-1-6 .6 1.6 6-3.6" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity=".0"/>` + txt('VS', 9.5),
  facebook: () => `<circle r="11" fill="#1877f2"/>` + `<path d="M2.4 11V3.6h2.5l.4-3H2.4V-1.3c0-.9.3-1.4 1.5-1.4h1.5v-2.7a20 20 0 0 0-2.2-.1C1-5.5-.5-4.1-.5-1.6V.6H-3v3h2.5V11Z" fill="#fff"/>`,
};

/** glyph markup centred at (0,0) in a 24x24 box */
export function glyph(name) {
  if (SI[name]) return `<g transform="translate(-12 -12)"><path d="${SI[name]}" fill="${BRAND[name] ?? '#fff'}"/></g>`;
  return (G[name] ?? (() => tile('#444') + txt('?', 11)))();
}
