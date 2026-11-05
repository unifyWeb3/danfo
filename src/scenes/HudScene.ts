import Phaser from 'phaser'
import { FONT_DISPLAY, FONT_UI, H, W } from '../config'
import { bus, EV } from '../game/bus'
import { formatNaira } from '../game/routes'
import { GameScene } from './GameScene'

/**
 * HUD runs as its own scene so camera shake never rattles the numbers.
 */
export class HudScene extends Phaser.Scene {
  private cashText!: Phaser.GameObjects.Text
  private paxText!: Phaser.GameObjects.Text
  private paxTag!: Phaser.GameObjects.Text
  private strikeDots: Phaser.GameObjects.Arc[] = []
  private warnBanner!: Phaser.GameObjects.Container
  private calloutText!: Phaser.GameObjects.Text
  private flashRect!: Phaser.GameObjects.Rectangle
  private cashOutBtn!: Phaser.GameObjects.Container
  private cashOutLabel!: Phaser.GameObjects.Text
  private unsubs: Array<() => void> = []

  constructor() {
    super('Hud')
  }

  create(): void {
    this.flashRect = this.add.rectangle(0, 0, W, H, 0xff2b2b, 0).setOrigin(0).setDepth(0)

    this.add
      .text(18, 8, 'CASH', { fontFamily: FONT_UI, fontSize: '11px', color: '#ffd9a0' })
      .setAlpha(0.85)
      .setDepth(2)

    this.cashText = this.add
      .text(18, 20, '₦0', { fontFamily: FONT_DISPLAY, fontSize: '34px', color: '#ffd35c' })
      .setDepth(2)
      .setShadow(0, 4, '#000000', 8, false, true)

    this.paxTag = this.add
      .text(W - 18, 8, 'ON BOARD', { fontFamily: FONT_UI, fontSize: '11px', color: '#ffd9a0' })
      .setOrigin(1, 0)
      .setAlpha(0.85)
      .setDepth(2)

    this.paxText = this.add
      .text(W - 18, 20, '0/6', { fontFamily: FONT_DISPLAY, fontSize: '34px', color: '#ffffff' })
      .setOrigin(1, 0)
      .setDepth(2)
      .setShadow(0, 4, '#000000', 8, false, true)

    this.add
      .text(W / 2, 6, 'LASTMA', { fontFamily: FONT_UI, fontSize: '10px', color: '#ffd9a0' })
      .setOrigin(0.5, 0)
      .setAlpha(0.85)
      .setDepth(2)

    for (let i = 0; i < 3; i++) {
      const dot = this.add.circle(W / 2 + (i - 1) * 26, 32, 10, 0x000000, 0.001).setDepth(2)
      dot.setStrokeStyle(2, 0xffd9a0, 0.9)
      this.strikeDots.push(dot)
    }

    this.warnBanner = this.buildWarnBanner().setVisible(false).setDepth(4)

    this.calloutText = this.add
      .text(W / 2, 400, '', {
        fontFamily: FONT_DISPLAY,
        fontSize: '34px',
        color: '#ffffff',
        stroke: '#1a0f2e',
        strokeThickness: 8,
      })
      .setOrigin(0.5)
      .setDepth(5)
      .setAlpha(0)

    this.buildHornButton()
    this.buildCashOutButton()

    this.unsubs.push(
      bus.on(EV.cash, (value: unknown) => {
        this.cashText.setText(formatNaira(Number(value)))
      }),
      bus.on(EV.pax, (count: unknown) => {
        const n = Number(count)
        this.paxText.setText(`${n}/6`)
        this.paxText.setColor(n > 6 ? '#ff6b6b' : '#ffffff')
        this.paxTag.setText(n > 6 ? 'OVERLOAD!' : 'ON BOARD')
        this.paxTag.setColor(n > 6 ? '#ff6b6b' : '#ffd9a0')
        this.paxText.setScale(1.3)
        this.tweens.add({ targets: this.paxText, scale: 1, duration: 260, ease: 'Back.easeOut' })
      }),
      bus.on(EV.strikes, (n: unknown) => {
        const count = Number(n)
        this.strikeDots.forEach((dot, i) => {
          const used = i < count
          dot.setFillStyle(used ? 0xff3b3b : 0x000000, used ? 0.95 : 0.001)
          dot.setStrokeStyle(2, used ? 0xff3b3b : 0xffd9a0, 0.95)
        })
        const dot = this.strikeDots[count - 1]
        if (dot) {
          dot.setScale(1.8)
          this.tweens.add({ targets: dot, scale: 1, duration: 320, ease: 'Back.easeOut' })
        }
      }),
      bus.on(EV.warn, (on: unknown) => {
        if (on) this.showWarning()
      }),
      bus.on(EV.callout, (text: unknown, kind: unknown) => {
        this.showCallout(String(text), kind as 'good' | 'bad' | 'info')
      }),
      bus.on(EV.flash, (color: unknown, alpha: unknown) => {
        this.flash(Number(color), Number(alpha))
      }),
      bus.on(EV.cashout, (show: unknown, cash: unknown) => {
        this.cashOutBtn.setVisible(Boolean(show))
        this.cashOutLabel.setText(`CASH OUT ${formatNaira(Number(cash))}`)
      }),
    )

    this.events.once('shutdown', () => {
      this.unsubs.forEach((fn) => fn())
      this.unsubs = []
    })
  }

