/**
 * Hand-authored flat SVG sprites. Everything the game draws lives here as
 * source code — there are no image files in this project.
 *
 * Each definition is authored at "design size" and rasterised at 2x by
 * src/game/Textures.ts, then drawn at half scale (see TEX_SCALE) so the
 * result is crisp on a 2x phone screen.
 */

export interface SpriteDef {
  key: string
  /** design width in logical pixels */
  w: number
  /** design height in logical pixels */
  h: number
  svg: string
}

const wrap = (w: number, h: number, body: string): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`

/* ------------------------------------------------------------------ danfo */

const danfo = wrap(
  220,
  150,
  `
  <defs>
    <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffd73e"/>
      <stop offset="0.62" stop-color="#f2b91d"/>
      <stop offset="1" stop-color="#d9990f"/>
    </linearGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0" stop-color="#6fd3e8"/>
      <stop offset="0.45" stop-color="#2b6f96"/>
      <stop offset="1" stop-color="#17364f"/>
    </linearGradient>
  </defs>

  <!-- roof rack -->
  <rect x="26" y="4" width="168" height="9" rx="4" fill="#7a6a4a"/>
  <rect x="42" y="-4" width="10" height="10" rx="3" fill="#5d5138"/>
  <rect x="168" y="-4" width="10" height="10" rx="3" fill="#5d5138"/>

  <!-- body -->
  <path d="M10 24 Q10 14 22 14 L198 14 Q210 14 210 24 L214 126 Q214 140 200 140 L20 140 Q6 140 6 126 Z" fill="url(#body)"/>
  <!-- lower shadow band -->
  <path d="M6 112 L214 112 L214 126 Q214 140 200 140 L20 140 Q6 140 6 126 Z" fill="#c9850c" opacity="0.55"/>

  <!-- black stripe -->
  <rect x="4" y="62" width="212" height="26" fill="#17151c"/>
  <rect x="4" y="62" width="212" height="4" fill="#2b2733" opacity="0.8"/>

  <!-- rear window -->
  <rect x="52" y="24" width="116" height="32" rx="7" fill="#3a2a10"/>
  <rect x="56" y="28" width="108" height="24" rx="5" fill="url(#glass)"/>
  <path d="M64 30 L96 30 L74 50 L58 50 Z" fill="#ffffff" opacity="0.22"/>
  <!-- window divider -->
  <rect x="107" y="28" width="5" height="24" fill="#3a2a10" opacity="0.85"/>

  <!-- rust patches -->
  <path d="M18 92 q14 -7 26 2 q-10 10 -26 6 z" fill="#a85a1f" opacity="0.85"/>
  <path d="M172 98 q16 -9 30 1 q-12 11 -30 7 z" fill="#a85a1f" opacity="0.7"/>
  <path d="M96 16 q10 -5 18 1 q-8 6 -18 3 z" fill="#b26a26" opacity="0.6"/>

  <!-- door on the right (danfo doors open on the right-hand side) -->
  <rect x="178" y="22" width="30" height="84" rx="4" fill="#17151c" opacity="0.92"/>
  <rect x="182" y="28" width="22" height="30" rx="3" fill="#2b6f96"/>
  <rect x="181" y="64" width="24" height="4" rx="2" fill="#f2b91d" opacity="0.6"/>

  <!-- tail lights -->
  <circle cx="34" cy="116" r="13" fill="#7c2020"/>
  <circle cx="34" cy="116" r="9" fill="#ff5b4a"/>
  <circle cx="31" cy="113" r="3" fill="#ffd9c9" opacity="0.85"/>
  <circle cx="186" cy="116" r="13" fill="#7c2020"/>
  <circle cx="186" cy="116" r="9" fill="#ff5b4a"/>
  <circle cx="183" cy="113" r="3" fill="#ffd9c9" opacity="0.85"/>

  <!-- plate -->
  <rect x="88" y="110" width="46" height="17" rx="3" fill="#f4efe2"/>
  <text x="111" y="123" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="bold" fill="#2a2530" text-anchor="middle">LAG-482</text>

  <!-- bumper + mud -->
  <rect x="14" y="134" width="192" height="12" rx="6" fill="#3b3742"/>
  <rect x="24" y="140" width="172" height="6" rx="3" fill="#241f2b" opacity="0.8"/>
  <rect x="30" y="96" width="160" height="5" rx="2" fill="#8a5a22" opacity="0.35"/>

  <!-- danfo sticker -->
  <rect x="28" y="68" width="40" height="16" rx="4" fill="#f4efe2" opacity="0.92"/>
  <text x="48" y="80" font-family="Arial, Helvetica, sans-serif" font-size="10" font-weight="bold" fill="#17151c" text-anchor="middle">LAGOS</text>
  `,
)

/* -------------------------------------------------------------- passengers */

const paxAnkara = wrap(
  74,
  116,
  `
  <path d="M37 6 q16 0 16 16 q0 12 -16 12 q-16 0 -16 -12 q0 -16 16 -16 z" fill="#3a2418"/>
  <path d="M22 20 q15 -14 30 0 q6 12 -2 22 q-13 9 -26 0 q-8 -10 -2 -22 z" fill="#e0497f"/>
  <circle cx="37" cy="30" r="12" fill="#8a5a36"/>
  <path d="M25 26 q12 -12 24 0 q2 -12 -12 -14 q-14 2 -12 14 z" fill="#e0497f"/>
  <path d="M22 52 q15 -8 30 0 l6 60 l-42 0 z" fill="#f0b429"/>
  <path d="M22 52 q15 -8 30 0 l2 16 q-17 8 -34 0 z" fill="#1f8f6b"/>
  <path d="M30 54 l7 58 l-15 0 z" fill="#e0497f" opacity="0.75"/>
  <path d="M44 54 l-7 58 l15 0 z" fill="#e0497f" opacity="0.75"/>
  <circle cx="37" cy="70" r="7" fill="#e0497f"/>
  <rect x="22" y="110" width="13" height="6" rx="3" fill="#2b2733"/>
  <rect x="39" y="110" width="13" height="6" rx="3" fill="#2b2733"/>
  <rect x="52" y="60" width="10" height="26" rx="5" fill="#8a5a36"/>
  `,
)

const paxSuit = wrap(
  74,
  116,
  `
  <circle cx="37" cy="24" r="15" fill="#8a5a36"/>
  <path d="M23 18 q14 -12 28 0 q0 -12 -14 -12 q-14 0 -14 12 z" fill="#221c26"/>
  <path d="M18 52 l19 -8 l19 8 l4 56 l-46 0 z" fill="#2b3f66"/>
  <path d="M33 46 l4 0 l0 34 l-8 0 z" fill="#f4efe2"/>
  <path d="M37 46 l5 12 l-5 22 l-5 -22 z" fill="#c9433f"/>
  <path d="M18 52 l13 6 l-11 12 z" fill="#1f2b48"/>
  <path d="M56 52 l-13 6 l11 12 z" fill="#1f2b48"/>
  <rect x="14" y="74" width="11" height="34" rx="5" fill="#8a5a36"/>
  <rect x="49" y="74" width="11" height="34" rx="5" fill="#8a5a36"/>
  <rect x="22" y="106" width="14" height="8" rx="3" fill="#1c1822"/>
  <rect x="38" y="106" width="14" height="8" rx="3" fill="#1c1822"/>
  <rect x="56" y="88" width="16" height="20" rx="3" fill="#7a4a24"/>
  <rect x="56" y="92" width="16" height="4" fill="#3b2a18"/>
  `,
)

const paxSchool = wrap(
  74,
  116,
  `
  <circle cx="37" cy="24" r="15" fill="#7a4a2a"/>
  <path d="M22 18 q15 -13 30 0 q1 -13 -15 -13 q-16 0 -15 13 z" fill="#1d1a24"/>
  <path d="M20 52 q17 -8 34 0 l4 56 l-42 0 z" fill="#2f8f5b"/>
  <path d="M37 48 l9 12 l-9 12 l-9 -12 z" fill="#f4efe2"/>
  <path d="M20 62 q17 8 34 0 l1 10 q-18 8 -36 0 z" fill="#f4efe2" opacity="0.85"/>
  <rect x="14" y="74" width="11" height="34" rx="5" fill="#7a4a2a"/>
  <rect x="49" y="74" width="11" height="34" rx="5" fill="#7a4a2a"/>
  <rect x="22" y="106" width="14" height="8" rx="3" fill="#2b2733"/>
  <rect x="38" y="106" width="14" height="8" rx="3" fill="#2b2733"/>
  <rect x="8" y="56" width="16" height="34" rx="7" fill="#c9433f"/>
  <rect x="8" y="62" width="16" height="5" fill="#f4efe2" opacity="0.6"/>
  `,
)

const paxCasual = wrap(
  74,
  116,
  `
  <circle cx="37" cy="24" r="15" fill="#9a6640"/>
  <path d="M22 18 q15 -13 30 0 q0 -12 -15 -12 q-15 0 -15 12 z" fill="#2b1f18"/>
  <path d="M18 52 q19 -8 38 0 l4 56 l-46 0 z" fill="#2f9fae"/>
  <path d="M18 52 q19 -8 38 0 l1 12 q-20 -8 -40 0 z" fill="#25838f"/>
  <rect x="14" y="74" width="11" height="34" rx="5" fill="#9a6640"/>
  <rect x="49" y="74" width="11" height="34" rx="5" fill="#9a6640"/>
  <rect x="20" y="86" width="34" height="26" fill="#33507d"/>
  <rect x="22" y="106" width="14" height="8" rx="3" fill="#f4efe2"/>
  <rect x="38" y="106" width="14" height="8" rx="3" fill="#f4efe2"/>
  <rect x="52" y="58" width="12" height="24" rx="6" fill="#9a6640"/>
  `,
)

const paxHang = wrap(
  66,
  96,
  `
  <circle cx="30" cy="16" r="14" fill="#8a5a36"/>
  <path d="M16 10 q14 -12 28 0 q0 -11 -14 -11 q-14 0 -14 11 z" fill="#e0497f"/>
  <path d="M16 38 q14 -8 28 0 l6 52 l-40 0 z" fill="#f0b429"/>
  <path d="M14 40 l-8 22 l9 3 l8 -20 z" fill="#8a5a36"/>
  <path d="M46 40 l10 14 l-8 6 l-10 -12 z" fill="#8a5a36"/>
  <rect x="18" y="88" width="12" height="8" rx="3" fill="#2b2733"/>
  <rect x="36" y="88" width="12" height="8" rx="3" fill="#2b2733"/>
  `,
)

/* -------------------------------------------------------------- roadside */

const stopSign = wrap(
  120,
  160,
  `
  <rect x="52" y="60" width="10" height="98" rx="4" fill="#8d93a3"/>
  <rect x="52" y="60" width="4" height="98" fill="#c3c8d6" opacity="0.7"/>
  <rect x="24" y="140" width="26" height="10" rx="4" fill="#6f7585"/>
  <rect x="64" y="140" width="26" height="10" rx="4" fill="#6f7585"/>
  <rect x="6" y="8" width="108" height="58" rx="10" fill="#116b47"/>
  <rect x="6" y="8" width="108" height="58" rx="10" fill="none" stroke="#0c4c34" stroke-width="5"/>
  <rect x="16" y="20" width="88" height="34" rx="6" fill="#f2f6f2"/>
  <text x="60" y="35" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="bold" fill="#116b47" text-anchor="middle">BUS</text>
  <text x="60" y="51" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="bold" fill="#116b47" text-anchor="middle">STOP</text>
  <circle cx="60" cy="66" r="4" fill="#f2f6f2" opacity="0.5"/>
  `,
)

const pothole = wrap(
  100,
  48,
  `
  <path d="M8 30 q16 -18 42 -16 q28 2 42 16 q-12 14 -42 14 q-30 0 -42 -14 z" fill="#151119"/>
  <path d="M18 30 q14 -10 32 -9 q20 1 32 9 q-14 8 -32 8 q-20 0 -32 -8 z" fill="#0a0810"/>
  <path d="M4 22 l14 -4 l-8 10 z" fill="#3b3742"/>
  <path d="M96 22 l-14 -4 l8 10 z" fill="#3b3742"/>
  <path d="M26 40 l10 -3 l-6 8 z" fill="#3b3742" opacity="0.8"/>
  <path d="M74 40 l-10 -3 l6 8 z" fill="#3b3742" opacity="0.8"/>
  `,
)

const coin = wrap(
  32,
  32,
  `
  <circle cx="16" cy="16" r="14" fill="#c98f18"/>
  <circle cx="16" cy="15" r="12" fill="#ffd35c"/>
  <circle cx="16" cy="15" r="9" fill="none" stroke="#c98f18" stroke-width="1.6"/>
  <text x="16" y="21" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="bold" fill="#8a5c07" text-anchor="middle">N</text>
  <rect x="9" y="19" width="14" height="1.6" fill="#8a5c07"/>
  <rect x="9" y="23" width="14" height="1.6" fill="#8a5c07"/>
  `,
)

const gate = wrap(
  300,
  120,
  `
  <rect x="8" y="96" width="22" height="22" rx="4" fill="#2b2733"/>
  <rect x="270" y="96" width="22" height="22" rx="4" fill="#2b2733"/>
  <rect x="14" y="70" width="16" height="30" rx="4" fill="#8d93a3"/>
  <rect x="270" y="70" width="16" height="30" rx="4" fill="#8d93a3"/>
  <rect x="0" y="56" width="300" height="24" rx="6" fill="#f2f0ea"/>
  <g fill="#d33a3a">
    <rect x="4" y="56" width="26" height="24"/>
    <rect x="56" y="56" width="26" height="24"/>
    <rect x="108" y="56" width="26" height="24"/>
    <rect x="160" y="56" width="26" height="24"/>
    <rect x="212" y="56" width="26" height="24"/>
    <rect x="264" y="56" width="26" height="24"/>
  </g>
  <rect x="92" y="4" width="116" height="44" rx="8" fill="#c22d2d"/>
  <rect x="92" y="4" width="116" height="44" rx="8" fill="none" stroke="#f2f0ea" stroke-width="4"/>
  <text x="150" y="34" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="bold" fill="#ffffff" text-anchor="middle">LASTMA</text>
  `,
)

export const SPRITES: SpriteDef[] = [
  { key: 'danfo', w: 220, h: 150, svg: danfo },
  { key: 'pax_ankara', w: 74, h: 116, svg: paxAnkara },
  { key: 'pax_suit', w: 74, h: 116, svg: paxSuit },
  { key: 'pax_school', w: 74, h: 116, svg: paxSchool },
  { key: 'pax_casual', w: 74, h: 116, svg: paxCasual },
  { key: 'pax_hang', w: 66, h: 96, svg: paxHang },
  { key: 'stop', w: 120, h: 160, svg: stopSign },
  { key: 'pothole', w: 100, h: 48, svg: pothole },
  { key: 'coin', w: 32, h: 32, svg: coin },
  { key: 'gate', w: 300, h: 120, svg: gate },
]
