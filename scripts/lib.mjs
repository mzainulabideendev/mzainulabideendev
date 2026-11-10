// Shared helpers for every SVG: fonts, midnight-glass card, gradients, SMIL helpers.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const SRC = path.join(ROOT, 'assets', 'src');
export const C = { bg: '#0d0e16', cyan: '#22d3ee', violet: '#a78bfa', pink: '#f472b6', text: '#e8eaf6', mut: '#8b90aa', dim: '#5b6080' };
export const P = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'profile.json'), 'utf8'));
export const REPOS = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'repos.json'), 'utf8'));
const metrics = JSON.parse(fs.readFileSync(path.join(SRC, 'fonts', 'metrics.json'), 'utf8'));

export const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const f2 = n => Math.round(n * 100) / 100;
export const f4 = n => Math.round(n * 10000) / 10000;
export const b64 = f => fs.readFileSync(f).toString('base64');
export const dataUri = (rel, mime) => `data:${mime};base64,${b64(path.join(SRC, rel))}`;

/** text width in px: font is display | body | mono | monob */
export function tw(font, s, size, ls = 0) {
  let w = 0;
  for (const ch of s) w += (metrics[font][ch] ?? 0.6) * size + ls;
  return w;
}

export function fontCss() {
  const F = (fam, w, file) =>
    `@font-face{font-family:'${fam}';font-weight:${w};font-style:normal;src:url(data:font/woff2;base64,${b64(path.join(SRC, 'fonts', file))}) format('woff2');}`;
  return F('ZD', 700, 'display.woff2') + F('ZB', 500, 'body.woff2') + F('ZM', 400, 'mono.woff2') + F('ZM', 700, 'monob.woff2');
}

export const COMMON_CSS = `
text{text-rendering:geometricPrecision}
.d{font-family:ZD,Poppins,'Segoe UI',Arial,sans-serif;font-weight:700}
.b{font-family:ZB,Poppins,'Segoe UI',Arial,sans-serif;font-weight:500}
.m{font-family:ZM,'DejaVu Sans Mono',Consolas,monospace;font-weight:400}
.mb{font-family:ZM,'DejaVu Sans Mono',Consolas,monospace;font-weight:700}
@keyframes rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideL{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.rise{animation:rise .9s cubic-bezier(.2,.8,.2,1) both}
.slideL{animation:slideL .8s cubic-bezier(.2,.8,.2,1) both}
.fadeIn{animation:fadeIn 1s ease both}
`;

/** shared gradient / pattern defs, ids namespaced by prefix p */
export function baseDefs(p) {
  const aur = `<stop offset="0" stop-color="${C.cyan}"/><stop offset=".5" stop-color="${C.violet}"/><stop offset="1" stop-color="${C.pink}"/>`;
  return `
<linearGradient id="${p}aur" x1="0" y1="0" x2="1" y2="0">${aur}</linearGradient>
<linearGradient id="${p}aurd" x1="0" y1="0" x2="1" y2="1">${aur}</linearGradient>
<linearGradient id="${p}aurv" x1="0" y1="0" x2="0" y2="1">${aur}</linearGradient>
<linearGradient id="${p}hair" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.cyan}" stop-opacity=".85"/><stop offset=".45" stop-color="${C.violet}" stop-opacity=".28"/><stop offset="1" stop-color="${C.pink}" stop-opacity=".8"/></linearGradient>
<linearGradient id="${p}glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".07"/><stop offset="1" stop-color="#fff" stop-opacity=".012"/></linearGradient>
<pattern id="${p}dots" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".9" fill="#fff" fill-opacity=".075"/></pattern>`;
}

/** midnight-glass card: dark base, glass sheen, dot texture, gradient hairline border */
export function card(p, x, y, w, h, r = 24, extra = '') {
  return `<g ${extra}>
<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${C.bg}"/>
<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="url(#${p}glass)"/>
<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="url(#${p}dots)"/>
<rect x="${x + .6}" y="${y + .6}" width="${w - 1.2}" height="${h - 1.2}" rx="${r - .6}" fill="none" stroke="url(#${p}hair)" stroke-width="1.2"/>
</g>`;
}

