import Phaser from 'phaser'
import { FONT_DISPLAY, FONT_UI, H, W } from '../config'
import { formatNaira } from '../game/routes'

export class EndScene extends Phaser.Scene {
  constructor() {
    super('End')
  }

  create(data: { cash: number; title: string; route: string; strikes: number }): void {
    const g = this.add.graphics()
    g.fillGradientStyle(0x2a1257, 0x2a1257, 0xd4573c, 0xd4573c, 1)
    g.fillRect(0, 0, W, H)

    this.add
      .text(W / 2, 96, data.title, {
        fontFamily: FONT_DISPLAY,
        fontSize: '34px',
        color: '#ffd35c',
        align: 'center',
        wordWrap: { width: W - 60 },
      })
      .setOrigin(0.5)
      .setShadow(0, 6, '#000000', 10, false, true)

    this.add
      .text(W / 2, 190, formatNaira(data.cash), {
        fontFamily: FONT_DISPLAY,
        fontSize: '62px',
        color: '#ffffff',
      })
      .setOrigin(0.5)
      .setShadow(0, 6, '#000000', 12, false, true)

    this.add
      .text(W / 2, 246, data.route, { fontFamily: FONT_UI, fontSize: '18px', color: '#ffe9c9' })
      .setOrigin(0.5)

    const again = this.add
      .text(W / 2, 560, 'RIDE AGAIN', {
        fontFamily: FONT_DISPLAY,
        fontSize: '26px',
        color: '#12101c',
        backgroundColor: '#ffd35c',
        padding: { x: 28, y: 14 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
    again.on('pointerdown', () => {
      this.cameras.main.fadeOut(220, 0, 0, 0)
      this.time.delayedCall(230, () => this.scene.start('Game'))
    })
    this.input.keyboard?.once('keydown-SPACE', () => again.emit('pointerdown'))
  }
}
