// Seeks the stack SVG through two full React-orbit periods and measures moon-to-core clearance.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import path from 'node:path';
const abs = path.resolve('assets/stack.svg');
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1200, height: 660 } });
await page.goto('file://' + abs);
const res = await page.evaluate(() => {
  const s = document.documentElement; s.pauseAnimations();
  const c = document.querySelector('#s-host'); // anchor for ids
  const core = [...document.querySelectorAll('circle')].find(e => e.getAttribute('r') === '30');
  const cb = core.getBoundingClientRect();
  const cx = cb.x + cb.width / 2, cy = cb.y + cb.height / 2, coreR = cb.width / 2;
  const ids = ['s-moon0', 's-moon1', 's-host'];
  const out = { coreR, worst: {}, overlaps: 0, samples: 0 };
  ids.forEach(i => out.worst[i] = 1e9);
  for (let t = 0; t <= 96; t += 0.25) {
    s.setCurrentTime(t);
    for (const id of ids) {
      const r = document.getElementById(id).getBoundingClientRect();
      const half = Math.hypot(r.width, r.height) / 2;                    // circumscribed radius of the tile
      const d = Math.hypot(r.x + r.width / 2 - cx, r.y + r.height / 2 - cy) - half;
      out.worst[id] = Math.min(out.worst[id], d);
      if (d < coreR) out.overlaps++;
    }
    out.samples++;
  }
  return out;
});
console.log(JSON.stringify(res));
await browser.close();
