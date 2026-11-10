// Render an SVG in headless Chrome at several timestamps (seeks SMIL + CSS animations).
// usage: node scripts/shot.mjs assets/hero.svg 0,0.5,1,2,3 [outDir] [--img]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import path from 'node:path';
import fs from 'node:fs';

const [file, times = '0,1,2,3', outDir = '/tmp/claude-0/-home-claude/dc94eb03-8a86-5fe5-925d-8549be1f6d81/scratchpad/shots'] = process.argv.slice(2);
const asImg = process.argv.includes('--img');
fs.mkdirSync(outDir, { recursive: true });
const abs = path.resolve(file);
const src = fs.readFileSync(abs, 'utf8');
const m = src.match(/viewBox="0 0 (\d+) (\d+)"/);
const W = +m[1], H = +m[2];
const base = path.basename(file, '.svg');

const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
const errors = [];
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('pageerror', e => errors.push(String(e)));

if (process.argv.includes('--static')) {
  // simulate a renderer that ignores animation: strip every SMIL element, kill CSS animation
  const stripped = src.replace(/<animate(Transform|Motion)?\b[^>]*?(\/>|>[\s\S]*?<\/animate\1?>)/g, '').replace('<style>', '<style>*{animation:none!important}');
  const f = path.join(outDir, `${base}-static.svg`);
  fs.writeFileSync(f, stripped);
  await page.goto('file://' + f);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(200);
  const out = path.join(outDir, `${base}-static.png`);
  await page.screenshot({ path: out });
  console.log('static (no animation) ->', out);
} else if (asImg) {
  const html = path.join(outDir, `${base}-wrap.html`);
  fs.writeFileSync(html, `<body style="margin:0;background:#ffffff"><img src="file://${abs}" width="${W}" height="${H}"></body>`);
  await page.goto('file://' + html);
  await page.waitForTimeout(1800);
  const out = path.join(outDir, `${base}-img.png`);
  await page.screenshot({ path: out });
  console.log('img render ->', out);
} else {
  for (const t of times.split(',').map(Number)) {
    await page.goto('file://' + abs);
    await page.evaluate(async t => {
      await document.fonts.ready;
      const s = document.documentElement;
      s.pauseAnimations();
      s.setCurrentTime(t);
      document.getAnimations().forEach(a => { try { a.pause(); a.currentTime = t * 1000; } catch {} });
    }, t);
    await page.waitForTimeout(150);
    const out = path.join(outDir, `${base}-t${String(t).replace('.', '_')}.png`);
    await page.screenshot({ path: out });
    console.log('t=' + t, '->', out);
  }
}
if (errors.length) console.log('PAGE ERRORS:', errors.slice(0, 5));
await browser.close();