export function svgWrap(p, W, H, title, desc, defs, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="${p}t ${p}d">
<title id="${p}t">${esc(title)}</title>
<desc id="${p}d">${esc(desc)}</desc>
<defs>
<style>${fontCss()}${COMMON_CSS}</style>
${baseDefs(p)}
${defs}
</defs>
${body}
</svg>
`;
}

/* ------------------------------ SMIL helpers ------------------------------ */
/** generic <animate>. o: {calc, splines, loop, begin, fill} */
export function anim(attr, values, keyTimes, dur, o = {}) {
  const calc = o.calc ? ` calcMode="${o.calc}"` : '';
  const ks = o.splines ? ` keySplines="${o.splines}"` : '';
  const rep = o.loop ? ' repeatCount="indefinite"' : ' fill="freeze"';
  return `<animate attributeName="${attr}" values="${values.join(';')}" keyTimes="${keyTimes.map(f4).join(';')}" dur="${f2(dur)}s" begin="${o.begin ?? '0s'}"${calc}${ks}${rep}/>`;
}
export function animT(type, values, keyTimes, dur, o = {}) {
  const calc = o.calc ? ` calcMode="${o.calc}"` : '';
  const ks = o.splines ? ` keySplines="${o.splines}"` : '';
  const rep = o.loop ? ' repeatCount="indefinite"' : ' fill="freeze"';
  return `<animateTransform attributeName="${o.attr ?? 'transform'}" type="${type}" values="${values.join(';')}" keyTimes="${keyTimes.map(f4).join(';')}" dur="${f2(dur)}s" begin="${o.begin ?? '0s'}"${calc}${ks}${rep}${o.additive ? ' additive="sum"' : ''}/>`;
}
/** one-shot entrance: starts at 0s, the delay is baked into keyTimes, element's own attribute is the FINISHED state */
export function enter(attr, from, to, delay, dur) {
  if (delay <= 0) return anim(attr, [from, to], [0, 1], dur, { calc: 'spline', splines: '.2 .8 .2 1' });
  const T = delay + dur;
  return anim(attr, [from, from, to], [0, delay / T, 1], T, { calc: 'spline', splines: '0 0 1 1;.2 .8 .2 1' });
}
export function enterT(type, from, to, delay, dur) {
  if (delay <= 0) return animT(type, [from, to], [0, 1], dur, { calc: 'spline', splines: '.2 .8 .2 1' });
  const T = delay + dur;
  return animT(type, [from, from, to], [0, delay / T, 1], T, { calc: 'spline', splines: '0 0 1 1;.2 .8 .2 1' });
}
/** stroke draw-in for a path with pathLength="1" stroke-dasharray="1 1" */
export const drawIn = (delay, dur = .9) => enter('stroke-dashoffset', 1, 0, delay, dur);
export const DRAW = 'pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="0"';

/** blink / pulse loops */
export const blink = (dur = 1.1, lo = 0.1) => anim('opacity', [1, lo, 1], [0, .5, 1], dur, { loop: true });

/** count-up: a stack of numbers switched discretely; the last one is the visible finished state.
 *  cycle = loop length in seconds (0 = play once). */
export function countUp(cls, x, y, size, finalValue, suffix, fill, { delay = .6, dur = 1.5, cycle = 10, steps = 14, anchor = 'start' } = {}) {
  const vals = [];
  for (let k = 1; k <= steps; k++) {
    const e = 1 - Math.pow(1 - k / steps, 3);
    const v = Math.round(finalValue * e);
    if (!vals.length || vals[vals.length - 1] !== v) vals.push(v);
  }
  if (vals[vals.length - 1] !== finalValue) vals.push(finalValue);
  const n = vals.length, T = cycle || delay + dur + .1;
  const out = [];
  vals.forEach((v, i) => {
    const t0 = (delay + (i / n) * dur) / T;
    const t1 = i === n - 1 ? 1 : (delay + ((i + 1) / n) * dur) / T;
    const last = i === n - 1;
    const kt = last ? [0, t0, 1] : [0, t0, t1, 1];
    const va = last ? [0, 1, 1] : [0, 1, 0, 0];
    out.push(`<text class="${cls}" x="${x}" y="${y}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" opacity="${last ? 1 : 0}">${v}${suffix}<animate attributeName="opacity" values="${va.join(';')}" keyTimes="${kt.map(f4).join(';')}" dur="${f2(T)}s" begin="0s" calcMode="discrete" ${cycle ? 'repeatCount="indefinite"' : 'fill="freeze"'}/></text>`);
  });
  return out.join('');
}

export const write = (rel, text) => {
  const f = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, text);
  return f;
};
