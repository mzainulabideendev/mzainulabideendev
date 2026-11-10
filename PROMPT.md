# Prompt: animated GitHub profile README for @mzainulabideendev

Paste this into Claude (with `my_pic.jpeg` and the 2-second waving clip attached) to regenerate or restyle the whole profile.

---

Here are my character images [+ a 2-second video of me waving]. Build a complete animated GitHub profile README as self-contained SVG files.

## About me (taken from github.com/mzainulabideendev)

| Field | Value |
| --- | --- |
| Name | M Zain Ul Abideen (Muhammad Zain Ul Abideen) |
| Role | Full-Stack Developer, .NET Specialist, published author, app and Visual Studio extension builder |
| GitHub | `mzainulabideendev` |
| Location | Sahiwal, Pakistan |
| Company / org | Vector-OS |
| Numbers | 74 public repos, 4 followers, 4 following, 4 app/extension stores, 11 book platforms, 5+ DEV articles |
| Pitch | "I build across the stack and ship to real stores, not just repositories." |
| Status | "Focusing" |
| Skills | C, C++, C#, Java, Python, PHP, JavaScript, TypeScript, HTML, CSS, .NET / ASP.NET Core, Angular, React, MUI, Vite, Flutter, Kotlin, Firebase, MySQL, SQLite, Cloudflare, Git, GitHub, VS Code, Visual Studio, Android Studio, Postman |
| Hobbies | Writing and authoring books (incl. "Logic" for beginner coders), shipping apps to Google Play / Microsoft Store / Uptodown, building Visual Studio extensions, writing engineering posts on DEV |
| Most-starred repos | GitHub-Streak-Card (24), Devforge, Data-Structures-and-Algorithms-C-Sharp-, GameHub, react, dotnet-core-authentication |
| Links | Portfolio mzainulabideen.vercel.app, LinkedIn, Instagram @m.zainulabideenofficial, DEV zainulabdeenofficial, VS Marketplace MZainUlAbideen, Facebook M.ZainulAbdeenoffical.pk |

## Style

Dark "midnight glass" cards (#0d0e16 background) with an aurora accent ramp: cyan #22d3ee, violet #a78bfa, pink #f472b6. Embed a display font and a mono font as base64 woff2 so typography is identical everywhere. Every card: rounded corners, subtle dot texture, gradient hairline border.

## Files to build

1. **hero.svg** - extract every frame of my video, embed them as base64 JPEGs and switch them with SMIL so the clip plays inside the SVG on a short loop (about 4s: play once, hold the last frame ~1.4s, fade, repeat). Mask the video edges so it melts into the background. Frame it like a camera viewfinder: corner brackets that draw in, a blinking REC dot, a filename label and a scrubber bar synced to the loop. On the left: an "open to collabs" pill with a pulsing dot, a typed "Hi there, I'm", my name in a big animated gradient revealed by a rising mask, cycling role lines, a one-line pitch and a meta row (Sahiwal, Pakistan / Vector-OS / 74 repos, 4 followers) with small drawn icons.
2. **about-life.svg** - two cards side by side. Left: an illustration inside a fake browser window (URL `mzainulabideen.vercel.app`, blinking cursor) plus three capability rows with icon tiles (full-stack, mobile and desktop, published and shipped). Right: a carousel of my hobbies (authoring, shipping apps, VS extensions, DEV articles) that slides and crossfades every 4s with Instagram-style segment progress bars, a caption per slide, and three "daily rings" (Code / Write / Learn) that fill on loop.
3. **stack.svg** - tech icons from the Simple Icons set riding three tilted elliptical orbits around a glowing core, plus a grouped chip grid (Frontend / Backend / Mobile / Data & Cloud / Tools) where chip borders glow one after another. Make Vite and TypeScript small moons that orbit the React icon while it travels its own orbit, and keep enough clearance that the moons never overlap the core.
4. **id-dashboard.svg** - a lanyard ID badge that drops in and swings with damped pendulum physics: strap with printed text, metal clasp, my portrait in a frame with a light travelling around it, gold chip, barcode, holographic foil sweep. Beside it a dashboard: KPI tiles whose numbers count up (repos, stores, book platforms, articles), a single-hue bar chart of my most-starred repos with values labelled, and a "now" panel.
5. **connect.svg** - my portrait with a pointing hand on the left, link cards on the right with brand icons and nudging arrows.
6. **README.md** wiring it all together, a projects table, and a workflow using `yoshi389111/github-profile-3d-contrib` so my contributions render as a 3D night-view city, refreshed daily.

## Rules that keep it working

- Only CSS + SMIL animation (GitHub strips JS).
- Nothing loaded from the network: inline every font and image as base64 (PNG or JPEG, not WebP).
- Entrance animations use fill-mode `both`, and SMIL timelines start at `0s` with `keyTimes` for delays, so a renderer that ignores animation still shows the finished card.
- Namespace ids when embedding other SVGs.
- Add `?v=1` cache-busting to every image link in the README.
- Render each file in a browser at several timestamps and check it before handing it over.
