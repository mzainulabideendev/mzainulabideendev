import { C, P, REPOS, esc, f2, f4, tw, card, svgWrap, anim, animT, enter, countUp, blink, dataUri, drawIn, DRAW } from './lib.mjs';

export function idDashboard() {
  const p = 'd-', W = 1200, H = 620;
  const LOOP = 10;

  /* ================= LANYARD ================= */
  const PX = 194, PY = 8;                       // pendulum pivot
  const bx = 84, by = 172, bw = 220, bh = 340;  // badge
  const AMP = 8;

  // drop + damped swing timeline (seconds within a 10s loop)
  const dropT = [0, .8, .98, 1.12];
  const dropV = ['0 -580', '0 0', '0 -9', '0 0'];
  const dropK = dropT.map(t => f4(t / LOOP)).concat([1]);
  const dropVals = dropV.concat(['0 0']);
  const dropSpl = '.55 0 .95 .45;.2 .6 .4 1;.4 0 .6 1;0 0 1 1';

  const swing = [];                // [time, angle]
  swing.push([0, 0], [.7, 0]);
  let t = 1.0, a = AMP;
  const half = .66;
  for (let i = 0; i < 11; i++) {
    swing.push([t, i === 0 ? AMP : +a.toFixed(3)]);
    t += half * (1 + i * .012);   // slight lengthening as amplitude decays
    a = -a * .72;
  }
  swing.push([t, 0], [LOOP, 0]);
  const swingK = swing.map(([tt]) => f4(Math.min(tt / LOOP, 1)));
  const swingV = swing.map(([, ang]) => `${f2(ang)} ${PX} ${PY}`);
  const swingSpl = swing.slice(1).map((_, i) => (i < 1 ? '.4 0 .6 1' : '.37 0 .63 1')).join(';');

  // name fit
  let nameSize = 19;
  while (tw('display', P.name, nameSize) > 188) nameSize -= .5;

  // barcode from the username
  let bars = '', bxp = bx + 78;
  const seed = P.username;
  for (let i = 0; i < 46 && bxp < bx + bw - 22; i++) {
    const wv = 1 + ((seed.charCodeAt(i % seed.length) * (i + 3)) % 3);
    bars += `<rect x="${f2(bxp)}" y="${by + 288}" width="${wv}" height="28" fill="#fff" fill-opacity=".85"/>`;
    bxp += wv + 1.6 + ((i * 7) % 3) * .8;
  }

  const portrait = dataUri('portrait-300.jpg', 'image/jpeg');
  const pfx = bx + 40, pfy = by + 68, pfs = 140;

  const strapUnit = 'MZAINULABIDEENDEV  •  DEV PASS  •  FULL-STACK  •  ';
  const strapPeriod = tw('monob', strapUnit, 8.4, 2.2);
  const strapText = strapUnit.repeat(4);

  const lanyard = `
<clipPath id="${p}lc"><rect x="8" y="8" width="372" height="604" rx="26"/></clipPath>
<clipPath id="${p}strap"><rect x="${PX - 15}" y="-30" width="30" height="${by - 56 + 30}"/></clipPath>
<clipPath id="${p}badge"><rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="20"/></clipPath>
<clipPath id="${p}ph"><rect x="${pfx}" y="${pfy}" width="${pfs}" height="${pfs}" rx="20"/></clipPath>
<linearGradient id="${p}metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4f5fa"/><stop offset=".35" stop-color="#9aa0b8"/><stop offset=".6" stop-color="#e3e5f0"/><stop offset="1" stop-color="#6c7290"/></linearGradient>
<linearGradient id="${p}gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff0b8"/><stop offset=".45" stop-color="#e0b44c"/><stop offset="1" stop-color="#9c7421"/></linearGradient>
<linearGradient id="${p}strapg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.violet}"/><stop offset="1" stop-color="${C.pink}"/></linearGradient>
<linearGradient id="${p}foil" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".25" stop-color="${C.cyan}" stop-opacity=".9"/><stop offset=".5" stop-color="${C.violet}" stop-opacity=".9"/><stop offset=".75" stop-color="${C.pink}" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="${p}light" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.cyan}"/><stop offset="1" stop-color="${C.pink}"/></linearGradient>`;

  const badge = `
<g>
  <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="20" fill="#0f101a"/>
  <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="20" fill="url(#${p}glass)"/>
  <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="20" fill="url(#${p}dots)"/>
  <rect x="${bx + .7}" y="${by + .7}" width="${bw - 1.4}" height="${bh - 1.4}" rx="19.3" fill="none" stroke="url(#${p}hair)" stroke-width="1.4"/>
  <rect x="${bx + 88}" y="${by + 9}" width="44" height="9" rx="4.5" fill="#05060a" stroke="#fff" stroke-opacity=".16"/>
  <text class="mb" x="${bx + 22}" y="${by + 44}" font-size="10" letter-spacing="2" fill="${C.cyan}">DEV PASS</text>
  <text class="m" x="${bx + bw - 22}" y="${by + 44}" font-size="10" text-anchor="end" fill="${C.mut}">2026</text>
  <rect x="${bx + 22}" y="${by + 52}" width="${bw - 44}" height="1.5" rx=".75" fill="url(#${p}aur)" fill-opacity=".8"/>
  <image xlink:href="${portrait}" x="${pfx}" y="${pfy}" width="${pfs}" height="${pfs}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${p}ph)"/>
  <rect x="${pfx}" y="${pfy}" width="${pfs}" height="${pfs}" rx="20" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="1.5"/>
  <rect x="${pfx - 3}" y="${pfy - 3}" width="${pfs + 6}" height="${pfs + 6}" rx="23" fill="none" stroke="url(#${p}light)" stroke-width="3" stroke-linecap="round" pathLength="100" stroke-dasharray="16 84" stroke-dashoffset="0">${anim('stroke-dashoffset', [0, -100], [0, 1], 3.2, { loop: true })}</rect>
  <text class="d" x="${bx + bw / 2}" y="${by + 236}" text-anchor="middle" font-size="${nameSize}" fill="#fff">${esc(P.name)}</text>
  <text class="mb" x="${bx + bw / 2}" y="${by + 255}" text-anchor="middle" font-size="10.5" letter-spacing="1.6" fill="${C.cyan}">FULL-STACK · .NET</text>
  <text class="m" x="${bx + bw / 2}" y="${by + 272}" text-anchor="middle" font-size="10" fill="${C.mut}">@${esc(P.username)}</text>
  <rect x="${bx + 22}" y="${by + 288}" width="40" height="30" rx="6" fill="url(#${p}gold)"/>
  <path d="M${bx + 22} ${by + 298}h40M${bx + 22} ${by + 308}h40M${bx + 38} ${by + 288}v30M${bx + 46} ${by + 288}v30" stroke="#7a5a14" stroke-width="1" fill="none" stroke-opacity=".7"/>
  <rect x="${bx + 30}" y="${by + 296}" width="24" height="14" rx="3" fill="none" stroke="#7a5a14" stroke-opacity=".7"/>
  ${bars}
  <text class="m" x="${bx + bw / 2}" y="${by + 332}" text-anchor="middle" font-size="7.5" letter-spacing="2.4" fill="${C.dim}">MZ-DEV-2026</text>
  <g clip-path="url(#${p}badge)"><g>${animT('translate', ['-160 0', '-160 0', '420 0', '420 0'], [0, .18, .5, 1], 5, { loop: true, calc: 'spline', splines: '0 0 1 1;.5 0 .5 1;0 0 1 1' })}<rect x="${bx}" y="${by - 20}" width="70" height="${bh + 40}" fill="url(#${p}foil)" opacity=".26" transform="skewX(-18)"/></g></g>
</g>`;

  const clasp = `
<g>
  <rect x="${PX - 11}" y="${by - 66}" width="22" height="34" rx="6" fill="url(#${p}metal)" stroke="#fff" stroke-opacity=".3"/>
  <rect x="${PX - 4}" y="${by - 58}" width="8" height="12" rx="3" fill="#2a2c40"/>
  <ellipse cx="${PX}" cy="${by - 8}" rx="8.5" ry="14.5" fill="none" stroke="url(#${p}metal)" stroke-width="3.2"/>
  <rect x="${PX - 7}" y="${by - 34}" width="14" height="12" rx="3" fill="url(#${p}metal)"/>
</g>`;

  const strap = `
<g clip-path="url(#${p}strap)">
  <rect x="${PX - 15}" y="-30" width="30" height="${by}" fill="url(#${p}strapg)"/>
  <path d="M${PX - 15} -30v${by}M${PX + 15} -30v${by}" stroke="#fff" stroke-opacity=".25"/>
  <g>${animT('translate', ['0 0', `0 ${f2(strapPeriod)}`], [0, 1], 6, { loop: true })}<text class="mb" transform="translate(${PX + 3.2} ${f2(-26 - strapPeriod)}) rotate(90)" font-size="8.4" letter-spacing="2.2" fill="#fff" fill-opacity=".82">${esc(strapText)}</text></g>
</g>`;

  const left = `
${card(p, 8, 8, 372, 604, 26)}
<g clip-path="url(#${p}lc)">
  <ellipse cx="${PX}" cy="560" rx="96" ry="12" fill="#000" opacity=".35"/>
  <g>${animT('translate', dropVals, dropK, LOOP, { loop: true, calc: 'spline', splines: dropSpl })}
    <g>${animT('rotate', swingV, swingK, LOOP, { loop: true, calc: 'spline', splines: swingSpl })}
${strap}${badge}${clasp}
    </g>
  </g>
  <rect x="${PX - 24}" y="8" width="48" height="10" rx="5" fill="#1b1d2e" stroke="#fff" stroke-opacity=".12"/>
</g>
<text class="mb" x="30" y="596" font-size="10" letter-spacing="2" fill="${C.dim}">ISSUED 2026 · VALID: ALWAYS</text>`;

  /* ================= DASHBOARD ================= */
  const DX = 396, DW = 796;
  const kpis = [
    { l: 'REPOSITORIES', v: P.repos, s: '', c: C.cyan },
    { l: 'APP STORES', v: P.stores, s: '', c: C.violet },
    { l: 'BOOK PLATFORMS', v: P.bookPlatforms, s: '', c: C.pink },
    { l: 'DEV ARTICLES', v: P.articles, s: '+', c: C.cyan },
  ];
  const kgap = 14, kw = (DW - 56 - kgap * 3) / 4, ky = 76, kh = 96;
  const kEls = kpis.map((k, i) => {
    const x = DX + 28 + i * (kw + kgap);
    return `<g class="rise" style="animation-delay:${.2 + i * .1}s">
<rect x="${f2(x)}" y="${ky}" width="${f2(kw)}" height="${kh}" rx="16" fill="#fff" fill-opacity=".035" stroke="#fff" stroke-opacity=".08"/>
<rect x="${f2(x + 16)}" y="${ky + 18}" width="14" height="3" rx="1.5" fill="${k.c}"/>
<text class="mb" x="${f2(x + 16)}" y="${ky + 40}" font-size="10" letter-spacing="1.6" fill="${C.mut}">${k.l}</text>
${countUp('d', f2(x + 16), ky + 78, 36, k.v, k.s, C.text, { delay: .5 + i * .12, dur: 1.6, cycle: LOOP })}
</g>`;
  }).join('\n');

  // bar chart
  const cx0 = DX + 28, cy0 = 190, cw = 478, ch = 404;
  const data = REPOS.filter(r => typeof r.stars === 'number').sort((a, b) => b.stars - a.stars).slice(0, 6);
  const maxS = Math.max(1, ...data.map(d => d.stars));
  const barX = cx0 + 190, barMax = cx0 + cw - 70 - barX;
  const trunc = (s, n) => (s.length > n ? s.slice(0, n - 1) + '…' : s);
  const bEls = data.map((d, i) => {
    const y = cy0 + 70 + i * 54;
    const w = Math.max(4, (d.stars / maxS) * barMax);
    return `<g class="slideL" style="animation-delay:${.5 + i * .1}s">
<text class="b" x="${cx0 + 20}" y="${y + 9}" font-size="13" fill="${C.text}">${esc(trunc(d.name, 21))}</text>
<text class="m" x="${cx0 + 20}" y="${y + 26}" font-size="10" fill="${C.mut}">${esc(d.lang)}</text>
<rect x="${barX}" y="${y - 4}" width="${barMax}" height="20" rx="10" fill="#fff" fill-opacity=".05"/>
<rect x="${barX}" y="${y - 4}" width="${f2(w)}" height="20" rx="10" fill="${C.cyan}" fill-opacity=".92">${enter('width', 0, f2(w), .6 + i * .12, 1)}</rect>
<text class="mb" x="${f2(barX + w + 10)}" y="${y + 11}" font-size="13" fill="${C.text}">${d.stars}${enter('x', f2(barX + 10), f2(barX + w + 10), .6 + i * .12, 1).replace('<animate ', '<animate ')}</text>
</g>`;
  }).join('\n');

  const chart = `
<g class="rise" style="animation-delay:.4s">
<rect x="${cx0}" y="${cy0}" width="${cw}" height="${ch}" rx="18" fill="#fff" fill-opacity=".03" stroke="#fff" stroke-opacity=".08"/>
<text class="mb" x="${cx0 + 20}" y="${cy0 + 32}" font-size="11" letter-spacing="1.8" fill="${C.mut}">MOST-STARRED REPOS</text>
<text class="m" x="${cx0 + cw - 20}" y="${cy0 + 32}" font-size="10" text-anchor="end" fill="${C.dim}">stars · public repos</text>
<path d="M${cx0 + 20} ${cy0 + 46}H${cx0 + cw - 20}" stroke="#fff" stroke-opacity=".08"/>
</g>
${bEls}`;

  // now panel
  const nx = DX + 28 + cw + 14, nw = DX + DW - 28 - nx;
  const nowItems = [
    { k: 'BUILDING', v: 'Visual Studio extensions', c: C.cyan },
    { k: 'WRITING', v: 'Engineering posts on DEV, weekly', c: C.violet },
    { k: 'SHIPPING', v: 'Google Play · Microsoft Store · Uptodown', c: C.pink },
    { k: 'LEARNING', v: 'Always refining the .NET craft', c: C.cyan },
  ];
  const nEls = nowItems.map((it, i) => {
    const y = cy0 + 82 + i * 76;
    return `<g class="slideL" style="animation-delay:${.6 + i * .12}s">
<rect x="${nx + 16}" y="${y}" width="3" height="52" rx="1.5" fill="${it.c}"/>
<text class="mb" x="${nx + 30}" y="${y + 14}" font-size="10" letter-spacing="1.8" fill="${it.c}">${it.k}</text>
${wrap(it.v, nw - 48, 13).map((ln, j) => `<text class="b" x="${nx + 30}" y="${y + 33 + j * 17}" font-size="13" fill="${C.text}">${esc(ln)}</text>`).join('')}
</g>`;
  }).join('\n');

  function wrap(s, maxW, size) {
    const words = s.split(' '), lines = [];
    let cur = '';
    for (const w of words) {
      const t = cur ? cur + ' ' + w : w;
      if (tw('body', t, size) > maxW && cur) { lines.push(cur); cur = w; } else cur = t;
    }
    lines.push(cur);
    return lines;
  }

  const now = `
<g class="rise" style="animation-delay:.5s">
<rect x="${nx}" y="${cy0}" width="${nw}" height="${ch}" rx="18" fill="#fff" fill-opacity=".03" stroke="#fff" stroke-opacity=".08"/>
<circle cx="${nx + 24}" cy="${cy0 + 28}" r="4.5" fill="${C.pink}"/>
<circle cx="${nx + 24}" cy="${cy0 + 28}" r="4.5" fill="none" stroke="${C.pink}" stroke-width="1.5" opacity="0">${anim('r', [4.5, 13], [0, 1], 1.8, { loop: true })}${anim('opacity', [.8, 0], [0, 1], 1.8, { loop: true })}</circle>
<text class="mb" x="${nx + 38}" y="${cy0 + 32}" font-size="11" letter-spacing="1.8" fill="${C.mut}">NOW</text>
<rect x="${nx + nw - 86}" y="${cy0 + 16}" width="68" height="22" rx="11" fill="${C.cyan}" fill-opacity=".1" stroke="${C.cyan}" stroke-opacity=".5"/>
<text class="mb" x="${nx + nw - 52}" y="${cy0 + 31}" font-size="10" text-anchor="middle" fill="${C.cyan}">Focusing</text>
<path d="M${nx + 16} ${cy0 + 46}H${nx + nw - 16}" stroke="#fff" stroke-opacity=".08"/>
</g>
${nEls}`;

  const header = `
<g class="rise" style="animation-delay:.1s">
<text class="mb" x="${DX + 28}" y="42" font-size="11" letter-spacing="2" fill="${C.mut}">DASHBOARD</text>
<text class="d" x="${DX + 28}" y="64" font-size="0" fill="${C.text}"> </text>
<circle cx="${f2(DX + DW - 28 - tw('monob', 'LIVE · SYNCED DAILY', 10.5, 1.8) - 14)}" cy="38" r="4" fill="${C.cyan}">${blink(1.4, .15)}</circle>
<text class="mb" x="${DX + DW - 28}" y="42" font-size="10.5" letter-spacing="1.8" text-anchor="end" fill="${C.cyan}">LIVE · SYNCED DAILY</text>
</g>`;

  const defs = lanyard;
  const body = `
${left}
${card(p, DX, 8, DW, 604, 26)}
${header}
${kEls}
${chart}
${now}
`;
  return svgWrap(p, W, H, 'ID badge and dashboard', `Lanyard ID badge for ${P.name} with a dashboard of repositories, stores, book platforms and the most-starred repos.`, defs, body);
}
