import * as Sentry from '@sentry/react'

const STORAGE_KEY = 'cvstack:chunk-reload'
const MAX_RELOADS = 2
const WINDOW_MS = 30_000

const CHUNK_LOAD_MESSAGES = [
  'Failed to fetch dynamically imported module',
  'error loading dynamically imported module',
  'Importing a module script failed',
]

type ResourceTimingEntry = PerformanceResourceTiming & { responseStatus?: number }

type NavigationTimingEntry = PerformanceNavigationTiming & { persisted?: boolean }

type ReloadState = { count: number; since: number }

let installed = false

export function isChunkLoadError(error: unknown): boolean {
  if (!(error instanceof Error)) return false
  return CHUNK_LOAD_MESSAGES.some((message) => error.message.includes(message))
}

function failingAsset(message: string): string | null {
  return message.match(/https?:\/\/\S+/)?.[0] ?? null
}

function resourceOutcome(url: string | null): string {
  if (!url) return 'unknown'
  const entry = performance.getEntriesByName(url)[0] as ResourceTimingEntry | undefined
  if (!entry) return 'no-timing'
  const status = entry.responseStatus
  return typeof status === 'number' && status > 0 ? `status-${status}` : 'no-response-status'
}

function navigationTiming(): NavigationTimingEntry | undefined {
  return performance.getEntriesByType('navigation')[0] as NavigationTimingEntry | undefined
}

function readState(): ReloadState | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return null
    const { count, since } = parsed as Partial<ReloadState>
    if (typeof count !== 'number' || typeof since !== 'number') return null
    return { count, since }
  } catch {
    return null
  }
}

function nextReloadState(): { allowed: boolean; state: ReloadState } {
  const now = Date.now()
  const previous = readState()
  const state =
    !previous || now - previous.since > WINDOW_MS ? { count: 0, since: now } : previous
  return { allowed: state.count < MAX_RELOADS, state }
}

function rememberReload(state: ReloadState) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, count: state.count + 1 }))
  } catch {
    // sessionStorage throws when storage is unavailable; reload anyway
  }
}

export function installPreloadErrorHandler(): void {
  if (installed) return
  installed = true

  window.addEventListener('vite:preloadError', (event) => {
    const { payload } = event
    if (!isChunkLoadError(payload)) return

    const asset = failingAsset(payload.message)
    const { allowed, state } = nextReloadState()
    const navigation = navigationTiming()

    Sentry.addBreadcrumb({
      category: 'chunk-load',
      level: 'warning',
      data: {
        asset,
        outcome: resourceOutcome(asset),
        offline: !navigator.onLine,
        persisted: navigation?.persisted ?? false,
        navType: navigation?.type ?? 'unknown',
        attempt: state.count + 1,
        recovered: allowed,
      },
    })

    if (!allowed) return

    rememberReload(state)
    event.preventDefault()
    window.location.reload()
  })
}
