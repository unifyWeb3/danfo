import Phaser from 'phaser'
import { DPR } from '../config'

/**
 * The canvas is rendered at W*DPR x H*DPR so sprites and text land on real
 * device pixels. The camera is zoomed by DPR to keep the logical game space at
 * 390x844, with a zero origin so world (0,0) sits at the top-left of the canvas.
 */
export function setupCamera(scene: Phaser.Scene): void {
  const cam = scene.cameras.main
  cam.setZoom(DPR)
  cam.setOrigin(0, 0)
  cam.setScroll(0, 0)
}
