import './style.css'
import Phaser from 'phaser'
import { DPR, H, W } from './config'
import { BootScene } from './scenes/BootScene'
import { TitleScene } from './scenes/TitleScene'
import { GameScene } from './scenes/GameScene'
import { HudScene } from './scenes/HudScene'
import { EndScene } from './scenes/EndScene'

const game = new Phaser.Game({
  type: Phaser.CANVAS,
  parent: 'game',
  width: W * DPR,
  height: H * DPR,
  backgroundColor: '#1b0f2e',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: W * DPR,
    height: H * DPR,
  },
  render: {
    antialias: true,
    powerPreference: 'high-performance',
  },
  scene: [BootScene, TitleScene, GameScene, HudScene, EndScene],
})

export default game

// invisible `?shot` flag used for screenshots and the gameplay clip; playtesters
// see nothing different, it just exposes the same hooks the dev build uses
const shotMode = import.meta.env.DEV || new URLSearchParams(window.location.search).has('shot')
if (shotMode) {
  ;(window as unknown as Record<string, unknown>).__danfo = {
    game,
    start: () => game.scene.getScene('Title')?.scene.start('Game'),
    scene: (name: string) => game.scene.getScene(name),
  }
}
