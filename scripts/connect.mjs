import { C, P, esc, f2, f4, tw, card, svgWrap, anim, animT, enter, blink, dataUri, drawIn, DRAW } from './lib.mjs';
import { glyph, BRAND } from './icons.mjs';

export function connect() {
  const p = 'c-', W = 1200, H = 380;

  /* ---------- left: portrait + pointing hand ---------- */
  const pcx = 150, pcy = 168, pr = 84;
  const portrait = dataUri('portrait-300.jpg', 'image/jpeg');
  const hand = `
<g transform="translate(262 150)">
  ${animT('translate', ['262 150', '276 150', '262 150'], [0, .5, 1], 1.6, { calc: 'spline', splines: '.4 0 .6 1;.4 0 .6 1', loop: true }).replace('type="translate"', 'type="translate"')}
  <g fill="#fff" fill-opacity=".07" stroke="url(#${p}aurd)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
    <path d="M0 14a8 8 0 0 1 8-8h14V4a6 6 0 0 1 6-6h40a6 6 0 0 1 0 12H34v6h4a6 6 0 0 1 0 12h-4v4a6 6 0 0 1-6 6h-2a6 6 0 0 1-2 .3H8a8 8 0 0 1-8-8Z"/>
  </g>
  <path d="M30 4h44" stroke="url(#${p}aur)" stroke-width="2" stroke-linecap="round" opacity=".0"/>
</g>`.replace(/<g transform="translate\(262 150\)">\s*<animateTransform[^>]*\/>/, `<g transform="translate(262 150)"><animateTransform attributeName="transform" type="translate" values="262 150;278 150;262 150" keyTimes="0;.5;1" dur="1.6s" begin="0s" calcMode="spline" keySplines=".4 0 .6 1;.4 0 .6 1" repeatCount="indefinite"/>`);

  const left = `
${card(p, 8, 8, 380, 364, 26)}
<g class="fadeIn" style="animation-delay:.2s">
  <circle cx="${pcx}" cy="${pcy}" r="${pr + 14}" fill="none" stroke="url(#${p}aur)" stroke-width="2" stroke-dasharray="6 9" stroke-linecap="round">${animT('rotate', [`0 ${pcx} ${pcy}`, `360 ${pcx} ${pcy}`], [0, 1], 24, { loop: true })}</circle>
  <circle cx="${pcx}" cy="${pcy}" r="${pr + 5}" fill="none" stroke="#fff" stroke-opacity=".14" stroke-width="1.5"/>
  <image xlink:href="${portrait}" x="${pcx - pr}" y="${pcy - pr}" width="${pr * 2}" height="${pr * 2}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${p}pc)"/>
</g>
${hand}
<g class="rise" style="animation-delay:.5s">
  <text class="d" x="40" y="298" font-size="23" fill="${C.text}">Let's build something.</text>
  <text class="b" x="40" y="324" font-size="13.5" fill="${C.mut}">Open to collabs, ideas and good questions.</text>
  <text class="mb" x="40" y="350" font-size="10.5" letter-spacing="1.6" fill="${C.cyan}">@${esc(P.username)}</text>
</g>`;

  /* ---------- right: link cards ---------- */
  const RX = 404, RW = 788;
  const cw = (RW - 56 - 16) / 2, chh = 84;
  const cards = P.links.map((l, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = RX + 28 + col * (cw + 16), y = 70 + row * (chh + 14);
    const brand = BRAND[l.key === 'website' ? 'website' : l.key === 'vsmarket' ? 'vsmarket' : l.key] ?? C.cyan;
    const d = (i * .09) % 1.2, T = 2.4;
    const kt = [0, d / T, (d + .35) / T, (d + .7) / T, 1].map(f4);
    return `<g class="rise" style="animation-delay:${.3 + i * .08}s">
<rect x="${f2(x)}" y="${y}" width="${f2(cw)}" height="${chh}" rx="16" fill="#fff" fill-opacity=".035" stroke="#fff" stroke-opacity=".08"/>
<rect x="${f2(x + 16)}" y="${y + 16}" width="52" height="52" rx="15" fill="#12141f" stroke="${brand}" stroke-opacity=".55" stroke-width="1.2"/>
<g transform="translate(${f2(x + 42)} ${y + 42}) scale(1.36)">${glyph(l.key)}</g>
<text class="d" x="${f2(x + 84)}" y="${y + 39}" font-size="17" fill="${C.text}">${esc(l.label)}</text>
<text class="m" x="${f2(x + 84)}" y="${y + 60}" font-size="11.5" fill="${C.mut}">${esc(l.handle)}</text>
<g transform="translate(${f2(x + cw - 46)} ${y + 42})" fill="none" stroke="url(#${p}aur)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
  ${animT('translate', [`${f2(x + cw - 46)} ${y + 42}`, `${f2(x + cw - 46)} ${y + 42}`, `${f2(x + cw - 38)} ${y + 42}`, `${f2(x + cw - 46)} ${y + 42}`, `${f2(x + cw - 46)} ${y + 42}`], kt, T, { loop: true, calc: 'spline', splines: '0 0 1 1;.3 0 .5 1;.5 0 .7 1;0 0 1 1' })}
  <path d="M0 0h18M11-7l7 7-7 7"/>
</g>
</g>`;
  }).join('\n');

  const right = `
${card(p, RX, 8, RW, 364, 26)}
<g class="rise" style="animation-delay:.15s">
  <circle cx="${RX + 32}" cy="43" r="3.5" fill="url(#${p}aurd)"/>
  <text class="mb" x="${RX + 44}" y="47" font-size="11" letter-spacing="2" fill="${C.mut}">FIND ME ELSEWHERE</text>
</g>
${cards}`;

  const defs = `<clipPath id="${p}pc"><circle cx="${pcx}" cy="${pcy}" r="${pr}"/></clipPath>`;
  return svgWrap(p, W, H, 'Connect', `Links to ${P.name}: ${P.links.map(l => l.label).join(', ')}.`, defs, left + right);
}
