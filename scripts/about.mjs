import { C, P, esc, f2, f4, tw, card, svgWrap, anim, animT, enter, drawIn, DRAW, blink } from './lib.mjs';

// Daily rings are decorative targets - edit freely.
const RINGS = [
  { label: 'CODE', pct: 85, color: C.cyan },
  { label: 'WRITE', pct: 62, color: C.violet },
  { label: 'LEARN', pct: 74, color: C.pink },
];

export function about() {
  const p = 'a-', W = 1200, H = 500;
  const LX = 8, RX = 608, CW = 584, CY = 8, CH = 484;

  /* ================= LEFT: browser window ================= */
  const bx = 36, by = 36, bw = 528, bh = 240;
  const url = 'mzainulabideen.vercel.app';
  const urlW = tw('mono', url, 11);

  const stars = [[70, 100], [130, 88], [190, 120], [250, 92], [330, 104], [395, 90], [455, 130], [520, 100], [90, 150], [510, 168], [60, 190], [350, 140]]
    .map(([x, y], i) => `<circle cx="${bx + x - 36 + 36}" cy="${y + 10}" r="${i % 3 ? 1.1 : 1.6}" fill="#fff" opacity=".7">${anim('opacity', [.15, .9, .15], [0, .5, 1], 2.4 + (i % 4) * .6, { loop: true })}</circle>`).join('');

  const codeLines = [
    { w: 92, c: C.cyan, y: 142 }, { w: 120, c: C.violet, y: 156, x: 12 }, { w: 70, c: C.pink, y: 170, x: 12 },
    { w: 104, c: C.cyan, y: 184, x: 24 }, { w: 56, c: C.violet, y: 198 }, { w: 84, c: C.pink, y: 212, x: 12 },
  ].map((l, i) => {
    const x = 232 + (l.x || 0);
    return `<rect x="${x}" y="${l.y}" width="${l.w}" height="5" rx="2.5" fill="${l.c}" fill-opacity=".85">${anim('width', [0, 0, l.w, l.w, 0], [0, .05 + i * .1, .12 + i * .1, .92, 1], 6, { calc: 'spline', splines: '0 0 1 1;.3 .7 .4 1;0 0 1 1;.4 0 .6 1', loop: true })}</rect>`;
  }).join('');

  const browser = `
<clipPath id="${p}bclip"><path d="M${bx} ${by + 34}H${bx + bw}V${by + bh - 14}A14 14 0 0 1 ${bx + bw - 14} ${by + bh}H${bx + 14}A14 14 0 0 1 ${bx} ${by + bh - 14}Z"/></clipPath>
<linearGradient id="${p}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c1648"/><stop offset=".7" stop-color="#12142b"/><stop offset="1" stop-color="#0d0e16"/></linearGradient>
<radialGradient id="${p}moon" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".45" stop-color="${C.pink}" stop-opacity=".55"/><stop offset="1" stop-color="${C.pink}" stop-opacity="0"/></radialGradient>
<g class="rise" style="animation-delay:.15s">
  <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="14" fill="#10121d" stroke="#fff" stroke-opacity=".1"/>
  <path d="M${bx} ${by + 34}V${by + 14}A14 14 0 0 1 ${bx + 14} ${by}H${bx + bw - 14}A14 14 0 0 1 ${bx + bw} ${by + 14}V${by + 34}Z" fill="#fff" fill-opacity=".045"/>
  <circle cx="${bx + 22}" cy="${by + 17}" r="5" fill="${C.pink}"/><circle cx="${bx + 40}" cy="${by + 17}" r="5" fill="${C.violet}"/><circle cx="${bx + 58}" cy="${by + 17}" r="5" fill="${C.cyan}"/>
  <rect x="${bx + 84}" y="${by + 7}" width="${bw - 130}" height="20" rx="10" fill="#fff" fill-opacity=".06"/>
  <path d="M${bx + 100} ${by + 15.5}v-2a3 3 0 0 1 6 0v2M${bx + 98.5} ${by + 15.5}h9v6h-9z" fill="none" stroke="${C.cyan}" stroke-width="1.1" stroke-linejoin="round"/>
  <text class="m" x="${bx + 116}" y="${by + 21}" font-size="11" fill="${C.text}" fill-opacity=".85">${url}</text>
  <rect x="${f2(bx + 116 + urlW + 3)}" y="${by + 11.5}" width="1.6" height="12" fill="${C.cyan}">${blink(1)}</rect>
  <g clip-path="url(#${p}bclip)">
    <rect x="${bx}" y="${by + 34}" width="${bw}" height="${bh - 34}" fill="url(#${p}sky)"/>
    ${stars}
    <circle cx="${bx + 450}" cy="${by + 88}" r="46" fill="url(#${p}moon)">${anim('r', [42, 50, 42], [0, .5, 1], 5, { calc: 'spline', splines: '.4 0 .6 1;.4 0 .6 1', loop: true })}</circle>
    <circle cx="${bx + 450}" cy="${by + 88}" r="17" fill="#ffe9f4"/>
    <path d="M${bx} ${by + 196}C${bx + 90} ${by + 160} ${bx + 170} ${by + 190} ${bx + 260} ${by + 176}S${bx + 440} ${by + 150} ${bx + bw} ${by + 182}V${by + bh}H${bx}Z" fill="#171a33"/>
    <path d="M${bx} ${by + 214}C${bx + 120} ${by + 190} ${bx + 220} ${by + 220} ${bx + 330} ${by + 204}S${bx + 470} ${by + 196} ${bx + bw} ${by + 210}V${by + bh}H${bx}Z" fill="#0f1126"/>
    <!-- laptop -->
    <g>
      <rect x="${bx + 176}" y="${by + 82}" width="176" height="108" rx="9" fill="#0a0b14" stroke="url(#${p}hair)" stroke-width="1.4"/>
      <circle cx="${bx + 188}" cy="${by + 93}" r="2" fill="${C.pink}"/><circle cx="${bx + 196}" cy="${by + 93}" r="2" fill="${C.violet}"/><circle cx="${bx + 204}" cy="${by + 93}" r="2" fill="${C.cyan}"/>
      <path d="M${bx + 158} ${by + 198}H${bx + 370}L${bx + 384} ${by + 214}H${bx + 144}Z" fill="#1b1d30" stroke="#fff" stroke-opacity=".12"/>
      <g transform="translate(${bx - 36} ${by - 34})">${codeLines.replace(/<rect x="(\d+)"/g, (m, x) => `<rect x="${+x - 0}"`)}</g>
    </g>
    <!-- floating tags -->
    <g class="m" font-size="12" font-weight="700">
      <g>${animT('translate', ['0 0', '0 -7', '0 0'], [0, .5, 1], 4, { calc: 'spline', splines: '.4 0 .6 1;.4 0 .6 1', loop: true })}<rect x="${bx + 70}" y="${by + 96}" width="40" height="22" rx="7" fill="${C.cyan}" fill-opacity=".12" stroke="${C.cyan}" stroke-opacity=".5"/><text x="${bx + 90}" y="${by + 111}" text-anchor="middle" fill="${C.cyan}">C#</text></g>
      <g>${animT('translate', ['0 0', '0 -9', '0 0'], [0, .5, 1], 5, { calc: 'spline', splines: '.4 0 .6 1;.4 0 .6 1', loop: true })}<rect x="${bx + 400}" y="${by + 140}" width="48" height="22" rx="7" fill="${C.violet}" fill-opacity=".14" stroke="${C.violet}" stroke-opacity=".55"/><text x="${bx + 424}" y="${by + 155}" text-anchor="middle" fill="${C.violet}">.NET</text></g>
      <g>${animT('translate', ['0 0', '0 -6', '0 0'], [0, .5, 1], 3.4, { calc: 'spline', splines: '.4 0 .6 1;.4 0 .6 1', loop: true })}<rect x="${bx + 52}" y="${by + 150}" width="46" height="22" rx="7" fill="${C.pink}" fill-opacity=".12" stroke="${C.pink}" stroke-opacity=".5"/><text x="${bx + 75}" y="${by + 165}" text-anchor="middle" fill="${C.pink}">&lt;/&gt;</text></g>
    </g>
    <!-- coffee -->
    <g transform="translate(${bx + 400} ${by + 176})">
      <path d="M0 0h30v26a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6Z" fill="#1f2238" stroke="#fff" stroke-opacity=".18"/>
      <path d="M30 6h4a5 5 0 0 1 0 12h-4" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="2"/>
      <path d="M9 -4c-3-4 3-6 0-10M16 -4c-3-4 3-6 0-10M23 -4c-3-4 3-6 0-10" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" ${DRAW} stroke-opacity=".5">${anim('stroke-dashoffset', [1, 0, -1], [0, .5, 1], 3, { loop: true })}</path>
    </g>
  </g>
</g>`;

  /* capability rows */
  const caps = [
    { t: 'Full-stack engineering', s: 'C# · .NET · Angular · MUI · REST APIs · SQL', d: 'M12 3 3 8l9 5 9-5zM3 12.5l9 5 9-5M3 17l9 5 9-5' },
    { t: 'Mobile & desktop apps', s: 'Flutter · Kotlin · Android Studio · Windows', d: 'M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM10.5 18.5h3' },
    { t: 'Published & shipped', s: 'Google Play · Microsoft Store · Uptodown · VS Marketplace', d: 'M12 2c3 2.4 5 6 5 10l-2.2 3.6H9.2L7 12c0-4 2-7.6 5-10zM9.2 15.6 7 21l4-1.6M14.8 15.6 17 21l-4-1.6M12 9.6v.01' },
  ];
  const rows = caps.map((c, i) => {
    const y = 296 + i * 60;
    return `<g class="slideL" style="animation-delay:${.45 + i * .15}s">
  <rect x="36" y="${y}" width="528" height="52" rx="14" fill="#fff" fill-opacity=".03" stroke="#fff" stroke-opacity=".07"/>
  <rect x="48" y="${y + 6}" width="40" height="40" rx="12" fill="${C.cyan}" fill-opacity=".07" stroke="url(#${p}aurd)" stroke-width="1.2"/>
  <g transform="translate(56 ${y + 14})" fill="none" stroke="url(#${p}aurd)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${c.d}" ${DRAW}>${drawIn(.8 + i * .2, 1)}</path></g>
  <text class="d" x="104" y="${y + 23}" font-size="15" fill="${C.text}">${esc(c.t)}</text>
  <text class="b" x="104" y="${y + 41}" font-size="12" fill="${C.mut}">${esc(c.s)}</text>
</g>`;
  }).join('\n');

  /* ================= RIGHT: carousel ================= */
  const vx = 632, vy = 32, vw = 536, vh = 262, SLIDES = 4, LOOP = 16;
  const slideKeys = i => {
    const a = i / SLIDES, b = (i + 1) / SLIDES, e = .028;
    return [0, a, a + e, b - e, b, 1].map(f4);
  };
  const slideAnims = i => {
    const kt = slideKeys(i);
    return anim('opacity', [0, 0, 1, 1, 0, 0], kt, LOOP, { loop: true }) +
      animT('translate', ['34 0', '34 0', '0 0', '0 0', '-34 0', '-34 0'], kt, LOOP, { loop: true, calc: 'spline', splines: '0 0 1 1;.2 .8 .2 1;0 0 1 1;.5 0 .8 .2;0 0 1 1' });
  };

  const bg = (id, c1, c2) => `<linearGradient id="${p}${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}" stop-opacity=".30"/><stop offset="1" stop-color="${c2}" stop-opacity=".08"/></linearGradient>`;
  const slideDefs = bg('s1', C.violet, C.cyan) + bg('s2', C.cyan, C.pink) + bg('s3', C.pink, C.violet) + bg('s4', C.cyan, C.violet);

  const float = (dy, dur, inner, delay = 0) => `<g>${animT('translate', ['0 0', `0 ${-dy}`, '0 0'], [0, .5, 1], dur, { calc: 'spline', splines: '.4 0 .6 1;.4 0 .6 1', loop: true })}${inner}</g>`;
  const pageLines = (x, y, w, n, col = '#fff') => Array.from({ length: n }, (_, k) => `<rect x="${x}" y="${y + k * 11}" width="${k % 3 === 2 ? w * .6 : w}" height="3.2" rx="1.6" fill="${col}" fill-opacity=".28"/>`).join('');

  const art = [
    // 1: writing & authoring
    `<rect width="${vw}" height="${vh}" fill="url(#${p}s1)"/>
     <path d="M268 206C228 188 178 186 130 196V104C178 94 228 96 268 116Z" fill="#171a30" stroke="${C.violet}" stroke-opacity=".7" stroke-width="1.4"/>
     <path d="M268 206C308 188 358 186 406 196V104C358 94 308 96 268 116Z" fill="#1b1e36" stroke="${C.cyan}" stroke-opacity=".7" stroke-width="1.4"/>
     ${pageLines(150, 120, 96, 6)}${pageLines(292, 120, 96, 6)}
     <path d="M268 116V206" stroke="#fff" stroke-opacity=".25"/>
     <g transform="rotate(-8 90 150)"><rect x="52" y="108" width="76" height="102" rx="6" fill="${C.pink}" fill-opacity=".16" stroke="${C.pink}" stroke-opacity=".7"/><rect x="52" y="108" width="10" height="102" rx="4" fill="${C.pink}" fill-opacity=".55"/><text class="d" x="94" y="154" text-anchor="middle" font-size="15" fill="${C.text}">LOGIC</text><rect x="70" y="166" width="48" height="3" rx="1.5" fill="#fff" fill-opacity=".4"/><rect x="76" y="176" width="36" height="3" rx="1.5" fill="#fff" fill-opacity=".25"/></g>
     ${float(10, 3.6, `<text class="mb" x="430" y="96" font-size="26" fill="${C.cyan}" fill-opacity=".9">{ }</text>`)}
     ${float(14, 4.4, `<text class="mb" x="214" y="84" font-size="22" fill="${C.pink}" fill-opacity=".85">Aa</text>`)}
     ${float(8, 3, `<text class="mb" x="360" y="70" font-size="20" fill="${C.violet}" fill-opacity=".9">//</text>`)}`,
    // 2: shipping apps
    `<rect width="${vw}" height="${vh}" fill="url(#${p}s2)"/>
     <rect x="224" y="40" width="88" height="182" rx="16" fill="#0b0c14" stroke="url(#${p}hair)" stroke-width="1.6"/>
     <rect x="234" y="56" width="68" height="150" rx="8" fill="#14172b"/>
     ${[0, 1, 2].flatMap(r => [0, 1, 2].map(c => `<rect x="${240 + c * 21}" y="${64 + r * 24}" width="16" height="16" rx="5" fill="${[C.cyan, C.violet, C.pink][(r + c) % 3]}" fill-opacity="${.45 + ((r + c) % 3) * .15}"/>`)).join('')}
     <rect x="242" y="140" width="52" height="8" rx="4" fill="#fff" fill-opacity=".14"/><rect x="242" y="156" width="52" height="24" rx="8" fill="${C.cyan}" fill-opacity=".85"/>
     <text class="mb" x="268" y="172" text-anchor="middle" font-size="9" fill="#0d0e16">INSTALL</text>
     ${float(10, 3.2, `<g transform="translate(108 70)"><rect width="104" height="30" rx="15" fill="${C.cyan}" fill-opacity=".12" stroke="${C.cyan}" stroke-opacity=".6"/><text class="mb" x="52" y="19.5" text-anchor="middle" font-size="11" fill="${C.cyan}">Google Play</text></g>`)}
     ${float(12, 4, `<g transform="translate(330 96)"><rect width="128" height="30" rx="15" fill="${C.violet}" fill-opacity=".13" stroke="${C.violet}" stroke-opacity=".6"/><text class="mb" x="64" y="19.5" text-anchor="middle" font-size="11" fill="${C.violet}">Microsoft Store</text></g>`)}
     ${float(8, 3.6, `<g transform="translate(96 160)"><rect width="92" height="30" rx="15" fill="${C.pink}" fill-opacity=".12" stroke="${C.pink}" stroke-opacity=".6"/><text class="mb" x="46" y="19.5" text-anchor="middle" font-size="11" fill="${C.pink}">Uptodown</text></g>`)}
     <g>${animT('translate', ['0 -4', '0 -52', '0 -4'], [0, .5, 1], 3, { calc: 'spline', splines: '.4 0 .6 1;.4 0 .6 1', loop: true })}
       <path d="M420 214c10-18 22-18 32 0l-6 22h-20z" fill="#e8eaf6" fill-opacity=".9"/><circle cx="436" cy="206" r="4" fill="${C.cyan}"/>
       <path d="M428 238q8 22 16 0" fill="${C.pink}" opacity=".85">${anim('opacity', [.4, 1, .4], [0, .5, 1], .5, { loop: true })}</path></g>`,
    // 3: VS extensions
    `<rect width="${vw}" height="${vh}" fill="url(#${p}s3)"/>
     <rect x="86" y="38" width="364" height="190" rx="14" fill="#0b0c14" stroke="url(#${p}hair)" stroke-width="1.4"/>
     <rect x="86" y="38" width="364" height="26" rx="14" fill="#fff" fill-opacity=".05"/>
     <rect x="96" y="72" width="62" height="146" rx="8" fill="#fff" fill-opacity=".04"/>
     ${[0, 1, 2, 3].map(k => `<rect x="104" y="${82 + k * 30}" width="46" height="22" rx="6" fill="${[C.cyan, C.violet, C.pink, C.cyan][k]}" fill-opacity=".25" stroke="${[C.cyan, C.violet, C.pink, C.cyan][k]}" stroke-opacity=".5"/>`).join('')}
     ${[[176, 84, 150, C.cyan], [188, 100, 120, C.violet], [188, 116, 96, C.pink], [176, 132, 170, C.cyan], [188, 148, 110, C.violet], [176, 164, 80, C.pink]].map(([x, y, w, c], k) => `<rect x="${x}" y="${y}" width="${w}" height="5" rx="2.5" fill="${c}" fill-opacity=".8">${anim('width', [0, 0, w, w, 0], [0, .08 + k * .06, .16 + k * .06, .93, 1], 5, { loop: true })}</rect>`).join('')}
     <g>${animT('translate', ['150 -10', '0 0', '0 0', '150 -10'], [0, .35, .85, 1], 5, { calc: 'spline', splines: '.2 .8 .2 1;0 0 1 1;.5 0 .8 .2', loop: true })}
       <path d="M352 116h22a8 8 0 1 1 16 0h22v22a8 8 0 1 0 0 16v22h-60z" fill="${C.pink}" fill-opacity=".2" stroke="${C.pink}" stroke-width="1.6" stroke-linejoin="round"/>
       <text class="mb" x="376" y="168" text-anchor="middle" font-size="11" fill="${C.pink}">.vsix</text></g>
     ${float(8, 3.4, `<text class="mb" x="470" y="84" font-size="22" fill="${C.violet}">⌘</text>`)}`.replace('⌘', '#'),
    // 4: DEV articles
    `<rect width="${vw}" height="${vh}" fill="url(#${p}s4)"/>
     <g transform="rotate(-5 200 130)"><rect x="96" y="54" width="220" height="150" rx="12" fill="#12142a" stroke="${C.violet}" stroke-opacity=".5"/><rect x="112" y="72" width="120" height="8" rx="4" fill="#fff" fill-opacity=".55"/><rect x="112" y="88" width="84" height="8" rx="4" fill="#fff" fill-opacity=".4"/>${pageLines(112, 112, 188, 4)}<rect x="112" y="170" width="44" height="16" rx="8" fill="${C.cyan}" fill-opacity=".2"/><rect x="162" y="170" width="52" height="16" rx="8" fill="${C.pink}" fill-opacity=".2"/></g>
     <g transform="rotate(4 340 130)"><rect x="230" y="40" width="220" height="150" rx="12" fill="#161a33" stroke="url(#${p}hair)" stroke-width="1.4"/><rect x="246" y="58" width="42" height="22" rx="6" fill="#111" stroke="#e8eaf6" stroke-opacity=".7"/><text class="mb" x="267" y="73.5" text-anchor="middle" font-size="10" fill="#e8eaf6">DEV</text><rect x="246" y="94" width="150" height="8" rx="4" fill="#fff" fill-opacity=".6"/><rect x="246" y="110" width="110" height="8" rx="4" fill="#fff" fill-opacity=".42"/>${pageLines(246, 134, 180, 3)}</g>
     ${[0, 1, 2, 3, 4, 5, 6].map(k => `<circle cx="${140 + k * 36}" cy="236" r="6" fill="${k === 3 ? C.cyan : '#fff'}" fill-opacity="${k === 3 ? 1 : .18}">${k === 3 ? anim('r', [5, 8, 5], [0, .5, 1], 1.6, { loop: true }) : ''}</circle>`).join('')}`,
  ];

  const caps4 = [
    { t: 'Writing & authoring', s: 'Books on Amazon, Apple Books, Kobo and more, including "Logic" for new coders.' },
    { t: 'Shipping real apps', s: 'Published on Google Play, Microsoft Store and Uptodown.' },
    { t: 'Visual Studio extensions', s: 'Small tools that speed up other developers, on the VS Marketplace.' },
    { t: 'Writing about engineering', s: 'Weekly posts on DEV: lessons, habits and honest takes.' },
  ];

  const segGap = 6, segW = (vw - 24 - segGap * 3) / 4;
  const segs = Array.from({ length: SLIDES }, (_, i) => {
    const x = vx + 12 + i * (segW + segGap), y = vy + 12;
    const a = i / SLIDES, b = (i + 1) / SLIDES;
    return `<rect x="${f2(x)}" y="${y}" width="${f2(segW)}" height="3.5" rx="1.75" fill="#fff" fill-opacity=".22"/>
<rect x="${f2(x)}" y="${y}" width="${f2(segW)}" height="3.5" rx="1.75" fill="#fff">${anim('width', [0, 0, f2(segW), f2(segW)], [0, a, b, 1], LOOP, { loop: true })}</rect>`;
  }).join('');

  const slides = art.map((a, i) => `<g opacity="${i === 0 ? 1 : 0}">${slideAnims(i)}<g transform="translate(${vx} ${vy})">${a}</g></g>`).join('\n');
  const captions = caps4.map((c, i) => {
    const kt = slideKeys(i);
    return `<g opacity="${i === 0 ? 1 : 0}">${anim('opacity', [0, 0, 1, 1, 0, 0], kt, LOOP, { loop: true })}
<text class="d" x="${vx + 4}" y="322" font-size="20" fill="${C.text}">${esc(c.t)}</text>
<text class="b" x="${vx + 4}" y="345" font-size="13" fill="${C.mut}">${esc(c.s)}</text></g>`;
  }).join('\n');

  const rcx = i => vx + vw / 6 + i * (vw / 3);
  const rings = RINGS.map((r, i) => {
    const cx = f2(rcx(i)), cy = 428, rad = 28;
    const s0 = .06 * i;
    return `<g>
<circle cx="${cx}" cy="${cy}" r="${rad}" fill="none" stroke="#fff" stroke-opacity=".09" stroke-width="7"/>
<circle cx="${cx}" cy="${cy}" r="${rad}" fill="none" stroke="${r.color}" stroke-width="7" stroke-linecap="round" pathLength="100" stroke-dasharray="${r.pct} 100" transform="rotate(-90 ${cx} ${cy})">${anim('stroke-dasharray', ['0.1 100', '0.1 100', `${r.pct} 100`, `${r.pct} 100`, '0.1 100'], [0, s0, s0 + .3, .9, 1], 7, { calc: 'spline', splines: '0 0 1 1;.3 .7 .3 1;0 0 1 1;.4 0 .6 1', loop: true })}</circle>
<text class="mb" x="${cx}" y="${cy + 4.5}" text-anchor="middle" font-size="13" fill="${C.text}">${r.pct}%</text>
<text class="m" x="${cx}" y="${cy + 52}" text-anchor="middle" font-size="10.5" letter-spacing="1.4" fill="${C.mut}">${r.label}</text></g>`;
  }).join('\n');

  const defs = slideDefs + `<clipPath id="${p}vclip"><rect x="${vx}" y="${vy}" width="${vw}" height="${vh}" rx="16"/></clipPath>`;

  const body = `
${card(p, LX, CY, CW, CH, 26)}
${card(p, RX, CY, CW, CH, 26)}
${browser}
${rows}

<g class="fadeIn" style="animation-delay:.2s">
  <rect x="${vx}" y="${vy}" width="${vw}" height="${vh}" rx="16" fill="#090a12"/>
  <g clip-path="url(#${p}vclip)">
${slides}
  </g>
  <rect x="${vx + .6}" y="${vy + .6}" width="${vw - 1.2}" height="${vh - 1.2}" rx="15.4" fill="none" stroke="url(#${p}hair)" stroke-width="1.2"/>
</g>
${segs}
${captions}

<g class="rise" style="animation-delay:.5s">
  <circle cx="${vx + 8}" cy="378" r="3.5" fill="url(#${p}aurd)"/>
  <text class="mb" x="${vx + 20}" y="382" font-size="11" letter-spacing="1.8" fill="${C.mut}">DAILY RINGS</text>
  <path d="M${vx + 120} 378H${vx + vw - 4}" stroke="#fff" stroke-opacity=".08"/>
</g>
${rings}
`;
  return svgWrap(p, W, H, 'About and life', `${P.name}: what I do, and the things I do outside the editor: writing, shipping apps, building extensions.`, defs, body);
}
