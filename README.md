# DANFO

**You are the conductor of a Lagos danfo, not the driver. The bus drives itself. You hang out the door and squeeze in one more fare every stop — until LASTMA's checkpoint appears. Greed vs. the fine.**

▶ **Play now: <https://danfo-oxunify.vercel.app>** (landscape-less portrait, best one-handed on a phone)

A yellow danfo creeps down a Lagos road that recedes to the horizon. The roadside holds stops
with passengers waiting — an ankara-clad woman, a school kid, a man in a suit with a briefcase.
Tap a stop and the bus pulls over by itself; every fare climbs the cash counter, but every
passenger climbs onto the roof, the door frame, the bumper. Passenger number seven is already
illegal — and LASTMA does not warn twice.

## How to play (three lines)

1. **Tap a stop** (or `Space`) to board the people waiting there — the bus pulls over by itself.
2. **Swipe left/right** (or `←` / `→`) to dodge okadas, trucks and potholes — `H` honks.
3. **Watch the passenger counter** — above six seats the bus bulges, fares pay **2× tips**, handling goes slack, and a LASTMA checkpoint (every 25–35s, 3-second warning) means a **₦1,000 fine + a strike**. Three strikes ends the run.

## Run it locally

```bash
git clone https://github.com/unifyWeb3/danfo.git
cd danfo
npm install
npm run dev      # http://localhost:5173
npm run preview  # production build + PWA + offline at http://localhost:4173
```

No backend, no database, no API keys. Phaser 3 + TypeScript, hand-authored SVG sprites, every
sound synthesised with WebAudio. Installs as a PWA and runs fully offline after the first open.

## How it is built

- **Pseudo-3D road** — one vanishing-point projection (`src/game/perspective.ts`) drives stops,
  okadas, trucks, potholes and the LASTMA gate; they shrink toward the horizon as they recede.
- **Hand-authored art** — 24 SVG sprite definitions (`src/art/`), rasterised at 2× and drawn at
  half scale. Zero image files, zero fonts fetched at runtime.
- **One 390×844 portrait canvas** — `Scale.FIT`, device-pixel rendering with a zoomed camera,
  Phaser Canvas renderer, 60fps target on mid-range phones.
- **WebAudio synthesis only** — the engine is a sawtooth + sub-oscillator through a low-pass whose
  pitch and *chug* rate track the load; no audio files anywhere.
- **Persistence** — `localStorage` in `try/catch`. Offline-capable PWA (precache + revision hash).
- **Screen recordings are deterministic** — a `?shot` flag on the deployed build exposes the same
  hooks the dev build uses (`warp`, `fill`, checkpoint trigger), used to capture the clip.

## Development Plan

### The fantasy
*Being the conductor — not the driver — of a Lagos danfo.* The game is a meditation on one job:
everyone is shouting at you, nobody refuses a fare, the bus walks its own route, and the only
thing watching you is a queue of passengers you cannot honestly carry. Every mechanic serves that
tension — the bulging bus, the 2× tip above capacity, the checkpoint with its 3-second warning —
and nothing else: no combat, no territory, no upgrades. The ride is the game; the honesty is the
game. The design is done when a player feels the exact moment of choice the conductor feels:
leave two seats or take the whole crowd, knowing there is a window where, if they are lucky, the
passengers get dropped before LASTMA appears.

### Now (shipped — the loop is complete and playable)
- [x] Core loop: auto-driving danfo, lane swipes, tap-to-pull-over stops, auto-alighting fares
- [x] Greed economy: 6 seats, 2× tip above capacity, visible bulge + hanging passengers
- [x] LASTMA checkpoints every 25–35s with a 3s warning; fine + strike + screen shake; 3 strikes ends the run
- [x] Traffic: okadas that lane-split, trucks that block, potholes that slow you
- [x] Dusk→night art pass: parallax road/city, billboards with jokes ("MAMA TOBI'S PEPPER SOUP")
- [x] WebAudio: engine pitch + chug tied to load, two-tone horn, coin arpeggio, LASTMA fine
- [x] Shareable end card: earnings, tier title (`Agbero's Accountant`, `Oga at the Top`…),
      generated route (`Ojuelegba → Mile 2`), Web Share + clipboard fallback
- [x] PWA (installable + offline), device-pixel rendering, canvas renderer, 60fps target
- [x] `localStorage` best run, one-tap restart, keyboard + touch + mouse

### Next (the first honest update — make the greed legible)
- [ ] **Hot routes** — some corridors pay a multiplier; the greedy conductor starts route-planning
      instead of just stopping-everywhere, which is the skill the game is actually testing
- [ ] **Standing room above the roof** — a second tier of overload with a distinct *visual* seat
      (riders on the roof rack) and worse handling, for the brave
- [ ] **Ranked morning rush** — a seeded "rush hour" mode (5-minute, same seed for everyone on the
      leaderboard), preserving the single-file, no-backend architecture
- [ ] **Daily Lagos weather** — rain beats reduce visibility and double pothole damage; one palette,
      one dataset, no engine change
- [ ] **Haptics** — a short buzz on strikes (Android vibration API only, progressive enhancement)

### Later (if the ride earns a road network)
- [ ] **The full route map** — a navigable network of Lagos corridors with real junction density
- [ ] **Passenger agency** — boarders who actually weigh their chances vs. the cost of the squeeze
- [ ] **Multiplayer "it's full already"** — a shared cash jar where riding in one danfo together
      forces cooperative greed (only if the solo loop is proven; the design comes first)

### How this grows and sustains
DANFO survives because its skill is learned, not purchased. The core loop is stable (drive yourself,
count people, watch the meter) — which means the two things that remain after the jam are (a) content,
and (b) depth, both of which are cheap to add if you are disciplined about scope. Content is posters, routes, outfits, billboards, weather and localisation — the conductor's job
exists wherever overcrowded shared transit is a microcosm of civic life (trotros in Accra, matatus
in Nairobi, jeepneys in Manila, colectivos in Buenos Aires) — and the design translates without
re-engineering. Depth is the
decision-making: the hot-route economy turns the game into a *planning* problem instead of a reflex
problem, the roof-tier turns it into a risk model, and ranked "rush hour" turns it into a shared
benchmark that guarantees people come back on Tuesdays. Maintenance is deliberately boring — no server,
no database, a static PWA behind a CDN with ~1 MB of assets — so a single person can keep it running,
as a demo, as a brand-building artifact, as a design exhibit, or as a slate for paid "ritam" routes
if a partner wants Lagos on their app. The growth engine is the clip you just watched: the game is
a thirty-second story about greed that anyone who has boarded a Lagos danfo already knows, so the ad
costs nothing and the audience arrives pre-sold. The constraint is discipline — cut before adding —
and the milestone list above is the whole roadmap, nothing more.

---

**Pitch (use everywhere):** You are the conductor of a Lagos danfo, not the driver. The bus drives
itself. You hang out the door and squeeze in one more fare every stop — until LASTMA's checkpoint
appears. Greed vs. the fine.
