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
| 2 | Art pass — hand-authored SVG sprite set, parallax, dusk→night | pending | |
| 3 | Traffic + LASTMA checkpoints + strikes | pending | |
| 4 | Juice + WebAudio (horn, engine, coins) | pending | |
| 5 | PWA + shareable end card + localStorage best | pending | |
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
- Zero console errors on both viewports.
