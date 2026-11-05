import Phaser from 'phaser'

/**
 * Boot: build every texture the game needs, then hand over to the title.
 *
 * Step 1 uses flat placeholder shapes; step 2 swaps this for the hand-authored
 * SVG sprite set (src/art/svg.ts). Nothing else in the game knows the difference.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot')
  }

  create(): void {
    this.makePlaceholderTextures()
    this.scene.start('Title')
  }

  private makePlaceholderTextures(): void {
    const g = this.add.graphics()

    // danfo (rear view) — 200x120
    g.clear()
    g.fillStyle(0xf4c026).fillRoundedRect(0, 0, 200, 120, 10)
    g.fillStyle(0x151318).fillRect(0, 44, 200, 20)
    g.fillStyle(0x9c5a22).fillRoundedRect(14, 74, 40, 22, 5)
    g.fillStyle(0x2a2f3d).fillRoundedRect(52, 16, 96, 26, 6)
    g.fillStyle(0xff4b4b).fillCircle(26, 104, 9).fillCircle(174, 104, 9)
    g.generateTexture('danfo', 200, 120)

    // passenger
    g.clear()
    g.fillStyle(0x2a2f3d).fillCircle(30, 16, 15)
    g.fillStyle(0x2f8f83).fillRoundedRect(14, 30, 32, 56, 8)
    g.generateTexture('pax', 60, 86)

    // hanging passenger
    g.clear()
    g.fillStyle(0x2a2f3d).fillCircle(26, 14, 13)
    g.fillStyle(0xd8447a).fillRoundedRect(12, 26, 28, 50, 7)
    g.generateTexture('pax_hang', 52, 76)

    // bus stop sign
    g.clear()
    g.fillStyle(0x6f7686).fillRect(26, 26, 8, 84)
    g.fillStyle(0x1f7a4d).fillRoundedRect(0, 0, 60, 34, 6)
    g.fillStyle(0xffffff).fillRect(8, 14, 44, 6)
    g.generateTexture('stop', 60, 110)

    // okada
    g.clear()
    g.fillStyle(0x1b1d24).fillCircle(20, 42, 16).fillCircle(76, 42, 16)
    g.fillStyle(0xe2553f).fillRoundedRect(30, 22, 42, 18, 6)
    g.fillStyle(0x2a2f3d).fillCircle(46, 14, 12)
    g.generateTexture('okada', 96, 60)

    // truck
    g.clear()
    g.fillStyle(0x2f4f7a).fillRoundedRect(0, 0, 100, 110, 8)
    g.fillStyle(0x8fb6d6).fillRoundedRect(4, 8, 92, 30, 5)
    g.fillStyle(0x1b1d24).fillCircle(24, 104, 14).fillCircle(78, 104, 14)
    g.generateTexture('truck', 100, 120)

    // pothole
    g.clear()
    g.fillStyle(0x120f18).fillEllipse(44, 22, 76, 34)
    g.generateTexture('pothole', 88, 44)

    // coin
    g.clear()
    g.fillStyle(0xffd35c).fillCircle(14, 14, 12)
    g.fillStyle(0xc08a1e).fillCircle(14, 14, 8)
    g.generateTexture('coin', 28, 28)

    // road dash
    g.clear()
    g.fillStyle(0xf5e6c8, 1).fillRoundedRect(0, 0, 14, 54, 5)
    g.generateTexture('dash', 14, 54)

    // LASTMA gate arm
    g.clear()
    g.fillStyle(0xf2f0ea).fillRect(0, 0, 280, 22)
    g.fillStyle(0xd33a3a).fillRect(0, 0, 280, 22).fillStyle(0xf2f0ea)
    for (let x = 0; x < 280; x += 56) g.fillRect(x, 0, 28, 22)
    g.fillStyle(0x1d2b45).fillRoundedRect(96, -44, 88, 34, 5)
    g.generateTexture('gate', 280, 22)

    g.destroy()
  }
}
