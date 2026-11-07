import Phaser from 'phaser'
import { FONT_DISPLAY, FONT_UI, H, TEX_SCALE, W } from '../config'
import { loadBest } from '../game/storage'
import { formatNaira } from '../game/routes'
import { textStyle } from '../game/text'
import { audio } from '../game/AudioKit'
import { setupCamera } from '../game/camera'

export class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title')
  }

  create(): void {
    setupCamera(this)

    const g = this.add.graphics()
    g.fillGradientStyle(0x2a1257, 0x2a1257, 0xc7417c, 0xc7417c, 1)
    g.fillRect(0, 0, W, H * 0.62)
    g.fillGradientStyle(0xc7417c, 0xc7417c, 0xff9b3d, 0xff9b3d, 1)
    g.fillRect(0, H * 0.62 - 1, W, H * 0.2)
    g.fillGradientStyle(0xff9b3d, 0xff9b3d, 0x241528, 0x241528, 1)
    g.fillRect(0, H * 0.82 - 1, W, H * 0.18 + 1)
    g.fillStyle(0x120c1e, 0.55).fillRect(0, 430, W, 150)

    // distant city
    const skyline = this.add
      .tileSprite(0, 232, W, 85, 'skyline')
      .setOrigin(0, 0)
      .setAlpha(0.95)
      .setTileScale(TEX_SCALE)

    this.add.ellipse(W / 2, 474, 210, 22, 0x000000, 0.25).setOrigin(0.5)
    this.add
      .image(W / 2, 352, 'danfo')
      .setScale(TEX_SCALE * 1.5)
      .setAngle(-2)
      .setOrigin(0.5, 0.5)

    this.add
      .text(W / 2, 96, 'DANFO', textStyle({
        fontFamily: FONT_DISPLAY,
        fontSize: '78px',
        color: '#ffd35c',
        stroke: '#2a1257',
        strokeThickness: 11,
      }))
      .setOrigin(0.5)
      .setShadow(0, 8, '#000000', 12, false, true)

    this.add
      .text(W / 2, 505, 'You are the conductor of a Lagos danfo,\nnot the driver.', textStyle({
        fontFamily: FONT_UI,
        fontSize: '19px',
        color: '#ffe9c9',
        align: 'center',
        lineSpacing: 7,
      }))
      .setOrigin(0.5)

    this.add
      .text(W / 2, 565, 'The bus drives itself. Squeeze in one more\nfare every stop — until LASTMA appears.', textStyle({
        fontFamily: FONT_UI,
        fontSize: '15px',
        color: '#f6cfae',
        align: 'center',
        lineSpacing: 6,
      }))
      .setOrigin(0.5)

    const best = loadBest()
    if (best > 0) {
      this.add
        .text(W / 2, 618, `BEST RUN  ${formatNaira(best)}`, textStyle({
          fontFamily: FONT_DISPLAY,
          fontSize: '15px',
          color: '#ffd35c',
        }))
        .setOrigin(0.5)
    }

    const start = this.add
      .text(W / 2, 690, 'TAP TO START', textStyle({
        fontFamily: FONT_DISPLAY,
        fontSize: '30px',
        color: '#12101c',
        backgroundColor: '#ffd35c',
        padding: { x: 26, y: 14 },
      }))
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })

    this.tweens.add({
      targets: start,
      scale: { from: 1, to: 1.06 },
      duration: 780,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })

    const go = () => {
      audio.unlock()
      audio.startEngine()
      this.cameras.main.fadeOut(220, 0, 0, 0)
      this.time.delayedCall(230, () => this.scene.start('Game'))
    }
    start.on('pointerdown', go)
    this.input.keyboard?.once('keydown-SPACE', go)
    this.input.keyboard?.once('keydown-ENTER', go)
    skyline.tilePositionX = 0
  }
}
