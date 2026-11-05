import Phaser from 'phaser'
import {
  BASE_SPEED,
  BUS_Y,
  CAPACITY,
  CHECKPOINT_MAX,
  CHECKPOINT_MIN,
  CASH_OUT_AT,
  COLORS,
  DUSK,
  FARE_BOARD,
  FARE_MAIN,
  FINE,
  FONT_DISPLAY,
  GATE_SPEED,
  H,
  HORIZON_Y,
  LOAD_FAR,
  LOAD_NEAR,
  MAX_STRIKES,
  NIGHT,
  POTHOLE_MAX_GAP,
  POTHOLE_MIN_GAP,
  ROAD_BOT_HALF,
  ROAD_TOP_HALF,
  STOP_MAX_GAP,
  STOP_MIN_GAP,
  TIP,
  TRAFFIC_MAX_GAP,
  TRAFFIC_MIN_GAP,
  W,
  Z_MAX,
} from '../config'
import { bus, EV } from '../game/bus'
import { clamp, laneXAtZ, lerp, mixColor, roadHalfAtT, scaleAtZ, tAtZ, yAtZ } from '../game/perspective'
import { loadBest, saveBest, loadRuns, saveRuns } from '../game/storage'
import { routeFor, titleFor } from '../game/routes'

type Passenger = { id: number; dest: number; tipMult: number }

type StopObj = {
  id: number
  side: 'left' | 'right'
  lane: number
  z: number
  waiting: number
  loaded: boolean
  passed: boolean
  container: Phaser.GameObjects.Container
  people: Phaser.GameObjects.Image[]
  badge: Phaser.GameObjects.Text
}

type RoadObj = {
  kind: 'okada' | 'truck' | 'pothole'
  lane: number
  targetLane: number
  z: number
  v: number
  sprite: Phaser.GameObjects.Image
  hit: boolean
  laneSwitchAt: number
}

type Summary = {
  cash: number
  strikes: number
  route: string
  title: string
  reason: 'caught' | 'cashout'
  best: number
  isBest: boolean
  runs: number
}

export class GameScene extends Phaser.Scene {
  private cash = 0
  private passengers: Passenger[] = []
  private strikes = 0
  private runTime = 0
  private travel = 0
  private speed = BASE_SPEED
  private slowTimer = 0
  private lane = 1
  private busX = W / 2
  private over = false

  private stops: StopObj[] = []
  private road: RoadObj[] = []
  private nextStopId = 1
  private stopTimer = 1.4
  private trafficTimer = 2
  private potholeTimer = 6
  private nextCheckpointAt = CHECKPOINT_MIN
  private checkpointWarned = false
  private gate: { z: number; container: Phaser.GameObjects.Container; passed: boolean } | null = null

  private pendingLoad: { stop: StopObj; timer: number } | null = null

  private busBody!: Phaser.GameObjects.Image
  private busGroup!: Phaser.GameObjects.Container
  private hangGroup!: Phaser.GameObjects.Container
  private shadow!: Phaser.GameObjects.Ellipse
  private sky!: Phaser.GameObjects.Graphics
  private roadGfx!: Phaser.GameObjects.Graphics
  private dashes: { z: number; sprite: Phaser.GameObjects.Image }[] = []
  private coins!: Phaser.GameObjects.Particles.ParticleEmitter

  private dragX = 0
  private dragY = 0
  private dragDist = 0
  private pointerDown = false

  constructor() {
    super('Game')
  }

