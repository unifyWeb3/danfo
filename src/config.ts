/**
 * DANFO — global tuning constants.
 * The game runs on a fixed 390x844 portrait logical canvas (Phaser Scale.FIT).
 */

export const W = 390
export const H = 844

/* ---------- pseudo-3D road ---------- */
export const HORIZON_Y = 300
export const BUS_Y = 664
/** How far ahead (in road units) objects spawn at the horizon. */
export const Z_MAX = 2.2
/** Half width of the road at the horizon / at the bottom of the screen. */
export const ROAD_TOP_HALF = 56
export const ROAD_BOT_HALF = 138

export const LANE_COUNT = 3

/* ---------- economy ---------- */
export const CAPACITY = 6
export const FARE_BOARD = 50
export const FARE_MAIN = 100
export const TIP = 50
export const FINE = 1000
export const MAX_STRIKES = 3

/* ---------- pacing ---------- */
/** Road units travelled per second. */
export const BASE_SPEED = 0.36
export const STOP_MIN_GAP = 2.9
export const STOP_MAX_GAP = 4.4
export const TRAFFIC_MIN_GAP = 1.5
export const TRAFFIC_MAX_GAP = 3.1
export const POTHOLE_MIN_GAP = 5.5
export const POTHOLE_MAX_GAP = 9
export const CHECKPOINT_MIN = 25_000
export const CHECKPOINT_MAX = 35_000
/** Cash-out button unlocks here (runs land in the 40-75s band). */
export const CASH_OUT_AT = 40_000
/** LASTMA gate drives itself at a constant rate so the warning stays honest. */
export const GATE_SPEED = 0.36
/** z-window in which a roadside stop can be boarded. */
export const LOAD_FAR = 0.46
export const LOAD_NEAR = 0.03

/* ---------- type ---------- */
export const FONT_DISPLAY = '"Archivo Black", "Arial Black", "Helvetica Neue", Impact, system-ui, sans-serif'
export const FONT_UI = '"Archivo", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'

/* ---------- palettes ---------- */
export const DUSK = {
  skyTop: 0x2a1257,
  skyMid: 0xc7417c,
  skyLow: 0xff9b3d,
  sun: 0xffe08a,
  far: 0x47235f,
  mid: 0x5a2a58,
  tint: 0xffffff,
  stars: 0,
}

export const NIGHT = {
  skyTop: 0x06070f,
  skyMid: 0x1d1045,
  skyLow: 0x5b2565,
  sun: 0xdfe7ff,
  far: 0x1a1436,
  mid: 0x241644,
  tint: 0x9fb4ff,
  stars: 1,
}

export const COLORS = {
  cash: 0xffd35c,
  danger: 0xff5a5f,
  good: 0x7ef0a5,
  nightRoad: 0x211d2a,
  duskRoad: 0x35303d,
}
