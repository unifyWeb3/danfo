import Phaser from 'phaser'
import { loadSprites, makeProceduralTextures } from '../game/Textures'

/**
 * Boot: rasterise every hand-authored SVG sprite into a Phaser texture, then
 * hand over to the title screen.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot')
  }

  async create(): Promise<void> {
    makeProceduralTextures(this)
    await loadSprites(this)
    this.scene.start('Title')
  }
}
