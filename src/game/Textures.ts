import Phaser from 'phaser'
import { RASTER } from '../config'
import { SPRITES } from '../art/svg'
import { CITY_SPRITES } from '../art/svgCity'

export { TEX_SCALE } from '../config'

export function loadSprites(scene: Phaser.Scene): Promise<void> {
  const defs = [...SPRITES, ...CITY_SPRITES]
  for (const def of defs) {
    // Phaser treats any data: URI as base64, so encode it that way.
    const uri = `data:image/svg+xml;base64,${toBase64(def.svg)}`
    scene.load.svg(def.key, uri, { width: def.w * RASTER, height: def.h * RASTER })
  }
  return new Promise((resolve) => {
    scene.load.once('complete', () => resolve())
    scene.load.start()
  })
}

/** UTF-8 safe base64 for SVG source (btoa alone chokes on non-latin1 chars). */
function toBase64(input: string): string {
  const bytes = new TextEncoder().encode(input)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary)
}

/** Small procedurally drawn textures (road dashes, stars, sun glow). */
export function makeProceduralTextures(scene: Phaser.Scene): void {
  const g = scene.add.graphics()

  // lane dash
  g.clear()
  g.fillStyle(0xf5e6c8, 1).fillRoundedRect(0, 0, 14 * RASTER, 54 * RASTER, 5 * RASTER)
  g.generateTexture('dash', 14 * RASTER, 54 * RASTER)

  // star field
  g.clear()
  const rnd = mulberry(1337)
  for (let i = 0; i < 90; i++) {
    const x = rnd() * 780
    const y = rnd() * 560
    const r = 1 + rnd() * 2.4
    g.fillStyle(0xffffff, 0.35 + rnd() * 0.65).fillCircle(x, y, r)
  }
  g.generateTexture('stars', 780, 560)

  // soft sun / moon disc with a warm glow
  g.clear()
  for (let i = 10; i >= 0; i--) {
    g.fillStyle(0xffffff, 0.05).fillCircle(60, 60, 22 + i * 4)
  }
  g.fillStyle(0xffffff, 1).fillCircle(60, 60, 22)
  g.generateTexture('disc', 120, 120)

  // passenger head (seen through the danfo's rear window)
  g.clear()
  g.fillStyle(0x000000, 0).fillCircle(0, 0, 0)
  g.fillStyle(0x8a5a36, 1).fillCircle(10 * RASTER, 11 * RASTER, 8 * RASTER)
  g.fillStyle(0x241b16, 1).fillCircle(10 * RASTER, 7 * RASTER, 8 * RASTER)
  g.generateTexture('head', 20 * RASTER, 22 * RASTER)

  g.destroy()
}

/** Tiny deterministic PRNG so the star field is stable between runs. */
function mulberry(seed: number): () => number {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
