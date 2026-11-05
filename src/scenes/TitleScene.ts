import Phaser from 'phaser'
import { FONT_DISPLAY, FONT_UI, H, W } from '../config'
import { loadBest } from '../game/storage'
import { formatNaira } from '../game/routes'

export class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title')
  }

  create(): void {
    const g = this.add.graphics()
    g.fillGradientStyle(0x2a1257, 0x2a1257, 0xff9b3d, 0xff9b3d, 1)
    g.fillRect(0, 0, W, H)
    g.fillStyle(0x1a1030, 0.7).fillRect(0, 0, W, 560)
    g.fillStyle(0x0d0918, 0.55).fillRect(0, 560, W, H - 560)

    this.add
      .image(W / 2, 250, 'danfo')
      .setScale(1.15)
      .setAngle(-2)
      .setOrigin(0.5, 0.5)

    this.add
      .text(W / 2, 92, 'DANFO', {
        fontFamily: FONT_DISPLAY,
        fontSize: '76px',
        color: '#ffd35c',
        stroke: '#2a1257',
        strokeThickness: 10,
      })
      .setOrigin(0.5)
      .setShadow(0, 8, '#000000', 12, false, true)

    this.add
      .text(W / 2, 404, 'You are the conductor of a Lagos danfo,\nnot the driver.', {
        fontFamily: FONT_UI,
        fontSize: '19px',
        color: '#ffe9c9',
        align: 'center',
        lineSpacing: 7,
      })
      .setOrigin(0.5)

    this.add
      .text(W / 2, 474, 'The bus drives itself. Squeeze in one\nmore fare every stop — until LASTMA.', {
        fontFamily: FONT_UI,
        fontSize: '15px',
        color: '#f3c9a8',
        align: 'center',
        lineSpacing: 6,
      })
      .setOrigin(0.5)

    const best = loadBest()
    if (best > 0) {
      this.add
        .text(W / 2, 548, `BEST ${formatNaira(best)}`, {
          fontFamily: FONT_UI,
          fontSize: '14px',
          color: '#ffd35c',
        })
        .setOrigin(0.5)
    }

    const start = this.add
      .text(W / 2, 640, 'TAP TO START', {
        fontFamily: FONT_DISPLAY,
        fontSize: '30px',
        color: '#12101c',
        backgroundColor: '#ffd35c',
        padding: { x: 26, y: 14 },
      })
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
      this.cameras.main.fadeOut(220, 0, 0, 0)
      this.time.delayedCall(230, () => this.scene.start('Game'))
    }
    start.on('pointerdown', go)
    this.input.keyboard?.once('keydown-SPACE', go)
    this.input.keyboard?.once('keydown-ENTER', go)
  }
}
