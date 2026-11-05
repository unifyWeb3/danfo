import { BUS_Y, HORIZON_Y, ROAD_BOT_HALF, ROAD_TOP_HALF, W, Z_MAX } from '../config'

/**
 * Tiny pseudo-3D projection.
 *
 * `z` is the distance ahead of the bus in road units:
 *   z = Z_MAX  -> at the horizon (far away, small)
 *   z = 0      -> level with the bus (bottom of the play area)
 *   z < 0      -> already passed, sliding past the camera
 */
export function tAtZ(z: number): number {
  return 1 - z / Z_MAX
}

export function yAtZ(z: number): number {
  return HORIZON_Y + Math.max(0, tAtZ(z)) * (BUS_Y - HORIZON_Y)
}

export function scaleAtZ(z: number): number {
  const t = Math.max(0, tAtZ(z))
  return 0.34 + 0.66 * Math.pow(t, 1.25)
}

/** Half width of the road at a given depth (0 = horizon, 1 = bus). */
export function roadHalfAtT(t: number): number {
  return ROAD_TOP_HALF + (ROAD_BOT_HALF - ROAD_TOP_HALF) * t
}

/** Screen x of a lane (0, 1 or 2) for a given z. */
export function laneXAtZ(lane: number, z: number): number {
  return W / 2 + (lane - 1) * roadHalfAtT(Math.max(0, tAtZ(z)))
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function clamp(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v
}

/** Blend two 0xRRGGBB colours. */
export function mixColor(a: number, b: number, t: number): number {
  const ar = (a >> 16) & 0xff
  const ag = (a >> 8) & 0xff
  const ab = a & 0xff
  const br = (b >> 16) & 0xff
  const bg = (b >> 8) & 0xff
  const bb = b & 0xff
  const r = Math.round(ar + (br - ar) * t)
  const g = Math.round(ag + (bg - ag) * t)
  const bl = Math.round(ab + (bb - ab) * t)
  return (r << 16) | (g << 8) | bl
}
