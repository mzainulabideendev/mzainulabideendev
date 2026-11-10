import fs from 'node:fs';
import path from 'node:path';
import { C, P, SRC, esc, f2, f4, tw, card, svgWrap, anim, animT, enter, enterT, drawIn, DRAW, blink } from './lib.mjs';

export function hero() {
  const p = 'h-', W = 1200, H = 440;
  const FR = path.join(SRC, 'frames');
  const frames = fs.readdirSync(FR).filter(f => /^f_\d+\.jpg$/.test(f)).sort();
  const N = frames.length;
  const LOOP = 4;                // seconds: play 2.0s, hold last frame, fade, repeat
  const PLAY = 0.5;              // fraction of LOOP the clip plays
  const X0 = 60;

  // viewfinder geometry
  const fx = 770, fy = 38, fw = 386, fh = 364;
  const vs = 340, vx = fx + (fw - vs) / 2, vy = fy + 6;

  /* ---------- video frames ---------- */
  const frameEls = frames.map((f, i) => {
    const uri = `data:image/jpeg;base64,${fs.readFileSync(path.join(FR, f)).toString('base64')}`;
    const t = i / N * PLAY, t2 = (i + 1) / N * PLAY;
    let a;
    if (i === 0) a = anim('opacity', [1, 0, 0], [0, t2, 1], LOOP, { calc: 'discrete', loop: true });
    else if (i === N - 1) a = anim('opacity', [0, 1, 1], [0, t, 1], LOOP, { calc: 'discrete', loop: true });
    else a = anim('opacity', [0, 1, 0, 0], [0, t, t2, 1], LOOP, { calc: 'discrete', loop: true });
    return `<image xlink:href="${uri}" x="${vx}" y="${vy}" width="${vs}" height="${vs}" preserveAspectRatio="xMidYMid slice" opacity="${i === N - 1 ? 1 : 0}">${a}</image>`;
  }).join('\n');

  /* ---------- name ---------- */
  const name = P.name;
  let nameSize = 62;
  const maxW = 650;
  if (tw('display', name, nameSize) > maxW) nameSize = Math.floor(maxW / tw('display', name, 1));
  const nameW = tw('display', name, nameSize);
  const nameY = 200;

  /* ---------- typed line ---------- */
  const typed = "Hi there, I'm";
  const tSize = 22, cw = tw('mono', 'M', tSize), nch = typed.length;
  const td = .5, tdur = 1.3, tT = td + tdur, tu = tdur / nch;
  const tKeys = [0], tClip = [0], tCur = [X0];
  for (let k = 1; k <= nch; k++) { tKeys.push((td + (k - 1) * tu) / tT); tClip.push(f2(k * cw + 4)); tCur.push(f2(X0 + k * cw)); }
  tKeys[tKeys.length - 1] = Math.min(tKeys[tKeys.length - 1], .999);

  /* ---------- pill ---------- */
  const pillTxt = 'OPEN TO COLLABS';
  const pillW = 40 + tw('monob', pillTxt, 12, 1.6) + 6;

  /* ---------- roles ---------- */
  const R = P.roles, per = 3.2, RT = per * R.length;
  const roleEls = R.map((r, i) => {
    const a = i / R.length, b = (i + 1) / R.length, e = .035;
    const kt = [0, a, a + e, b - e, b, 1].map(f4);
    const o = anim('opacity', [0, 0, 1, 1, 0, 0], kt, RT, { loop: true });
    const y = animT('translate', ['0 9', '0 9', '0 0', '0 0', '0 -9', '0 -9'], kt, RT, { loop: true });
    return `<g opacity="${i === 0 ? 1 : 0}">${y}<text class="mb" x="${X0}" y="250" font-size="22"><tspan fill="${C.pink}">&gt; </tspan><tspan fill="url(#${p}rg)">${esc(r)}</tspan></text>${o}</g>`;
  }).join('\n');

  /* ---------- pitch + meta ---------- */
  const pitchSize = 17;
  const pitchW = tw('body', P.pitch, pitchSize);
  const meta = [
    { d: 'M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 1 1 13 0c0 5.4-6.5 11-6.5 11zM12 12.4a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8z', t: P.location },
    { d: 'M5 21V4.5A1.5 1.5 0 0 1 6.5 3h7A1.5 1.5 0 0 1 15 4.5V21M15 10h3.5A1.5 1.5 0 0 1 20 11.5V21M3 21h18M8.5 7.5h3M8.5 11h3M8.5 14.5h3', t: P.company },
    { d: 'M5 5.5A2.5 2.5 0 0 1 7.5 3H19v15H7.5A2.5 2.5 0 0 0 5 20.5zM5 20.5A2.5 2.5 0 0 0 7.5 23H19v-5', t: `${P.repos} repos · ${P.followers} followers` },
  ];
  let mx = X0;
  const metaEls = meta.map((m, i) => {
    const w = 26 + tw('body', m.t, 15);
    const el = `<g class="fadeIn" style="animation-delay:${1.6 + i * .15}s"><g transform="translate(${mx} 355) scale(.78)" fill="none" stroke="${C.cyan}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${m.d}" ${DRAW}>${drawIn(1.4 + i * .25, 1)}</path></g><text class="b" x="${mx + 26}" y="371" font-size="15" fill="${C.mut}">${esc(m.t)}</text></g>`;
    mx += w + 30;
    return el;
  }).join('\n');

  /* ---------- brackets ---------- */
  const L = 30, bx0 = fx, by0 = fy, bx1 = fx + fw, by1 = fy + fh;
  const br = [
    `M${bx0} ${by0 + L}V${by0 + 8}Q${bx0} ${by0} ${bx0 + 8} ${by0}H${bx0 + L}`,
    `M${bx1 - L} ${by0}H${bx1 - 8}Q${bx1} ${by0} ${bx1} ${by0 + 8}V${by0 + L}`,
    `M${bx1} ${by1 - L}V${by1 - 8}Q${bx1} ${by1} ${bx1 - 8} ${by1}H${bx1 - L}`,
    `M${bx0 + L} ${by1}H${bx0 + 8}Q${bx0} ${by1} ${bx0} ${by1 - 8}V${by1 - L}`,
  ].map((d, i) => `<path d="${d}" fill="none" stroke="url(#${p}aur)" stroke-width="3" stroke-linecap="round" ${DRAW}>${drawIn(.3 + i * .15, .8)}</path>`).join('');

  /* ---------- scrubber ---------- */
  const sx = fx + 18, sy = fy + fh - 24, sw = fw - 36;
  const scrub = `
<rect x="${sx}" y="${sy}" width="${sw}" height="4" rx="2" fill="#fff" fill-opacity=".14"/>
<rect x="${sx}" y="${sy}" width="${sw}" height="4" rx="2" fill="url(#${p}aur)">${anim('width', [0, sw, sw, 0], [0, PLAY, .97, 1], LOOP, { loop: true })}</rect>
<circle cx="${sx + sw}" cy="${sy + 2}" r="5" fill="#fff">${anim('cx', [sx, sx + sw, sx + sw, sx], [0, PLAY, .97, 1], LOOP, { loop: true })}</circle>`;

  const defs = `
<linearGradient id="${p}rg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.cyan}"/><stop offset="1" stop-color="${C.violet}"/></linearGradient>
<linearGradient id="${p}ng" gradientUnits="userSpaceOnUse" x1="${X0}" y1="0" x2="${f2(X0 + nameW)}" y2="0" spreadMethod="reflect">
  <stop offset="0" stop-color="${C.cyan}"/><stop offset=".33" stop-color="${C.violet}"/><stop offset=".66" stop-color="${C.pink}"/><stop offset="1" stop-color="${C.violet}"/>
  ${animT('translate', ['0 0', `${f2(nameW * 2)} 0`], [0, 1], 9, { attr: 'gradientTransform', loop: true })}
</linearGradient>
<mask id="${p}nm" maskUnits="userSpaceOnUse" x="${X0 - 10}" y="${nameY - nameSize - 4}" width="${f2(nameW + 40)}" height="${nameSize + 40}">
  <rect x="${X0 - 10}" y="${nameY - nameSize - 4}" width="${f2(nameW + 40)}" height="${nameSize + 40}" fill="#fff">${enter('y', nameY + 50, nameY - nameSize - 4, .55, 1)}</rect>
</mask>
<radialGradient id="${p}vm" gradientUnits="userSpaceOnUse" cx="${vx + vs / 2}" cy="${vy + vs / 2}" r="${vs / 2}"><stop offset="0" stop-color="#fff"/><stop offset=".58" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient>
<mask id="${p}vmask" maskUnits="userSpaceOnUse" x="${vx - 4}" y="${vy - 4}" width="${vs + 8}" height="${vs + 8}"><rect x="${vx - 4}" y="${vy - 4}" width="${vs + 8}" height="${vs + 8}" fill="url(#${p}vm)"/></mask>
<filter id="${p}blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="46"/></filter>
<clipPath id="${p}clip"><rect x="8" y="8" width="${W - 16}" height="${H - 16}" rx="28"/></clipPath>`;

  const body = `
${card(p, 8, 8, W - 16, H - 16, 28)}
<g clip-path="url(#${p}clip)">
  <g filter="url(#${p}blur)" opacity=".55">
    <ellipse cx="190" cy="40" rx="190" ry="90" fill="${C.cyan}" fill-opacity=".30">${anim('cx', [150, 260, 150], [0, .5, 1], 14, { calc: 'spline', splines: '.4 0 .6 1;.4 0 .6 1', loop: true })}</ellipse>
    <ellipse cx="${fx + fw / 2}" cy="${fy + fh / 2}" rx="190" ry="170" fill="${C.violet}" fill-opacity=".32"/>
    <ellipse cx="1100" cy="420" rx="200" ry="90" fill="${C.pink}" fill-opacity=".26">${anim('cx', [1080, 980, 1080], [0, .5, 1], 16, { calc: 'spline', splines: '.4 0 .6 1;.4 0 .6 1', loop: true })}</ellipse>
  </g>
</g>

<!-- pill -->
<g class="rise" style="animation-delay:.1s">
  <rect x="${X0}" y="44" width="${f2(pillW)}" height="32" rx="16" fill="${C.cyan}" fill-opacity=".08" stroke="${C.cyan}" stroke-opacity=".55"/>
  <circle cx="${X0 + 19}" cy="60" r="4.5" fill="${C.cyan}"/>
  <circle cx="${X0 + 19}" cy="60" r="4.5" fill="none" stroke="${C.cyan}" stroke-width="1.5" opacity="0">${anim('r', [4.5, 13], [0, 1], 1.8, { loop: true })}${anim('opacity', [.8, 0], [0, 1], 1.8, { loop: true })}</circle>
  <text class="mb" x="${X0 + 34}" y="64.5" font-size="12" letter-spacing="1.6" fill="${C.cyan}">${pillTxt}</text>
</g>

<!-- typed greeting -->
<clipPath id="${p}tc"><rect x="${X0 - 2}" y="${100}" width="${f2(nch * cw + 6)}" height="34">${anim('width', tClip, tKeys, tT, { calc: 'discrete' })}</rect></clipPath>
<text class="m" x="${X0}" y="124" font-size="${tSize}" fill="${C.mut}" clip-path="url(#${p}tc)">${esc(typed)}</text>
<rect x="${f2(X0 + nch * cw)}" y="105" width="2.2" height="24" fill="${C.cyan}">${anim('x', tCur, tKeys, tT, { calc: 'discrete' })}${blink(1)}</rect>

<!-- name -->
<g mask="url(#${p}nm)">
  <text class="d" x="${X0}" y="${nameY}" font-size="${nameSize}" fill="url(#${p}ng)" letter-spacing="-1">${esc(name)}</text>
</g>

<!-- cycling roles -->
${roleEls}

<!-- pitch -->
<text class="b rise" style="animation-delay:1.2s" x="${X0}" y="304" font-size="${pitchSize}" fill="${C.text}" fill-opacity=".82">${esc(P.pitch)}</text>

${metaEls}

<!-- viewfinder -->
<g class="fadeIn" style="animation-delay:.1s">
  <rect x="${fx}" y="${fy}" width="${fw}" height="${fh}" rx="12" fill="#06070c" fill-opacity=".55"/>
  <g mask="url(#${p}vmask)">
    <g>${anim('opacity', [0, 1, 1, 0, 0], [0, .03, .85, .97, 1], LOOP, { loop: true })}
${frameEls}
    </g>
  </g>
  <g stroke="#fff" stroke-opacity=".12" stroke-width="1"><path d="M${fx + fw / 3} ${fy + 14}V${fy + fh - 14}M${fx + fw * 2 / 3} ${fy + 14}V${fy + fh - 14}M${fx + 14} ${fy + fh / 3}H${fx + fw - 14}M${fx + 14} ${fy + fh * 2 / 3}H${fx + fw - 14}"/></g>
</g>
${br}
<g>
  <circle cx="${fx + 28}" cy="${fy + 28}" r="5.5" fill="${C.pink}">${blink(1.2, .08)}</circle>
  <text class="mb" x="${fx + 42}" y="${fy + 32.5}" font-size="12" letter-spacing="1.5" fill="${C.pink}">REC</text>
  <text class="m" x="${fx + fw - 24}" y="${fy + 32.5}" font-size="11" text-anchor="end" fill="${C.mut}">15 FPS · ${N} FR</text>
  <text class="m" x="${fx + 20}" y="${fy + fh - 40}" font-size="11.5" fill="${C.text}" fill-opacity=".8">wave_take_01.mov</text>
</g>
${scrub}
`;

  return svgWrap(p, W, H, `${P.name} - ${P.roles[0]}`, `Animated profile hero for ${P.name} (${P.username}): ${P.roles.join(', ')}.`, defs, body);
}
