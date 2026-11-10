import { C, P, esc, f2, f4, tw, card, svgWrap, anim, animT, blink } from './lib.mjs';
import { glyph, BRAND, LABEL } from './icons.mjs';

// ---- orbit configuration (centre of the left card) ----
export const CX = 358, CY = 330, CORE_R = 30;
export const ORBITS = [
  { rx: 172, ry: 64, rot: -22, dur: 24, sweep: 1, icons: ['dotnet', 'csharp', 'git'] },
  { rx: 252, ry: 98, rot: 30, dur: 36, sweep: 0, icons: ['angular', 'firebase', 'mysql', 'cloudflare', 'flutter'] },
  { rx: 292, ry: 128, rot: -64, dur: 48, sweep: 1, icons: ['react', 'github', 'python', 'kotlin'], host: 'react' },
];
export const MOONS = [
  { icon: 'vite', r: 38, dur: 3.4, sweep: 1 },
  { icon: 'typescript', r: 54, dur: 5.6, sweep: 0 },
];
const TILE = 40, MTILE = 24;

const tile = (name, s, id) => {
  const brand = BRAND[name] ?? '#fff';
  const h = s / 2, k = s / 40;
  return `<g id="${id}"><rect x="${-h}" y="${-h}" width="${s}" height="${s}" rx="${s * .28}" fill="#12141f" stroke="${brand}" stroke-opacity=".6" stroke-width="1.2"/>
<g transform="scale(${f2(.78 * k)})">${glyph(name)}</g></g>`;
};

/** closed ellipse path (relative to start point) starting at angle th */
const ellipsePath = (rx, ry, th, sweep) => {
  const x0 = rx * Math.cos(th), y0 = ry * Math.sin(th);
  return { x0: f2(x0), y0: f2(y0), d: `M0 0A${rx} ${ry} 0 1 ${sweep} ${f2(-2 * x0)} ${f2(-2 * y0)}A${rx} ${ry} 0 1 ${sweep} 0 0Z` };
};
const circlePath = (r, sweep) => `M0 0A${r} ${r} 0 1 ${sweep} ${-2 * r} 0A${r} ${r} 0 1 ${sweep} 0 0Z`;

