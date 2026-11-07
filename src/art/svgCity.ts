/**
 * Hand-authored flat SVG sprites — city, traffic and signage.
 * See src/art/svg.ts for the authoring conventions.
 */
import type { SpriteDef } from './svg'

const wrap = (w: number, h: number, body: string): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`

/* ---------------------------------------------------------------- skyline */

const skyline = wrap(
  1200,
  170,
  `
  <g fill="#3b2350">
    <path d="M10 170 L10 96 L52 96 L52 78 L96 78 L96 170 Z"/>
    <path d="M104 170 L104 118 L150 118 L150 170 Z"/>
    <path d="M158 170 L158 64 L196 64 L196 46 L238 46 L238 64 L262 64 L262 170 Z"/>
    <path d="M270 170 L270 104 L330 104 L330 170 Z"/>
    <path d="M338 170 L338 84 L366 84 L366 70 L420 70 L420 170 Z"/>
    <path d="M428 170 L428 116 L482 116 L482 170 Z"/>
    <path d="M490 170 L490 56 L530 56 L530 36 L586 36 L586 56 L612 56 L612 170 Z"/>
    <path d="M620 170 L620 100 L676 100 L676 170 Z"/>
    <path d="M684 170 L684 72 L716 72 L716 58 L770 58 L770 72 L796 72 L796 170 Z"/>
    <path d="M804 170 L804 112 L858 112 L858 170 Z"/>
    <path d="M866 170 L866 88 L906 88 L906 68 L958 68 L958 88 L984 88 L984 170 Z"/>
    <path d="M992 170 L992 120 L1050 120 L1050 170 Z"/>
    <path d="M1058 170 L1058 76 L1090 76 L1090 60 L1148 60 L1148 76 L1174 76 L1174 170 Z"/>
  </g>
  <g fill="#ffcf7a" opacity="0.85">
    <rect x="20" y="108" width="6" height="8"/><rect x="36" y="108" width="6" height="8"/>
    <rect x="60" y="90" width="6" height="8"/><rect x="76" y="108" width="6" height="8"/>
    <rect x="170" y="78" width="6" height="8"/><rect x="186" y="96" width="6" height="8"/>
    <rect x="216" y="60" width="6" height="8"/><rect x="232" y="96" width="6" height="8"/>
    <rect x="350" y="96" width="6" height="8"/><rect x="384" y="84" width="6" height="8"/>
    <rect x="502" y="70" width="6" height="8"/><rect x="540" y="50" width="6" height="8"/>
    <rect x="566" y="88" width="6" height="8"/><rect x="700" y="88" width="6" height="8"/>
    <rect x="736" y="72" width="6" height="8"/><rect x="772" y="104" width="6" height="8"/>
    <rect x="880" y="104" width="6" height="8"/><rect x="930" y="80" width="6" height="8"/>
    <rect x="1074" y="92" width="6" height="8"/><rect x="1120" y="72" width="6" height="8"/>
  </g>
  `,
)

/* -------------------------------------------------------------- buildings */

const buildingA = wrap(
  190,
  240,
  `
  <rect x="10" y="60" width="170" height="176" fill="#4a2b4e"/>
  <rect x="10" y="60" width="170" height="176" fill="none" stroke="#341d39" stroke-width="5"/>
  <rect x="22" y="76" width="62" height="40" rx="4" fill="#ffd35c"/>
  <text x="53" y="101" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="bold" fill="#3a2418" text-anchor="middle">MAMA</text>
  <text x="53" y="115" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#3a2418" text-anchor="middle">TOBI</text>
  <rect x="96" y="76" width="72" height="40" rx="4" fill="#1f8f6b"/>
  <text x="132" y="94" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="bold" fill="#f4efe2" text-anchor="middle">BARBER</text>
  <text x="132" y="109" font-family="Arial, Helvetica, sans-serif" font-size="10" fill="#f4efe2" text-anchor="middle">CUT & SLICE</text>
  <rect x="24" y="130" width="66" height="54" rx="4" fill="#ffc94d" opacity="0.9"/>
  <rect x="100" y="130" width="66" height="54" rx="4" fill="#2f6f96" opacity="0.85"/>
  <rect x="0" y="184" width="190" height="52" fill="#e2622f"/>
  <path d="M0 184 h24 l12 52 h-24 z" fill="#f4efe2" opacity="0.85"/>
  <path d="M48 184 h24 l12 52 h-24 z" fill="#f4efe2" opacity="0.85"/>
  <path d="M96 184 h24 l12 52 h-24 z" fill="#f4efe2" opacity="0.85"/>
  <path d="M144 184 h24 l22 52 h-24 z" fill="#f4efe2" opacity="0.85"/>
  <rect x="0" y="228" width="190" height="12" fill="#241f2b"/>
  `,
)

const buildingB = wrap(
  170,
  280,
  `
  <rect x="12" y="40" width="146" height="236" fill="#53306b"/>
  <rect x="12" y="40" width="146" height="236" fill="none" stroke="#3a1f4d" stroke-width="5"/>
  <rect x="40" y="8" width="90" height="34" rx="6" fill="#f4efe2"/>
  <rect x="72" y="14" width="26" height="22" fill="#d33a3a"/>
  <rect x="60" y="24" width="50" height="8" fill="#d33a3a"/>
  <g fill="#ffc94d" opacity="0.75">
    <rect x="26" y="58" width="24" height="30" rx="3"/>
    <rect x="60" y="58" width="24" height="30" rx="3"/>
    <rect x="94" y="58" width="24" height="30" rx="3"/>
    <rect x="128" y="58" width="18" height="30" rx="3"/>
  </g>
  <g fill="#ffc94d" opacity="0.5">
    <rect x="26" y="108" width="24" height="30" rx="3"/>
    <rect x="60" y="108" width="24" height="30" rx="3"/>
    <rect x="94" y="108" width="24" height="30" rx="3"/>
    <rect x="128" y="108" width="18" height="30" rx="3"/>
  </g>
  <rect x="20" y="186" width="130" height="34" rx="6" fill="#116b47"/>
  <text x="85" y="209" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="bold" fill="#f4efe2" text-anchor="middle">PHARMACY</text>
  <rect x="30" y="232" width="110" height="44" rx="4" fill="#1d1830"/>
  <rect x="0" y="270" width="170" height="10" fill="#241f2b"/>
  `,
)

const buildingC = wrap(
  220,
  200,
  `
  <rect x="8" y="50" width="204" height="140" fill="#7a3f36"/>
  <rect x="8" y="50" width="204" height="140" fill="none" stroke="#5a2b25" stroke-width="5"/>
  <rect x="18" y="66" width="184" height="30" rx="4" fill="#f4efe2"/>
  <text x="110" y="87" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="bold" fill="#7a3f36" text-anchor="middle">ODELE MARKET</text>
  <g>
    <rect x="14" y="104" width="60" height="44" fill="#f0b429"/>
    <rect x="80" y="104" width="60" height="44" fill="#e2622f"/>
    <rect x="146" y="104" width="60" height="44" fill="#2f9fae"/>
  </g>
  <g fill="#f4efe2" opacity="0.8">
    <path d="M14 104 h15 l8 44 h-15 z"/><path d="M44 104 h15 l8 44 h-15 z"/><path d="M74 104 h15 l8 44 h-15 z"/>
    <path d="M106 104 h15 l8 44 h-15 z"/><path d="M136 104 h15 l8 44 h-15 z"/><path d="M166 104 h15 l8 44 h-15 z"/>
  </g>
  <g fill="#2b2733">
    <circle cx="30" cy="126" r="7"/><circle cx="52" cy="120" r="6"/>
    <circle cx="96" cy="124" r="7"/><circle cx="118" cy="118" r="6"/>
    <circle cx="162" cy="126" r="7"/><circle cx="184" cy="120" r="6"/>
  </g>
  <rect x="0" y="190" width="220" height="10" fill="#241f2b"/>
  `,
)

const buildingD = wrap(
  160,
  300,
  `
  <rect x="10" y="24" width="140" height="272" fill="#3d4a6b"/>
  <rect x="10" y="24" width="140" height="272" fill="none" stroke="#2a3450" stroke-width="5"/>
  <g fill="#ffc94d" opacity="0.8">
    <rect x="24" y="40" width="22" height="26" rx="3"/><rect x="58" y="40" width="22" height="26" rx="3"/><rect x="92" y="40" width="22" height="26" rx="3"/><rect x="126" y="40" width="14" height="26" rx="3"/>
    <rect x="24" y="96" width="22" height="26" rx="3"/><rect x="92" y="96" width="22" height="26" rx="3"/><rect x="126" y="96" width="14" height="26" rx="3"/>
    <rect x="24" y="152" width="22" height="26" rx="3"/><rect x="58" y="152" width="22" height="26" rx="3"/><rect x="126" y="152" width="14" height="26" rx="3"/>
    <rect x="24" y="208" width="22" height="26" rx="3"/><rect x="92" y="208" width="22" height="26" rx="3"/>
  </g>
  <g fill="#f4efe2" opacity="0.35">
    <rect x="18" y="78" width="124" height="8" rx="4"/>
    <rect x="18" y="134" width="124" height="8" rx="4"/>
    <rect x="18" y="190" width="124" height="8" rx="4"/>
    <rect x="18" y="246" width="124" height="8" rx="4"/>
  </g>
  <rect x="44" y="256" width="72" height="40" rx="4" fill="#1d1830"/>
  <rect x="0" y="290" width="160" height="10" fill="#241f2b"/>
  `,
)

const buildingE = wrap(
  230,
  250,
  `
  <rect x="14" y="86" width="202" height="154" fill="#8a3b52"/>
  <rect x="14" y="86" width="202" height="154" fill="none" stroke="#64293a" stroke-width="5"/>
  <rect x="24" y="102" width="182" height="46" rx="6" fill="#ffd35c"/>
  <text x="115" y="124" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="bold" fill="#3a2418" text-anchor="middle">RADIO NAIJA</text>
  <text x="115" y="142" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="bold" fill="#3a2418" text-anchor="middle">FM 98.3</text>
  <rect x="30" y="160" width="80" height="52" rx="4" fill="#2f6f96"/>
  <rect x="120" y="160" width="80" height="52" rx="4" fill="#1f8f6b"/>
  <rect x="0" y="230" width="230" height="20" fill="#e2622f"/>
  <rect x="24" y="20" width="182" height="62" rx="8" fill="#2b2733"/>
  <rect x="24" y="20" width="182" height="62" rx="8" fill="none" stroke="#ffd35c" stroke-width="4"/>
  <text x="115" y="48" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="bold" fill="#ffd35c" text-anchor="middle">DANFO FM</text>
  <text x="115" y="68" font-family="Arial, Helvetica, sans-serif" font-size="12" fill="#f4efe2" text-anchor="middle">GREED VS THE FINE</text>
  `,
)

/* -------------------------------------------------------------- billboards */

const billboardPepper = wrap(
  260,
  120,
  `
  <rect x="40" y="78" width="14" height="42" fill="#6f5a3a"/>
  <rect x="206" y="78" width="14" height="42" fill="#6f5a3a"/>
  <rect x="0" y="0" width="260" height="84" rx="8" fill="#e2622f"/>
  <rect x="0" y="0" width="260" height="84" rx="8" fill="none" stroke="#ffd35c" stroke-width="5"/>
  <text x="130" y="34" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="bold" fill="#fff4e2" text-anchor="middle">MAMA TOBI&apos;S</text>
  <text x="130" y="62" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="bold" fill="#ffd35c" text-anchor="middle">PEPPER SOUP</text>
  `,
)

const billboardJoke = wrap(
  260,
  120,
  `
  <rect x="40" y="78" width="14" height="42" fill="#6f5a3a"/>
  <rect x="206" y="78" width="14" height="42" fill="#6f5a3a"/>
  <rect x="0" y="0" width="260" height="84" rx="8" fill="#116b47"/>
  <rect x="0" y="0" width="260" height="84" rx="8" fill="none" stroke="#f4efe2" stroke-width="5"/>
  <text x="130" y="34" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="bold" fill="#f4efe2" text-anchor="middle">NO FUEL FOR</text>
  <text x="130" y="62" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="bold" fill="#ffd35c" text-anchor="middle">DEAD PETROL</text>
  `,
)

/* ----------------------------------------------------------------- traffic */

const okada = wrap(
  130,
  96,
  `
  <ellipse cx="28" cy="78" rx="20" ry="18" fill="#17151c"/>
  <ellipse cx="28" cy="78" rx="9" ry="9" fill="#8d93a3"/>
  <ellipse cx="104" cy="78" rx="20" ry="18" fill="#17151c"/>
  <ellipse cx="104" cy="78" rx="9" ry="9" fill="#8d93a3"/>
  <path d="M28 78 L70 44 L104 78 Z" fill="#3b3742"/>
  <path d="M40 72 q16 -22 34 -26 l14 -4 l10 12 l-14 8 q-14 8 -24 18 z" fill="#e2553f"/>
  <path d="M96 30 l-8 -18 l22 -6 l8 20 z" fill="#2f4f7a"/>
  <circle cx="70" cy="46" r="11" fill="#f2b91d"/>
  <path d="M60 40 q10 -8 20 0 q4 -12 -10 -13 q-14 1 -10 13 z" fill="#d33a3a"/>
  <path d="M58 44 q12 6 24 0 l-2 12 q-10 6 -20 0 z" fill="#f4efe2" opacity="0.7"/>
  <path d="M62 58 l-10 18 l12 4 l10 -16 z" fill="#2f4f7a"/>
  <path d="M40 74 q-8 6 -12 4 l4 -10 z" fill="#3b3742"/>
  <circle cx="26" cy="40" r="9" fill="#ffd35c"/>
  `,
)

const truck = wrap(
  150,
  190,
  `
  <rect x="10" y="46" width="130" height="120" rx="8" fill="#2f6f96"/>
  <rect x="10" y="46" width="130" height="120" rx="8" fill="none" stroke="#1d4a68" stroke-width="5"/>
  <rect x="22" y="60" width="106" height="46" rx="4" fill="#f4efe2" opacity="0.92"/>
  <text x="75" y="80" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="bold" fill="#2f6f96" text-anchor="middle">LAGOS</text>
  <text x="75" y="98" font-family="Arial, Helvetica, sans-serif" font-size="12" fill="#2f6f96" text-anchor="middle">LOGISTICS</text>
  <rect x="22" y="118" width="48" height="36" rx="3" fill="#24567a"/>
  <rect x="80" y="118" width="48" height="36" rx="3" fill="#24567a"/>
  <path d="M10 46 q0 -12 14 -12 l112 0 q14 0 14 12 l0 12 l-140 0 z" fill="#e2622f"/>
  <circle cx="32" cy="170" r="17" fill="#17151c"/>
  <circle cx="32" cy="170" r="7" fill="#8d93a3"/>
  <circle cx="118" cy="170" r="17" fill="#17151c"/>
  <circle cx="118" cy="170" r="7" fill="#8d93a3"/>
  <rect x="0" y="184" width="150" height="6" fill="#241f2b" opacity="0.6"/>
  `,
)

export const CITY_SPRITES: SpriteDef[] = [
  { key: 'skyline', w: 1200, h: 170, svg: skyline },
  { key: 'building_a', w: 190, h: 240, svg: buildingA },
  { key: 'building_b', w: 170, h: 280, svg: buildingB },
  { key: 'building_c', w: 220, h: 200, svg: buildingC },
  { key: 'building_d', w: 160, h: 300, svg: buildingD },
  { key: 'building_e', w: 230, h: 250, svg: buildingE },
  { key: 'billboard_pepper', w: 260, h: 120, svg: billboardPepper },
  { key: 'billboard_joke', w: 260, h: 120, svg: billboardJoke },
  { key: 'okada', w: 130, h: 96, svg: okada },
  { key: 'truck', w: 150, h: 190, svg: truck },
]
