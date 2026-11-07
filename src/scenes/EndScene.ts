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
  private toast!: Phaser.GameObjects.Text

  constructor() {
    super('End')
  }

  create(data: EndSummary): void {
    setupCamera(this)
    this.cameras.main.fadeIn(280, 0, 0, 0)

    const g = this.add.graphics()
    g.fillGradientStyle(0x2a1257, 0x2a1257, 0xc7417c, 0xc7417c, 1)
    g.fillRect(0, 0, W, H * 0.56)
    g.fillGradientStyle(0xc7417c, 0xc7417c, 0xff9b3d, 0xff9b3d, 1)
    g.fillRect(0, H * 0.56 - 1, W, H * 0.16)
    g.fillGradientStyle(0xff9b3d, 0xff9b3d, 0x241528, 0x241528, 1)
    g.fillRect(0, H * 0.72 - 1, W, H * 0.28 + 1)
    g.fillStyle(0x0f0a1a, 0.45).fillRect(0, 300, W, H - 300)

    this.add
      .tileSprite(0, H * 0.72 - 54, W, 85, 'skyline')
      .setOrigin(0, 0)
      .setAlpha(0.85)
      .setTileScale(TEX_SCALE)

    this.add.ellipse(W / 2, 352, 190, 20, 0x000000, 0.3).setOrigin(0.5)
    this.add
      .image(W / 2, 282, 'danfo')
      .setScale(TEX_SCALE * 1.22)
      .setAngle(2)
      .setOrigin(0.5, 0.5)

    this.add
      .text(
        W / 2,
        118,
        data.reason === 'caught' ? 'RUN OVER' : 'CASHED OUT',
        textStyle({
          fontFamily: FONT_UI,
          fontSize: '24px',
          color: '#ffe9c9',
          stroke: '#2a1257',
          strokeThickness: 8,
        }),
      )
      .setOrigin(0.5)
      .setShadow(0, 5, '#000000', 10, false, true)

    this.add
      .text(W / 2, 402, data.title, textStyle({
        fontFamily: FONT_DISPLAY,
        fontSize: '37px',
        color: '#ffd35c',
        align: 'center',
        wordWrap: { width: W - 60 },
        stroke: '#2a1257',
        strokeThickness: 8,
      }))
      .setOrigin(0.5)

    this.add
      .text(W / 2, 492, formatNaira(data.cash), textStyle({
        fontFamily: FONT_DISPLAY,
        fontSize: '68px',
        color: '#ffffff',
        stroke: '#2a1257',
        strokeThickness: 10,
      }))
      .setOrigin(0.5)
      .setShadow(0, 7, '#000000', 14, false, true)

    this.add
      .text(W / 2, 546, data.route, textStyle({
        fontFamily: FONT_UI,
        fontSize: '17px',
        color: '#ffe9c9',
      }))
      .setOrigin(0.5)

    const bestLine = data.isBest
      ? '★ NEW BEST RUN ★'
      : `BEST RUN ${formatNaira(data.best)}`
    const bestColor = data.isBest ? '#9ff0be' : '#ffd9a0'
    this.add
      .text(W / 2, 584, bestLine, textStyle({
        fontFamily: FONT_DISPLAY,
        fontSize: '15px',
        color: bestColor,
      }))
      .setOrigin(0.5)

    // share + ride again
    const shareBtn = this.makeButton(118, 690, 148, 54, 'SHARE', '#1d7a4d', '#9ff0be')
    const againBtn = this.makeButton(272, 690, 148, 54, 'RIDE AGAIN', '#ffd35c', '#12101c')
    shareBtn.on('pointerdown', () => void this.share(data))
    const restart = () => {
      this.cameras.main.fadeOut(220, 0, 0, 0)
      this.time.delayedCall(230, () => this.scene.start('Game'))
    }
    againBtn.on('pointerdown', restart)
    this.input.keyboard?.once('keydown-SPACE', restart)
    this.input.keyboard?.once('keydown-ENTER', restart)

    this.toast = this.add
      .text(W / 2, 762, '', textStyle({
        fontFamily: FONT_UI,
        fontSize: '13px',
        color: '#9ff0be',
      }))
      .setOrigin(0.5)
      .setAlpha(0)
  }

  private makeButton(
    x: number,
    y: number,
    w: number,
    h: number,
    label: string,
    bg: string,
    fg: string,
  ): Phaser.GameObjects.Container {
    const c = this.add.container(x, y)
    const rect = this.add
      .rectangle(0, 0, w, h, Phaser.Display.Color.HexStringToColor(bg).color, 1)
      .setStrokeStyle(2.5, 0x12101c, 0.9)
    const text = this.add
      .text(0, 0, label, textStyle({
        fontFamily: FONT_DISPLAY,
        fontSize: '18px',
        color: fg,
      }))
      .setOrigin(0.5)
    c.add([rect, text])
    c.setSize(w, h).setInteractive({ useHandCursor: true })
    c.on('pointerdown', () => {
      this.tweens.add({ targets: c, scale: 0.92, duration: 90, yoyo: true })
    })
    return c
  }

  private async share(data: EndSummary): Promise<void> {
    const caption = `DANFO — you are the conductor, not the driver.\n${formatNaira(
      data.cash,
    )} on ${data.route}. "${data.title}".\nGreed vs. the fine.`
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: 'DANFO', text: caption, url })
        this.showToast('SHARED!')
        return
      }
      throw new Error('no web share')
    } catch (error) {
      if ((error as Error).name === 'AbortError') return // cancelled on purpose
      try {
        await navigator.clipboard.writeText(`${caption}\n${url}`)
        this.showToast('COPIED TO CLIPBOARD!')
      } catch {
        this.showToast('COPY NOT ALLOWED — SCREENSHOT IT!')
      }
    }
  }

  private showToast(message: string): void {
    this.toast.setText(message).setAlpha(1).setScale(0.8)
    this.tweens.add({ targets: this.toast, scale: 1, duration: 200, ease: 'Back.easeOut' })
    this.tweens.add({ targets: this.toast, alpha: 0, delay: 1600, duration: 320 })
  }
}
