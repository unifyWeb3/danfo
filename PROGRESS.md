# DANFO — build log

Jam: **Loadout AI Game Competition** — deadline **Nov 6 2026, 15:00 UTC** (passed; today is Nov 7).
Stack: Vite + TypeScript + Phaser 3. No backend, no art or audio files.

Pitch: *You are the conductor of a Lagos danfo, not the driver. The bus drives itself.
You hang out the door and squeeze in one more fare every stop — until LASTMA's checkpoint
appears. Greed vs. the fine.*

## Steps

| # | Step | State | Commit |
|---|---|---|---|
| 1 | Core loop + scaling verified by screenshot | done | `517caca` |
| 2 | Art pass — hand-authored SVG sprite set, parallax, dusk→night | done | `059309f` |
| 3 | Traffic + LASTMA checkpoints + strikes | done | `059309f` |
| 4 | Juice + WebAudio (horn, engine, coins) | done | `4b2b4f1` |
| 5 | PWA + shareable end card + localStorage best | done | `cb7db80` |
| 6 | Deploy to Vercel, live URL verified on a phone viewport | done | `efd6b80`, `f2aace9` |
| 7 | README + submission pack + gameplay clip | done (X/form blocked) | `f2aace9` + this commit |

## Live

- **https://danfo-oxunify.vercel.app** — public, no login, canvas fills the phone viewport.
  Vercel project `danfo` (prj_bdcAd770xkTRK0DDSbPRMQ1V86Ln), production branch `master`,
  SSO protection disabled to match the wick project (public game link, as the jam requires).
- **https://github.com/unifyWeb3/danfo** — public source.
- `npm run preview` → the PWA is precached and reloads fully offline (verified with
  `context.setOffline(true)` + reload, canvas and all).

## Verification (headless Chromium, 390×844 + 1366×720)

- `npm run build` clean. No console errors on title → game → overload → LASTMA → end.
- **Canvas fills the phone viewport height** (390×844 exact); desktop centres the portrait game
  on a themed dusk-Lagos backdrop — no black bars.
- Loop wired: tap stop (or `Space`) → bus pulls over itself → `OYA ENTER!` + coin burst →
  `DROP! DROP!` on auto-alighting → cash counter pops.
- Overload: bus visibly bulges, figures hang out of the door (1 at >6, 2 at >8, 3 at >10),
  engine drops in pitch + chug slows, handling goes slack.
- LASTMA gate every 25–35s, 3s warning banner, fine + strike + red flash + shake when over
  capacity, 3 strikes ends the run; cash-out button unlocks at 40s.
- 60fps headless after switching to Phaser's canvas renderer (WebGL/SwiftShader was ~8fps;
  canvas runs ~60fps on the CPU-rendered box, which is also what makes the clip smooth).
- `shots/` — mobile/desktop captures for every state (game, overload, LASTMA, title, end card).

## Clip

- `clip/danfo-clip.mp4` — **15.84s**, 780×1688 phone-format H.264, 25 fps, recorded on the
  **deployed site** via Playwright (`?shot` flag) to show: title → TAP TO START → boarding →
  coin burst → overloaded bus (8/6) → LASTMA AHEAD! → `FINED ₦1000!` → cash out → end card.

## Known limitations

- Audio can't be verified headlessly; the synth graph was written to the WebAudio spec and
  unlocked on the title tap.
- The `?shot` flag exposes warp/fill hooks on the deployed build (invisible, harmless; used to
  record deterministic screenshots and the clip).
- 1.25MB bundle; Phaser is the biggest chunk. Fine for a jam; no code-splitting added (cut, not add).

## Blocked (needs the user)

1. **X post** with `clip/danfo-clip.mp4` tagging `@loadoutprotocol` — no X credentials in this
   environment. Draft is in `SUBMISSION.md`.
2. **Form submission at app.loadout.xyz/jam** — no credentials in this environment, and the
   deadline (Nov 6 2026, 15:00 UTC) has already passed. Submission pack is `SUBMISSION.md`.

## What was NOT verified

- Real-device (actual phone hardware) frame rate — headless-only testing on CPU rendering.
- Form/X posting (blocked, above).
