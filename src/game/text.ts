import Phaser from 'phaser'
import { DPR } from '../config'

/**
 * Text is rendered into its own canvas texture, so it needs the device
 * resolution explicitly or it comes out soft on a retina phone.
 */
export function textStyle(
  style: Phaser.Types.GameObjects.Text.TextStyle,
): Phaser.Types.GameObjects.Text.TextStyle {
  return { resolution: DPR, ...style }
}
