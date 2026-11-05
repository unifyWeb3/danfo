/**
 * Tiny typed event bus so the HUD scene can react to gameplay without
 * the two scenes knowing about each other's internals.
 */
type Handler = (...args: never[]) => void

const handlers = new Map<string, Set<Handler>>()

export const bus = {
  on(event: string, fn: Handler): () => void {
    let set = handlers.get(event)
    if (!set) {
      set = new Set()
      handlers.set(event, set)
    }
    set.add(fn)
    return () => set!.delete(fn)
  },
  emit(event: string, ...args: unknown[]): void {
    const set = handlers.get(event)
    if (!set) return
    for (const fn of set) (fn as (...a: unknown[]) => void)(...args)
  },
  clear(): void {
    handlers.clear()
  },
}

export const EV = {
  cash: 'cash',
  pax: 'pax',
  strikes: 'strikes',
  warn: 'warn',
  callout: 'callout',
  flash: 'flash',
  cashout: 'cashout',
  horn: 'horn',
  end: 'end',
} as const