  create(): void {
    this.cash = 0
    this.passengers = []
    this.strikes = 0
    this.runTime = 0
    this.travel = 0
    this.speed = BASE_SPEED
    this.slowTimer = 0
    this.lane = 1
    this.busX = W / 2
    this.over = false
    this.stops = []
    this.road = []
    this.nextStopId = 1
    this.stopTimer = 1.4
    this.trafficTimer = 2
    this.potholeTimer = 6
    this.nextCheckpointAt = CHECKPOINT_MIN + Math.random() * (CHECKPOINT_MAX - CHECKPOINT_MIN)
    this.checkpointWarned = false
    this.gate = null
    this.pendingLoad = null

    this.buildSky()
    this.buildRoad()
    this.buildBus()
    this.buildParticles()

    this.scene.launch('Hud')
    bus.emit(EV.cash, 0)
    bus.emit(EV.pax, 0, false)
    bus.emit(EV.strikes, 0)

    this.bindInput()
    this.cameras.main.fadeIn(260, 0, 0, 0)

    if (import.meta.env.DEV) {
      ;(window as unknown as Record<string, unknown>).__danfoGame = {
        fill: (n: number) => this.debugFill(n),
        stopScreenPos: () => this.debugStopPos(),
        triggerCheckpoint: () => {
          this.nextCheckpointAt = this.runTime + 3000
          this.checkpointWarned = false
        },
        end: () => this.endRun('cashout'),
      }
    }
  }

  /** Dev helper: force a given passenger count for deterministic screenshots. */
  private debugFill(n: number): void {
    const dest = this.nextStopId + 6
    for (let i = 0; i < n; i++) {
      this.passengers.push({ id: i, dest, tipMult: this.passengers.length >= CAPACITY ? 2 : 1 })
    }
    this.cash += n * FARE_MAIN
    bus.emit(EV.cash, this.cash)
    bus.emit(EV.pax, this.passengers.length, this.passengers.length > CAPACITY)
  }

  /** Dev helper: logical position of the closest boardable stop. */
  private debugStopPos(): { x: number; y: number } | null {
    let best: StopObj | null = null
    for (const stop of this.stops) {
      if (stop.loaded || stop.z > LOAD_FAR || stop.z < LOAD_NEAR) continue
      if (!best || stop.z < best.z) best = stop
    }
    if (!best) return null
    return { x: best.container.x, y: best.container.y - 70 }
  }

  /* ------------------------------------------------------------------ setup */

  private buildSky(): void {
    this.sky = this.add.graphics().setDepth(-100)
    this.drawSky(0)
  }

  private drawSky(nightT: number): void {
    const top = mixColor(DUSK.skyTop, NIGHT.skyTop, nightT)
    const mid = mixColor(DUSK.skyMid, NIGHT.skyMid, nightT)
    const low = mixColor(DUSK.skyLow, NIGHT.skyLow, nightT)
    this.sky.clear()
    this.sky.fillGradientStyle(top, top, mid, mid, 1)
    this.sky.fillRect(0, 0, W, HORIZON_Y * 0.62)
    this.sky.fillGradientStyle(mid, mid, low, low, 1)
    this.sky.fillRect(0, HORIZON_Y * 0.62 - 1, W, HORIZON_Y * 0.38 + 1)
  }

