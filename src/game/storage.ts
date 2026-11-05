const BEST_KEY = 'danfo.best.v1'
const RUNS_KEY = 'danfo.runs.v1'

/** Best earnings ever banked. Storage can be blocked, so every access is guarded. */
export function loadBest(): number {
  try {
    const raw = localStorage.getItem(BEST_KEY)
    const value = raw ? Number.parseInt(raw, 10) : 0
    return Number.isFinite(value) && value > 0 ? value : 0
  } catch {
    return 0
  }
}

export function saveBest(value: number): void {
  try {
    localStorage.setItem(BEST_KEY, String(Math.max(0, Math.round(value))))
  } catch {
    /* private mode / storage disabled — scores simply do not persist */
  }
}

export function loadRuns(): number {
  try {
    const raw = localStorage.getItem(RUNS_KEY)
    const value = raw ? Number.parseInt(raw, 10) : 0
    return Number.isFinite(value) && value > 0 ? value : 0
  } catch {
    return 0
  }
}

export function saveRuns(value: number): void {
  try {
    localStorage.setItem(RUNS_KEY, String(Math.max(0, Math.round(value))))
  } catch {
    /* ignore */
  }
}