  private buildWarnBanner(): Phaser.GameObjects.Container {
    const c = this.add.container(W / 2, 96)
    const bg = this.add.rectangle(0, 0, W - 40, 46, 0xd32020, 0.92).setStrokeStyle(2, 0xffd35c, 0.9)
    const label = this.add
      .text(0, 0, 'LASTMA AHEAD!', { fontFamily: FONT_DISPLAY, fontSize: '26px', color: '#ffffff' })
      .setOrigin(0.5)
    c.add([bg, label])
    this.tweens.add({
      targets: c,
      alpha: { from: 1, to: 0.25 },
      duration: 320,
      yoyo: true,
      repeat: -1,
    })
    return c
  }

  private buildHornButton(): void {
    const c = this.add.container(W - 48, H - 54).setDepth(6)
    const disc = this.add.circle(0, 0, 38, 0x1a1026, 0.55).setStrokeStyle(2.5, 0xffd35c, 0.9)
    const horn = this.add.graphics()
    horn.fillStyle(0xffd35c, 1)
    horn.fillTriangle(-16, -8, -2, -13, -2, 13)
    horn.fillRect(-16, -8, 14, 16)
    horn.fillRect(-2, -5, 14, 10)
    horn.lineStyle(2.5, 0xffd35c, 0.9)
    horn.strokeCircle(20, 0, 7)
    horn.strokeCircle(20, 0, 13)
    const label = this.add
      .text(0, 26, 'HORN', { fontFamily: FONT_UI, fontSize: '10px', color: '#ffd9a0' })
      .setOrigin(0.5)
    c.add([disc, horn, label])
    c.setSize(88, 88).setInteractive({ useHandCursor: true })
    c.on('pointerdown', () => {
      bus.emit(EV.horn)
      this.tweens.add({ targets: c, scale: 0.9, duration: 80, yoyo: true })
    })
  }

  private buildCashOutButton(): void {
    const c = this.add.container(56, H - 54).setDepth(6)
    const bg = this.add.rectangle(0, 0, 96, 46, 0x1d7a4d, 0.95).setStrokeStyle(2.5, 0x9ff0be, 0.9)
    this.cashOutLabel = this.add
      .text(0, 0, 'CASH OUT', { fontFamily: FONT_DISPLAY, fontSize: '14px', color: '#ffffff' })
      .setOrigin(0.5)
    c.add([bg, this.cashOutLabel])
    c.setSize(110, 60).setInteractive({ useHandCursor: true })
    c.on('pointerdown', () => {
      const game = this.scene.get('Game') as GameScene
      game?.cashOut()
    })
    c.setVisible(false)
    this.cashOutBtn = c
  }

  private showWarning(): void {
    this.warnBanner.setVisible(true)
    this.tweens.add({
      targets: this.warnBanner,
      scale: { from: 0.8, to: 1 },
      duration: 260,
      ease: 'Back.easeOut',
    })
    this.time.delayedCall(2600, () => {
      this.warnBanner.setVisible(false)
      this.warnBanner.setAlpha(1)
    })
  }

  private showCallout(text: string, kind: 'good' | 'bad' | 'info'): void {
    const color = kind === 'good' ? '#9ff0be' : kind === 'bad' ? '#ff8f8f' : '#ffffff'
    this.calloutText.setText(text).setColor(color).setAlpha(1).setScale(0.7).setY(400)
    this.tweens.add({
      targets: this.calloutText,
      scale: 1,
      y: 352,
      duration: 220,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.tweens.add({ targets: this.calloutText, alpha: 0, delay: 520, duration: 320 })
      },
    })
  }

  private flash(color: number, alpha: number): void {
    this.flashRect.setFillStyle(color, 1).setAlpha(alpha)
    this.tweens.add({ targets: this.flashRect, alpha: 0, duration: 420, ease: 'Quad.easeOut' })
  }
}
