import Phaser from 'phaser'
import { FONT_DISPLAY, FONT_UI, H, TEX_SCALE, W } from '../config'
import { formatNaira } from '../game/routes'
import { textStyle } from '../game/text'
import { setupCamera } from '../game/camera'

export type EndSummary = {
  cash: number
  strikes: number
  route: string
  title: string
  reason: 'caught' | 'cashout'
  best: number
  isBest: boolean
  runs: number
}

export class EndScene extends Phaser.Scene {
  constructor() {
    super('End')
  }

  create(data: EndSummary): void {
    this.cameras.main.fadeIn(280, 0, 0, 0)
    setupCamera(this)

    const g = this.add.graphics()
    g.fillGradientStyle(0x2a1257, 0x2a1257, 0xc7417c, 0xc7417c, 1)
    g.fillRect(0, 0, W, H * 0.58)
    g.fillGradientStyle(0xc7417c, 0xc7417c, 0xff9b3d, 0xff9b3d, 1)
    g.fillRect(0, H * 0.58 - 1, W, H * 0.18)
    g.fillGradientStyle(0xff9b3d, 0xff9b3d, 0x1d1128, 0x1d1128, 1)
    g.fillRect(0, H * 0.76 - 1, W, H * 0.24 + 1)
    g.fillStyle(0x0f0a1a, 0.55).fillRect(0, 300, W, H - 300)

    this.add
      .tileSprite(0, H * 0.68 - 51, W, 85, 'skyline')
      .setOrigin(0, 0)
      .setAlpha(0.9)
      .setTileScale(TEX_SCALE)

    this.add.ellipse(W / 2, 320, 170, 20, 0x000000, 0.25).setOrigin(0.5)
    this.add
      .image(W / 2, 252, 'danfo')
      .setScale(TEX_SCALE * 1.15)
      .setAngle(2)
      .setOrigin(0.5, 0.5)

    this.add
      .text(
        W / 2,
        104,
        data.reason === 'caught' ? 'RUN OVER' : 'CASHED OUT',
        textStyle({
          fontFamily: FONT_DISPLAY,
          fontSize: '26px',
          color: '#ffffff',
          stroke: '#2a1257',
          strokeThickness: 8,
        }),
      )
      .setOrigin(0.5)
      .setShadow(0, 6, '#000000', 10, false, true)

    this.add
      .text(W / 2, 372, data.title, textStyle({
        fontFamily: FONT_DISPLAY,
        fontSize: '36px',
        color: '#ffd35c',
        align: 'center',
        wordWrap: { width: W - 56 },
        stroke: '#2a1257',
        strokeThickness: 7,
      }))
      .setOrigin(0.5)

    this.add
      .text(W / 2, 452, formatNaira(data.cash), textStyle({
        fontFamily: FONT_DISPLAY,
        fontSize: '64px',
        color: '#ffffff',
        stroke: '#2a1257',
        strokeThickness: 9,
      }))
      .setOrigin(0.5)
      .setShadow(0, 8, '#000000', 14, false, true)

    this.add
      .text(W / 2, 502, `EARNED ON ${data.route}`, textStyle({
        fontFamily: FONT_UI,
        fontSize: '16px',
        color: '#ffe9c9',
      }))
      .setOrigin(0.5)

    if (data.isBest) {
      const badge = this.add
        .text(W / 2, 544, '★ NEW BEST RUN ★', textStyle({
          fontFamily: FONT_DISPLAY,
          fontSize: '17px',
          color: '#12101c',
          backgroundColor: '#9ff0be',
          padding: { x: 12, y: 6 },
        }))
        .setOrigin(0.5)
      this.tweens.add({
        targets: badge,
        scale: { from: 1, to: 1.08 },
        duration: 620,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      })
    } else {
      this.add
        .text(W / 2, 544, `BEST RUN ${formatNaira(data.best)}`, textStyle({
          fontFamily: FONT_UI,
          fontSize: '14px',
          color: '#ffd9a0',
        }))
        .setOrigin(0.5)
    }

    const again = this.add
      .text(W / 2, 660, 'RIDE AGAIN', textStyle({
        fontFamily: FONT_DISPLAY,
        fontSize: '26px',
        color: '#12101c',
        backgroundColor: '#ffd35c',
        padding: { x: 28, y: 14 },
      }))
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })

    const restart = () => {
      this.cameras.main.fadeOut(220, 0, 0, 0)
      this.time.delayedCall(230, () => this.scene.start('Game'))
    }
    again.on('pointerdown', restart)
    this.input.keyboard?.once('keydown-SPACE', restart)
    this.input.keyboard?.once('keydown-ENTER', restart)
  }
}