  private buildRoad(): void {
    this.roadGfx = this.add.graphics().setDepth(-50)

    // shoulders
    this.roadGfx.fillStyle(0x4a3340)
    this.roadGfx.fillPoints(
      [
        new Phaser.Geom.Point(0, HORIZON_Y),
        new Phaser.Geom.Point(W / 2 - ROAD_TOP_HALF, HORIZON_Y),
        new Phaser.Geom.Point(W / 2 - ROAD_BOT_HALF, H),
        new Phaser.Geom.Point(0, H),
      ],
      true,
    )
    this.roadGfx.fillPoints(
      [
        new Phaser.Geom.Point(W / 2 + ROAD_TOP_HALF, HORIZON_Y),
        new Phaser.Geom.Point(W, HORIZON_Y),
        new Phaser.Geom.Point(W, H),
        new Phaser.Geom.Point(W / 2 + ROAD_BOT_HALF, H),
      ],
      true,
    )

    // asphalt
    this.roadGfx.fillStyle(COLORS.duskRoad)
    this.roadGfx.fillPoints(
      [
        new Phaser.Geom.Point(W / 2 - ROAD_TOP_HALF, HORIZON_Y),
        new Phaser.Geom.Point(W / 2 + ROAD_TOP_HALF, HORIZON_Y),
        new Phaser.Geom.Point(W / 2 + ROAD_BOT_HALF, H),
        new Phaser.Geom.Point(W / 2 - ROAD_BOT_HALF, H),
      ],
      true,
    )

    // edge lines
    this.roadGfx.lineStyle(5, 0xf5e6c8, 0.9)
    this.roadGfx.beginPath()
    this.roadGfx.moveTo(W / 2 - ROAD_TOP_HALF, HORIZON_Y)
    this.roadGfx.lineTo(W / 2 - ROAD_BOT_HALF, H)
    this.roadGfx.strokePath()
    this.roadGfx.beginPath()
    this.roadGfx.moveTo(W / 2 + ROAD_TOP_HALF, HORIZON_Y)
    this.roadGfx.lineTo(W / 2 + ROAD_BOT_HALF, H)
    this.roadGfx.strokePath()

    // lane dashes
    const dashCount = 26
    const span = (Z_MAX + 0.6) / dashCount
    for (let i = 0; i < dashCount; i++) {
      const dash = this.add
        .image(0, 0, 'dash')
        .setOrigin(0.5, 0.5)
        .setDepth(-40)
      this.dashes.push({ z: i * span, sprite: dash })
    }
  }

  private buildBus(): void {
    this.busGroup = this.add.container(this.busX, BUS_Y).setDepth(20)
    this.shadow = this.add.ellipse(0, 4, 104, 26, 0x000000, 0.35).setOrigin(0.5, 0.5)
    this.busGroup.add(this.shadow)
    this.busBody = this.add.image(0, 0, 'danfo').setOrigin(0.5, 1)
    this.busGroup.add(this.busBody)
    this.hangGroup = this.add.container(46, -52)
    this.busGroup.add(this.hangGroup)
  }

  private buildParticles(): void {
    this.coins = this.add.particles(0, 0, 'coin', {
      lifespan: 780,
      speed: { min: 80, max: 220 },
      angle: { min: 200, max: 340 },
      gravityY: 420,
      scale: { start: 1, end: 0.25 },
      rotate: { min: -180, max: 180 },
      emitting: false,
    })
    this.coins.setDepth(30)
  }

  /* ----------------------------------------------------------------- input */

