import './style.css'
import Phaser from 'phaser'
import { H, W } from './config'
import { BootScene } from './scenes/BootScene'
import { TitleScene } from './scenes/TitleScene'
import { GameScene } from './scenes/GameScene'
import { HudScene } from './scenes/HudScene'
import { EndScene } from './scenes/EndScene'

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: W,
  height: H,
  backgroundColor: '#1b0f2e',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: W,
    height: H,
  },
  render: {
    antialias: true,
    powerPreference: 'high-performance',
  },
  scene: [BootScene, TitleScene, GameScene, HudScene, EndScene],
})

export default game

if (import.meta.env.DEV) {
  ;(window as unknown as Record<string, unknown>).__danfo = {
    game,
    start: () => game.scene.getScene('Title')?.scene.start('Game'),
    scene: (name: string) => game.scene.getScene(name),
  }
}
