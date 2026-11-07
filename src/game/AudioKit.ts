/**
 * All sound in DANFO is synthesised with WebAudio — no audio files.
 * The engine is a continuous sawtooth + sub oscillator through a low-pass
 * whose pitch and brightness track how overloaded the bus is.
 */

type EngineGraph = {
  osc: OscillatorNode
  sub: OscillatorNode
  filter: BiquadFilterNode
  gain: GainNode
  lfo: OscillatorNode
  lfoGain: GainNode
}

const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v)

class AudioKit {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private engine: EngineGraph | null = null
  private load = 0

  /** Must be called from a user gesture. */
  unlock(): void {
    if (this.ctx) {
      void this.ctx.resume().catch(() => undefined)
      return
    }
    const AC =
      (window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext) as
        | typeof AudioContext
        | undefined
    if (!AC) return
    const ctx = new AC()
    this.ctx = ctx
    this.master = ctx.createGain()
    this.master.gain.value = 0.5
    this.master.connect(ctx.destination)
  }

  get ready(): boolean {
    return this.ctx !== null
  }

  /* ------------------------------------------------------------- engine */

  startEngine(): void {
    if (!this.ctx || !this.master || this.engine) return
    const ctx = this.ctx

    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.value = 62

    const sub = ctx.createOscillator()
    sub.type = 'square'
    sub.frequency.value = 31

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 340
    filter.Q.value = 6.5

    const gain = ctx.createGain()
    gain.gain.value = 0.0001

    const lfo = ctx.createOscillator()
    lfo.type = 'square'
    lfo.frequency.value = 7.5
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 28

    // The LFO wobbles the filter cutoff, giving the slow-idle chug.
    lfo.connect(lfoGain)
    lfoGain.connect(filter.frequency)

    osc.connect(filter)
    sub.connect(filter)
    filter.connect(gain)
    gain.connect(this.master)

    osc.start()
    sub.start()
    lfo.start()
    gain.gain.setTargetAtTime(0.34, ctx.currentTime, 0.4)

    this.engine = { osc, sub, filter, gain, lfo, lfoGain }
    this.applyLoad()
  }

  stopEngine(): void {
    if (!this.engine || !this.ctx) return
    const ctx = this.ctx
    this.engine.gain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.18)
    const engine = this.engine
    this.engine = null
    window.setTimeout(() => {
      try {
        engine.osc.stop()
        engine.sub.stop()
        engine.lfo.stop()
      } catch {
        /* already stopped */
      }
    }, 700)
  }

  /** 0 = empty bus, 1 = properly overloaded. */
  setLoad(passengers: number): void {
    this.load = clamp01(passengers / 13)
    this.applyLoad()
  }

  /** 0 = crawling, 1 = full pace. */
  setSpeed(ratio: number): void {
    if (!this.engine || !this.ctx) return
    const value = 0.028 + clamp01(ratio) * 0.05
    this.engine.lfo.frequency.setTargetAtTime(4.2 + clamp01(ratio) * 6.2, this.ctx.currentTime, 0.3)
    this.engine.lfoGain.gain.setTargetAtTime(this.engine.lfoGain.gain.value * 0 + 18 + value * 260, this.ctx.currentTime, 0.3)
  }

  private applyLoad(): void {
    if (!this.engine || !this.ctx) return
    const t = this.ctx.currentTime
    const load = this.load
    // A loaded engine strains: deeper pitch, darker with more chug.
    this.engine.osc.frequency.setTargetAtTime(64 - load * 14, t, 0.25)
    this.engine.sub.frequency.setTargetAtTime(32 - load * 7, t, 0.25)
    this.engine.filter.frequency.setTargetAtTime(360 + load * 120, t, 0.25)
    this.engine.lfoGain.gain.setTargetAtTime(16 + load * 34, t, 0.25)
  }

  /* ------------------------------------------------------------- voices */

  private tone(
    freq: number,
    duration: number,
    type: OscillatorType,
    gain: number,
    delay = 0,
    slideTo?: number,
  ): void {
    if (!this.ctx || !this.master) return
    const ctx = this.ctx
    const start = ctx.currentTime + delay
    const osc = ctx.createOscillator()
    const env = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, start)
    if (slideTo !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), start + duration)
    }
    env.gain.setValueAtTime(0.0001, start)
    env.gain.exponentialRampToValueAtTime(gain, start + 0.015)
    env.gain.exponentialRampToValueAtTime(0.0001, start + duration)
    osc.connect(env)
    env.connect(this.master)
    osc.start(start)
    osc.stop(start + duration + 0.02)
  }

  private noise(duration: number, gain: number, delay = 0, lowpass = 1200): void {
    if (!this.ctx || !this.master) return
    const ctx = this.ctx
    const start = ctx.currentTime + delay
    const size = Math.max(1, Math.floor(ctx.sampleRate * duration))
    const buffer = ctx.createBuffer(1, size, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < size; i += 1) {
      const decay = 1 - i / size
      data[i] = (Math.random() * 2 - 1) * decay * decay
    }
    const source = ctx.createBufferSource()
    source.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = lowpass
    const env = ctx.createGain()
    env.gain.setValueAtTime(gain, start)
    env.gain.exponentialRampToValueAtTime(0.0001, start + duration)
    source.connect(filter)
    filter.connect(env)
    env.connect(this.master)
    source.start(start)
  }

  coin(amount = 3): void {
    // bright ₦ arpeggio
    this.tone(1318.5, 0.09, 'triangle', 0.22, 0)
    this.tone(1760, 0.1, 'triangle', 0.2, 0.06)
    this.tone(2093, 0.14, 'triangle', 0.22, 0.12)
    if (amount > 2) this.tone(2637, 0.18, 'triangle', 0.18, 0.18)
  }

  board(): void {
    this.tone(880, 0.09, 'square', 0.14, 0)
    this.tone(1174, 0.12, 'square', 0.14, 0.08)
  }

  alight(): void {
    this.tone(1046, 0.1, 'triangle', 0.18, 0)
    this.tone(1568, 0.16, 'triangle', 0.2, 0.1)
  }

  honk(): void {
    // a two-tone Lagos horn
    this.tone(392, 0.32, 'square', 0.18, 0)
    this.tone(523, 0.32, 'square', 0.16, 0)
    this.noise(0.05, 0.04, 0, 4000)
  }

  jolt(): void {
    this.noise(0.14, 0.32, 0, 900)
    this.tone(88, 0.18, 'sine', 0.3, 0)
  }

  fine(): void {
    // descending sad trombone + a slap of paperwork
    this.tone(392, 0.16, 'sawtooth', 0.22, 0)
    this.tone(311, 0.18, 'sawtooth', 0.22, 0.14)
    this.tone(233, 0.34, 'sawtooth', 0.24, 0.29, 174)
    this.noise(0.2, 0.18, 0.06, 500)
  }

  pass(): void {
    this.tone(659, 0.12, 'triangle', 0.18, 0)
    this.tone(988, 0.22, 'triangle', 0.18, 0.1)
  }

  gameOver(isBest: boolean): void {
    const base = isBest ? 523 : 392
    this.tone(base, 0.18, 'triangle', 0.22, 0)
    this.tone(base * 1.25, 0.2, 'triangle', 0.2, 0.16)
    this.tone(base * 1.5, 0.48, 'triangle', 0.24, 0.32)
  }
}

export const audio = new AudioKit()