  private bindInput(): void {
    const kb = this.input.keyboard
    kb?.on('keydown-LEFT', () => this.shiftLane(-1))
    kb?.on('keydown-RIGHT', () => this.shiftLane(1))
    kb?.on('keydown-A', () => this.shiftLane(-1))
    kb?.on('keydown-D', () => this.shiftLane(1))
    kb?.on('keydown-SPACE', () => this.loadNearestStop())
    kb?.on('keydown-H', () => this.honk())

    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      this.pointerDown = true
      this.dragX = p.x
      this.dragY = p.y
      this.dragDist = 0
    })
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      if (!this.pointerDown) return
      this.dragDist = Math.max(this.dragDist, Phaser.Math.Distance.Between(this.dragX, this.dragY, p.x, p.y))
    })
    this.input.on('pointerup', (p: Phaser.Input.Pointer) => {
      this.pointerDown = false
      const dx = p.x - this.dragX
      const dy = p.y - this.dragY
      if (Math.abs(dx) > 26 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        this.shiftLane(dx > 0 ? 1 : -1)
      }
    })
  }

  private shiftLane(dir: number): void {
    if (this.over) return
    this.lane = clamp(this.lane + dir, 0, 2)
  }

  private honk(): void {
    bus.emit(EV.horn)
    this.callout('HONK!', 'info')
  }

  /* ---------------------------------------------------------------- update */

  update(_time: number, delta: number): void {
    const dt = Math.min(delta, 50) / 1000
    if (this.over) return

    this.runTime += dt * 1000
    this.updateSky()
    this.updateSpeed(dt)

    const dz = this.speed * dt
    this.travel += dz

    this.updateBus(dt)
    this.updateStops(dz)
    this.updateRoad(dz, dt)
    this.updateGate(dt)
    this.updateSpawning(dt)
    this.updateDashes(dz)
    this.updateCheckpoint()
    this.updatePendingLoad(dt)
  }

  private updateSky(): void {
    const nightT = clamp(this.runTime / 62_000, 0, 1)
    this.drawSky(nightT)
  }

  private updateSpeed(dt: number): void {
    const load = this.passengers.length
    let target = BASE_SPEED * (1 - Math.min(load, 12) * 0.022)
    if (load > CAPACITY) target *= 0.9
    if (this.slowTimer > 0) {
      this.slowTimer -= dt
      target *= 0.55
    }
    this.speed = lerp(this.speed, target, Math.min(1, dt * 5))
  }

  private updateBus(dt: number): void {
    const targetX = laneXAtZ(this.lane, 0)
    const agility = this.passengers.length > CAPACITY ? 480 : 880
    const diff = targetX - this.busX
    const step = Math.min(Math.abs(diff), agility * dt)
    this.busX += Math.sign(diff) * step
    const before = this.busX

    const over = Math.max(0, this.passengers.length - CAPACITY)
    const wobble = over > 0 ? Math.sin(this.runTime / 130) * 0.012 * Math.min(over, 4) : 0
    const lean = clamp((targetX - before) * 0.0022, -0.1, 0.1)
    this.busGroup.setPosition(this.busX, BUS_Y)
    this.busGroup.setRotation(lean + wobble)

    const bulgeX = 1 + Math.min(over, 6) * 0.026
    const bulgeY = 1 - Math.min(over, 6) * 0.016
    this.busBody.setScale(lerp(this.busBody.scaleX, bulgeX, dt * 4), lerp(this.busBody.scaleY, bulgeY, dt * 4))

    // people hanging out of the door
    const hangCount = over > 10 ? 3 : over > 8 ? 2 : over > 6 ? 1 : 0
    while (this.hangGroup.length > hangCount) this.hangGroup.remove(this.hangGroup.list[0], true)
    while (this.hangGroup.length < hangCount) {
      const p = this.add.image(0, 0, 'pax_hang').setOrigin(0.5, 0)
      this.hangGroup.add(p)
    }
    this.hangGroup.list.forEach((child, i) => {
      const img = child as Phaser.GameObjects.Image
      img.x = i * 16 - (hangCount - 1) * 8
      img.y = -i * 3
      img.setRotation(0.18 + i * 0.06)
    })
  }

  private updateDashes(dz: number): void {
    const laneEdges = [0.5, 1.5]
    this.dashes.forEach((d, i) => {
      d.z -= dz
      if (d.z < -0.12) d.z += Z_MAX + 0.6
      const t = Math.max(0, tAtZ(d.z))
      const s = scaleAtZ(d.z)
      const half = roadHalfAtT(t)
      const edge = laneEdges[i % 2]
      d.sprite.setPosition(W / 2 + (edge - 1) * half, yAtZ(d.z))
      d.sprite.setScale(s * 0.75, s * 1.5)
      d.sprite.setDepth(-40)
      d.sprite.setAlpha(clamp(t * 2, 0, 1))
    })
  }

  private updateStops(dz: number): void {
    for (let i = this.stops.length - 1; i >= 0; i--) {
      const stop = this.stops[i]
      stop.z -= dz
      const t = Math.max(0, tAtZ(stop.z))
      const half = roadHalfAtT(t)
      const edgeX = W / 2 + (stop.side === 'left' ? -1 : 1) * half
      const x = edgeX + (stop.side === 'left' ? -20 : 20)
      stop.container.setPosition(x, yAtZ(stop.z))
      stop.container.setScale(scaleAtZ(stop.z))
      stop.container.setDepth(-stop.z * 10)

      // badge visibility
      const inRange = stop.z < LOAD_FAR && stop.z > LOAD_NEAR && !stop.loaded
      stop.badge.setVisible(inRange)
      if (inRange) {
        stop.badge.setAlpha(0.65 + 0.35 * Math.sin(this.runTime / 110))
        stop.badge.setScale(stop.badge.scaleX)
      }

      // passengers alight here
      if (stop.z <= LOAD_NEAR && !stop.passed) {
        stop.passed = true
        this.alight(stop)
      }

      if (stop.z < -0.25) {
        stop.container.destroy(true)
        this.stops.splice(i, 1)
      }
    }
  }

  private updateRoad(dz: number, dt: number): void {
    for (let i = this.road.length - 1; i >= 0; i--) {
      const obj = this.road[i]
      obj.z -= dz + obj.v * dt

      // okadas change lanes to squeeze through traffic
      if (obj.kind === 'okada' && this.runTime > obj.laneSwitchAt) {
        obj.laneSwitchAt = this.runTime + 1600 + Math.random() * 2200
        const options = [0, 1, 2].filter((l) => Math.abs(l - obj.lane) > 0.6)
        if (options.length) obj.targetLane = options[Math.floor(Math.random() * options.length)]
      }
      obj.lane = lerp(obj.lane, obj.targetLane, Math.min(1, dt * 2.4))

      const s = scaleAtZ(obj.z)
      obj.sprite.setPosition(laneXAtZ(obj.lane, obj.z), yAtZ(obj.z))
      obj.sprite.setScale(s)
      obj.sprite.setDepth(-obj.z * 10 + 1)

      if (!obj.hit && Math.abs(obj.z) < 0.075) {
        const tolerance = obj.kind === 'truck' ? 0.72 : obj.kind === 'okada' ? 0.45 : 0.42
        if (Math.abs(obj.lane - this.lane) < tolerance) {
          this.collide(obj)
        }
      }

      if (obj.z < -0.3) {
        obj.sprite.destroy()
        this.road.splice(i, 1)
      }
    }
  }

  private updateGate(dt: number): void {
    const gate = this.gate
    if (!gate) return
    gate.z -= GATE_SPEED * dt
    const t = Math.max(0, tAtZ(gate.z))
    const half = roadHalfAtT(t)
    gate.container.setPosition(W / 2, yAtZ(gate.z))
    gate.container.setScale(half / 140, scaleAtZ(gate.z))
    gate.container.setDepth(-gate.z * 10)

    if (!gate.passed && gate.z <= 0) {
      gate.passed = true
      this.passCheckpoint()
    }
  }

  private updateSpawning(dt: number): void {
    this.stopTimer -= dt
    if (this.stopTimer <= 0) {
      this.stopTimer = lerp(STOP_MIN_GAP, STOP_MAX_GAP, Math.random())
      this.spawnStop()
    }
    this.trafficTimer -= dt
    if (this.trafficTimer <= 0) {
      this.trafficTimer = lerp(TRAFFIC_MIN_GAP, TRAFFIC_MAX_GAP, Math.random())
      this.spawnRoadObject(Math.random() < 0.62 ? 'okada' : 'truck')
    }
    this.potholeTimer -= dt
    if (this.potholeTimer <= 0) {
      this.potholeTimer = lerp(POTHOLE_MIN_GAP, POTHOLE_MAX_GAP, Math.random())
      this.spawnRoadObject('pothole')
    }
    if (this.runTime >= CASH_OUT_AT) bus.emit(EV.cashout, true, this.cash)
  }

  private updateCheckpoint(): void {
    if (this.checkpointWarned) return
    if (this.runTime < this.nextCheckpointAt - 3000) return
    this.checkpointWarned = true
    bus.emit(EV.warn, true)
    this.callout('LASTMA AHEAD!', 'bad')
    this.spawnGate()
  }

  private updatePendingLoad(dt: number): void {
    if (!this.pendingLoad) return
    this.pendingLoad.timer -= dt
    if (this.pendingLoad.timer <= 0) {
      const stop = this.pendingLoad.stop
      this.pendingLoad = null
      this.board(stop)
    }
  }

  /* --------------------------------------------------------------- spawning */

  private spawnStop(): void {
    const side: 'left' | 'right' = Math.random() < 0.5 ? 'left' : 'right'
    const lane = side === 'left' ? 0 : 2
    const waiting = 1 + Math.floor(Math.random() * 3)

    const container = this.add.container(0, 0)
    const sign = this.add.image(0, 0, 'stop').setOrigin(0.5, 1)
    container.add(sign)

    const people: Phaser.GameObjects.Image[] = []
    for (let i = 0; i < waiting; i++) {
      const p = this.add
        .image((i - (waiting - 1) / 2) * 26, 0, 'pax')
        .setOrigin(0.5, 1)
      container.add(p)
      people.push(p)
    }

    const badge = this.add
      .text(0, -132, 'TAP!', {
        fontFamily: FONT_DISPLAY,
        fontSize: '20px',
        color: '#12101c',
        backgroundColor: '#ffd35c',
        padding: { x: 8, y: 4 },
      })
      .setOrigin(0.5)
      .setVisible(false)
    container.add(badge)

    container.setInteractive(
      new Phaser.Geom.Rectangle(-42, -150, 84, 150),
      Phaser.Geom.Rectangle.Contains,
    )

    const stop: StopObj = {
      id: this.nextStopId++,
      side,
      lane,
      z: Z_MAX,
      waiting,
      loaded: false,
      passed: false,
      container,
      people,
      badge,
    }

    container.on('pointerdown', () => {
      if (this.dragDist > 26) return
      this.tryLoad(stop)
    })

    this.stops.push(stop)
  }

  private spawnRoadObject(kind: 'okada' | 'truck' | 'pothole'): void {
    const lane = Math.floor(Math.random() * 3)
    const sprite = this.add.image(0, 0, kind).setOrigin(0.5, kind === 'pothole' ? 0.5 : 1)
    const obj: RoadObj = {
      kind,
      lane,
      targetLane: lane,
      z: Z_MAX,
      v: kind === 'okada' ? 0.075 : kind === 'truck' ? -0.02 : 0,
      sprite,
      hit: false,
      laneSwitchAt: 0,
    }
    this.road.push(obj)
  }

  private spawnGate(): void {
    const container = this.add.container(W / 2, HORIZON_Y)
    const arm = this.add.image(0, 0, 'gate').setOrigin(0.5, 0.5)
    container.add(arm)
    const sign = this.add
      .text(0, -56, 'LASTMA', {
        fontFamily: FONT_DISPLAY,
        fontSize: '26px',
        color: '#ffffff',
        backgroundColor: '#d33a3a',
        padding: { x: 10, y: 4 },
      })
      .setOrigin(0.5)
    container.add(sign)
    this.gate = { z: GATE_SPEED * 3, container, passed: false }
  }

  /* ----------------------------------------------------------------- events */

  private tryLoad(stop: StopObj): void {
    if (this.over || stop.loaded) return
    if (stop.z > LOAD_FAR || stop.z < LOAD_NEAR) {
      this.callout('MISSED THE STOP', 'bad')
      return
    }
    if (this.pendingLoad) return
    this.lane = stop.lane
    this.pendingLoad = { stop, timer: 0.3 }
  }

  private loadNearestStop(): void {
    if (this.over) return
    let best: StopObj | null = null
    for (const stop of this.stops) {
      if (stop.loaded || stop.z > LOAD_FAR || stop.z < LOAD_NEAR) continue
      if (!best || stop.z < best.z) best = stop
    }
    if (best) this.tryLoad(best)
    else this.callout('NO STOP HERE', 'info')
  }

  private board(stop: StopObj): void {
    stop.loaded = true
    const n = stop.waiting
    if (n <= 0) return
    stop.people.forEach((p) => p.destroy())
    stop.people = []

    let fare = 0
    for (let i = 0; i < n; i++) {
      const tipMult = this.passengers.length >= CAPACITY ? 2 : 1
      this.passengers.push({
        id: i,
        dest: stop.id + 1 + Math.floor(Math.random() * 3),
        tipMult,
      })
      fare += FARE_BOARD
    }
    this.cash += fare
    bus.emit(EV.cash, this.cash)
    bus.emit(EV.pax, this.passengers.length, this.passengers.length > CAPACITY)
    this.coins.emitParticleAt(this.busX - 30, BUS_Y - 70, n * 4)
    this.callout('OYA ENTER!', 'good')
  }

  private alight(stop: StopObj): void {
    const leaving = this.passengers.filter((p) => p.dest === stop.id)
    if (leaving.length === 0) return
    this.passengers = this.passengers.filter((p) => p.dest !== stop.id)
    let fare = 0
    for (const p of leaving) fare += FARE_MAIN + TIP * p.tipMult
    this.cash += fare
    bus.emit(EV.cash, this.cash)
    bus.emit(EV.pax, this.passengers.length, this.passengers.length > CAPACITY)
    this.coins.emitParticleAt(this.busX + 30, BUS_Y - 70, leaving.length * 5)
    this.callout('DROP! DROP!', 'good')
  }

  private collide(obj: RoadObj): void {
    obj.hit = true
    this.slowTimer = 1.1
    this.cameras.main.shake(220, 0.008)
    if (obj.kind === 'okada') {
      const options = [0, 1, 2].filter((l) => Math.abs(l - obj.lane) > 0.6)
      obj.targetLane = options.length ? options[Math.floor(Math.random() * options.length)] : obj.lane
      this.callout('JUUST!', 'bad')
    } else if (obj.kind === 'truck') {
      this.callout('CLUNK!', 'bad')
    } else {
      this.callout('POTHOLE!', 'bad')
    }
  }

  private passCheckpoint(): void {
    if (this.passengers.length > CAPACITY) {
      this.strikes += 1
      this.cash = Math.max(0, this.cash - FINE)
      this.cameras.main.shake(420, 0.016)
      bus.emit(EV.flash, 0xff2b2b, 0.55)
      bus.emit(EV.cash, this.cash)
      bus.emit(EV.strikes, this.strikes)
      this.callout(`FINED ₦${FINE}!`, 'bad')
      if (this.strikes >= MAX_STRIKES) {
        this.time.delayedCall(900, () => this.endRun('caught'))
      }
    } else {
      this.callout('LASTMA: E NO WAHALA', 'good')
    }
    this.nextCheckpointAt = this.runTime + CHECKPOINT_MIN + Math.random() * (CHECKPOINT_MAX - CHECKPOINT_MIN)
    this.checkpointWarned = false
  }

  private callout(text: string, kind: 'good' | 'bad' | 'info'): void {
    bus.emit(EV.callout, text, kind)
  }

  private endRun(reason: 'caught' | 'cashout'): void {
    if (this.over) return
    this.over = true
    const bestBefore = loadBest()
    const isBest = this.cash > bestBefore
    if (isBest) saveBest(this.cash)
    const runs = loadRuns() + 1
    saveRuns(runs)

    const summary: Summary = {
      cash: this.cash,
      strikes: this.strikes,
      route: routeFor(this.travel),
      title: titleFor(this.cash),
      reason,
      best: Math.max(bestBefore, this.cash),
      isBest,
      runs,
    }
    bus.emit(EV.end, summary)
    this.scene.stop('Hud')
    this.cameras.main.fadeOut(320, 0, 0, 0)
    this.time.delayedCall(340, () => this.scene.start('End', summary))
  }

  /** Called by the HUD cash-out button. */
  public cashOut(): void {
    if (this.over) return
    this.endRun('cashout')
  }
}
