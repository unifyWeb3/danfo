# DANFO — build log

Jam: **Loadout AI Game Competition** — deadline **Nov 6 2026, 15:00 UTC**.
Stack: Vite + TypeScript + Phaser 3. No backend, no art files — every sprite is hand-authored
SVG in code, every sound is WebAudio synthesis.

Pitch: *You are the conductor of a Lagos danfo, not the driver. The bus drives itself.
You hang out the door and squeeze in one more fare every stop — until LASTMA's checkpoint
appears. Greed vs. the fine.*

## Steps

| # | Step | State | Commit |
|---|---|---|---|
| 0 | Scaffold: Phaser 3, Phaser scenes, pseudo-3D road, input, git init | done | `chore: scaffold danfo` |
| 1 | Core loop + scaling verified by screenshot | done | `feat: core loop and scaling` |
| 2 | Art pass — hand-authored SVG sprite set, parallax, dusk→night | done | `feat: hand-authored svg art pass` |
| 3 | Traffic + LASTMA checkpoints + strikes | done | `feat: traffic, potholes and lastma checkpoints` |
| 4 | Juice + WebAudio (horn, engine, coins) | done | `feat: webaudio synth, engine pitch, horn` |
| 5 | PWA + shareable end card + localStorage best | done | `feat: pwa, offline, shareable end card` |
| 6 | Deploy to Vercel + verify live URL on a phone viewport | pending | |
| 7 | README (how-to + Now/Next/Later), gameplay clip, X post, jam submission | pending | |

## Controls (fixed)

- Bus auto-drives forward. **Swipe left/right** (or **←/→**) changes lane.
- **Tap a stop** (or **Space**) to board its waiting passengers. The bus pulls over by itself.
- **H** or the horn button honks.
- Passenger destinations are stops further down the road; they alight and pay automatically.

## Rules implemented

- Capacity 6 seats. Above 6 = overload: bus bulges, 1–3 passengers hang out of the door,
  handling goes sluggish, and every passenger above 6 pays a **2× tip** on alighting.
- LASTMA checkpoint every 25–35s with a **3 second warning banner**. Passing over capacity =
  **₦1,000 fine + a strike + screen shake**. 3 strikes ends the run.
- Fares: **₦50** on boarding (`Oya enter!`), **₦100 + tip** on alighting (`Drop! Drop!`).
- Cash-out button unlocks at 40s so a healthy run lands in the 40–75s band.

## Verification

### Step 1 — core loop + scaling
- `npm run build` clean (`tsc && vite build`).
- Screenshots via headless Chromium at **390×844** and **1366×720**:
  `shots/step1-core/step1-mobile.png`, `shots/step1-core/step1-desktop.png`.
- Mobile canvas = 390×844, fills the viewport height exactly. Desktop canvas = 333×720,
  centred on a dusk-Lagos CSS backdrop — no black bars.

### Step 2 — art pass
- 24 hand-authored SVG sprite definitions (`src/art/svg.ts`, `src/art/svgCity.ts`),
  rasterised at 2x and drawn at half scale; no image files anywhere.
- Parallax: sky gradient (dusk→night over the run) + stars + skyline tile + road with
  perspective lane dashes + pseudo-3D roadside buildings and billboards.
- 390×844 mobile fills the viewport height; 1366×720 desktop centres on the backdrop.
- Zero console errors.
- `shots/step2-art/` — gameplay, overload (hanging passenger), LASTMA warning, title, end card.

### Step 3 — traffic + checkpoints
- Okada (lane-splitting), truck (wide, hard to pass), pothole (slow + jolt).
- LASTMA gate every 25–35s, banner 3s ahead, fine + strike + shake when over capacity,
  3 strikes ends the run.
- `shots/step2-art/step2-lastma-mobile.png` shows the warning banner and the approaching gate.

### Step 4 — juice + audio
- WebAudio synth only (`src/game/AudioKit.ts`): continuous engine (sawtooth + sub +
  filter through a low-pass, pitch and chug track the load), two-tone horn, coin
  arpeggio, alight chime, collision thud, LASTMA fine, pass jingle.
- Engine: unlocked on the title tap (user gesture); pitch drops as the bus fills up
  and the chug rate follows speed.
- `LAST CHANCE O!` callout when the conductor boards beyond capacity.

### Step 5 — PWA + end card
- vite-plugin-pwa 2.0.0 (generateSW): service worker precaches the whole app,
  `workbox.navigateFallback` + autoUpdate so it installs and runs fully offline.
- Install manifest: DANFO icon set (192/512 + maskable) generated with Playwright.
- localStorage best score in try/catch (`danfo.best.v1`, `danfo.runs.v1`).
- End card now shows the tier title, naira total, route (`Ojuelegba → Mile 2`),
  NEW BEST badge, strikes and a SHARE button (Web Share API, clipboard fallback).
- Verified offline: `npm run preview` + headless check — SW registered, reload
  while offline still boots the game.