export function stack() {
  const p = 's-', W = 1200, H = 660;

  /* ---------- starfield ---------- */
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const stars = Array.from({ length: 34 }, (_, i) => {
    const x = 30 + rnd() * 640, y = 30 + rnd() * 590, r = .6 + rnd() * 1.1;
    return `<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(r)}" fill="#fff" opacity=".35">${anim('opacity', [.12, .8, .12], [0, .5, 1], 2 + rnd() * 3, { loop: true })}</circle>`;
  }).join('');

  /* ---------- orbits ---------- */
  const orbitEls = ORBITS.map((o, oi) => {
    const ring = `<ellipse rx="${o.rx}" ry="${o.ry}" fill="none" stroke="url(#${p}aur)" stroke-opacity=".38" stroke-width="1.2" stroke-dasharray="2 7" stroke-linecap="round"/>`;
    const items = o.icons.map((name, k) => {
      const th = (k / o.icons.length) * Math.PI * 2 + oi * .9;
      const { x0, y0, d } = ellipsePath(o.rx, o.ry, th, o.sweep);
      const motion = `<animateMotion dur="${o.dur}s" repeatCount="indefinite" path="${d}"/>`;
      if (name === o.host) {
        const moons = MOONS.map((m, mi) => `<g transform="translate(${m.r} 0)"><animateMotion dur="${m.dur}s" repeatCount="indefinite" path="${circlePath(m.r, m.sweep)}"/>${tile(m.icon, MTILE, `${p}moon${mi}`)}</g>`).join('');
        return `<g transform="translate(${x0} ${y0})">${motion}<g transform="rotate(${-o.rot})"><circle r="${MOONS[1].r}" fill="none" stroke="#fff" stroke-opacity=".10" stroke-dasharray="1 5"/><circle r="${MOONS[0].r}" fill="none" stroke="#fff" stroke-opacity=".10" stroke-dasharray="1 5"/>${moons}${tile(name, TILE, `${p}host`)}</g></g>`;
      }
      return `<g transform="translate(${x0} ${y0})">${motion}<g transform="rotate(${-o.rot})">${tile(name, TILE, `${p}ic-${oi}-${k}`)}</g></g>`;
    }).join('');
    return `<g transform="translate(${CX} ${CY}) rotate(${o.rot})">${ring}${items}</g>`;
  }).join('\n');

  const core = `
<g transform="translate(${CX} ${CY})">
  <circle r="92" fill="url(#${p}glow)">${anim('r', [84, 100, 84], [0, .5, 1], 4.5, { calc: 'spline', splines: '.4 0 .6 1;.4 0 .6 1', loop: true })}</circle>
  <circle r="${CORE_R + 11}" fill="none" stroke="url(#${p}aur)" stroke-width="1.4" stroke-dasharray="5 7" stroke-opacity=".8">${animT('rotate', ['0', '360'], [0, 1], 16, { loop: true })}</circle>
  <circle r="${CORE_R}" fill="${C.bg}" stroke="url(#${p}aurd)" stroke-width="2"/>
  <text class="d" y="7" text-anchor="middle" font-size="19" fill="url(#${p}aurd)">MZ</text>
</g>`;

  /* ---------- chips ---------- */
  const GROUPS = [
    { t: 'FRONTEND', items: ['angular', 'react', 'typescript', 'javascript', 'mui', 'html', 'css', 'vite'] },
    { t: 'BACKEND', items: ['dotnet', 'csharp', 'cpp', 'java', 'python', 'php'] },
    { t: 'MOBILE', items: ['flutter', 'kotlin', 'androidstudio'] },
    { t: 'DATA & CLOUD', items: ['firebase', 'mysql', 'sqlite', 'cloudflare'] },
    { t: 'TOOLS', items: ['git', 'github', 'vscode', 'visualstudio', 'postman'] },
  ];
  const gx0 = 752, gw = 412, chipH = 28, gap = 7;
  const total = GROUPS.reduce((n, g) => n + g.items.length, 0);
  const CYC = total * .3 + 1.6, SLOT = .3 * 1.0;
  let y = 98, k = 0;
  const chipEls = GROUPS.map(g => {
    let out = `<g class="slideL" style="animation-delay:${.3 + k * .02}s"><circle cx="${gx0 + 4}" cy="${y - 4}" r="3" fill="url(#${p}aurd)"/><text class="mb" x="${gx0 + 16}" y="${y}" font-size="10.5" letter-spacing="1.8" fill="${C.mut}">${esc(g.t)}</text></g>`;
    y += 12;
    let x = gx0;
    g.items.forEach(name => {
      const label = LABEL[name];
      const w = 32 + tw('body', label, 12.5) + 14;
      if (x + w > gx0 + gw) { x = gx0; y += chipH + gap; }
      const a = (k * SLOT) / CYC, b = a + .9 / CYC;
      const kt = [0, a, a + .35 / CYC, b, 1].map(f4);
      const col = BRAND[name];
      out += `<g class="rise" style="animation-delay:${.35 + k * .03}s">
<rect x="${f2(x)}" y="${y}" width="${f2(w)}" height="${chipH}" rx="9" fill="${col}" fill-opacity="0">${anim('fill-opacity', [0, 0, .16, 0, 0], kt, CYC, { loop: true })}</rect>
<rect x="${f2(x + .6)}" y="${y + .6}" width="${f2(w - 1.2)}" height="${chipH - 1.2}" rx="8.4" fill="#fff" fill-opacity=".03" stroke="${col}" stroke-opacity=".30" stroke-width="1">${anim('stroke-opacity', [.3, .3, 1, .3, .3], kt, CYC, { loop: true })}${anim('stroke-width', [1, 1, 1.8, 1, 1], kt, CYC, { loop: true })}</rect>
<circle cx="${f2(x + 15)}" cy="${y + chipH / 2}" r="4" fill="${col}"/>
<text class="b" x="${f2(x + 28)}" y="${y + chipH / 2 + 4.4}" font-size="12.5" fill="${C.text}">${esc(label)}</text></g>`;
      x += w + gap;
      k++;
    });
    y += chipH + 26;
    return out;
  }).join('\n');

  const defs = `
<radialGradient id="${p}glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${C.violet}" stop-opacity=".55"/><stop offset=".45" stop-color="${C.cyan}" stop-opacity=".16"/><stop offset="1" stop-color="${C.pink}" stop-opacity="0"/></radialGradient>
<clipPath id="${p}lclip"><rect x="8" y="8" width="700" height="644" rx="26"/></clipPath>`;

  const body = `
${card(p, 8, 8, 700, 644, 26)}
${card(p, 724, 8, 468, 644, 26)}
<g clip-path="url(#${p}lclip)">${stars}</g>
${orbitEls}
${core}
<g class="rise" style="animation-delay:.1s">
  <text class="mb" x="40" y="590" font-size="11" letter-spacing="2" fill="${C.mut}">TECH STACK</text>
  <text class="d" x="40" y="620" font-size="22" fill="${C.text}">What I build with</text>
</g>
<g class="rise" style="animation-delay:.2s">
  <text class="mb" x="${gx0}" y="52" font-size="11" letter-spacing="2" fill="${C.mut}">TOOLBOX</text>
  <text class="d" x="${gx0}" y="76" font-size="20" fill="${C.text}">From C to Angular to Flutter</text>
</g>
${chipEls}
<g class="rise" style="animation-delay:1s">
  <rect x="${gx0}" y="584" width="${gw}" height="48" rx="14" fill="#fff" fill-opacity=".03" stroke="#fff" stroke-opacity=".08"/>
  <g transform="translate(${gx0 + 30} 608) scale(.8)">${glyph('vite')}</g>
  <g transform="translate(${gx0 + 58} 608) scale(.8)">${glyph('typescript')}</g>
  <text class="b" x="${gx0 + 84}" y="612.5" font-size="12.5" fill="${C.mut}">Vite and TypeScript are moons of React</text>
</g>
`;
  const out = svgWrap(p, W, H, 'Tech stack', `Technology icons orbiting a glowing core, and a grouped chip grid of ${P.name}'s tools.`, defs, body);
  return out;
}
