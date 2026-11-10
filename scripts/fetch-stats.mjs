// Refresh data/profile.json counts and data/repos.json (top 6 by stars) from the GitHub API.
// Runs in the daily workflow with GITHUB_TOKEN; locally: GITHUB_TOKEN=... USERNAME=mzainulabideendev node scripts/fetch-stats.mjs
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './lib.mjs';

const user = process.env.USERNAME || 'mzainulabideendev';
const headers = { 'User-Agent': 'profile-readme', Accept: 'application/vnd.github+json' };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
const get = async url => {
  const r = await fetch(url, { headers });
  if (!r.ok) throw new Error(`${url} -> ${r.status}`);
  return r.json();
};

const u = await get(`https://api.github.com/users/${user}`);
const repos = [];
for (let page = 1; page <= 5; page++) {
  const batch = await get(`https://api.github.com/users/${user}/repos?per_page=100&type=owner&page=${page}`);
  repos.push(...batch);
  if (batch.length < 100) break;
}
const top = repos.filter(r => !r.fork && !r.archived && r.name !== user)
  .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.pushed_at) - new Date(a.pushed_at))
  .slice(0, 6)
  .map(r => ({ name: r.name, stars: r.stargazers_count, lang: r.language || 'Docs', desc: (r.description || '').slice(0, 120) }));

const pf = path.join(ROOT, 'data', 'profile.json');
const profile = JSON.parse(fs.readFileSync(pf, 'utf8'));
profile.repos = u.public_repos; profile.followers = u.followers; profile.following = u.following;
fs.writeFileSync(pf, JSON.stringify(profile, null, 2));
fs.writeFileSync(path.join(ROOT, 'data', 'repos.json'), JSON.stringify(top, null, 2));
console.log(`repos=${u.public_repos} followers=${u.followers}; top: ${top.map(t => `${t.name}(${t.stars})`).join(', ')}`);
