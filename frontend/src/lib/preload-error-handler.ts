import { lazy } from 'react'
import * as Sentry from '@sentry/react'

const STORAGE_KEY = 'cvstack:chunk-reload'
const LAZY_STORAGE_KEY = 'cvstack:chunk-reload-lazy'
const MAX_RELOADS = 2
const WINDOW_MS = 30_000

const CHUNK_LOAD_MESSAGES = [
  'Failed to fetch dynamically imported module',
  'error loading dynamically imported module',
  'Importing a module script failed',
  'Failed to load chunk',
]

type ResourceTimingEntry = PerformanceResourceTiming & { responseStatus?: number }

type NavigationTimingEntry = PerformanceNavigationTiming & { persisted?: boolean }

type ReloadState = { count: number; since: number }

let installed = false
let reloading = false

export function isReloading(): boolean {
  return reloading
}

export function isChunkLoadError(error: unknown): boolean {
  if (!(error instanceof Error)) return false
  return CHUNK_LOAD_MESSAGES.some((message) => error.message.includes(message))
}

/**
 * Builds an Error that `isChunkLoadError()` recognises, so it is retried and
 * rate-limited by the recovery paths and rendered as a chunk-load failure by
 * ChunkLoadErrorBoundary rather than an unknown render error.
 */
export function chunkLoadError(message: string, cause?: unknown): Error {
  const error = new Error(`Failed to load chunk: ${message}`)
  if (cause !== undefined) {
    ;(error as { cause?: unknown }).cause = cause
  }
  return error
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

function readState(key: string): ReloadState | null {
  try {
    const raw = sessionStorage.getItem(key)
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

function nextReloadState(key: string): { allowed: boolean; state: ReloadState } {
  const now = Date.now()
  const previous = readState(key)
  const state =
    !previous || now - previous.since > WINDOW_MS ? { count: 0, since: now } : previous
  return { allowed: state.count < MAX_RELOADS, state }
}

function rememberReload(key: string, state: ReloadState) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ ...state, count: state.count + 1 }))
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
    const { allowed, state } = nextReloadState(STORAGE_KEY)
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

    rememberReload(STORAGE_KEY, state)
    reloading = true
    window.location.reload()
  })
}

/**
 * A dynamic import can resolve with `undefined` rather than reject when a
 * `vite:preloadError` handler calls `preventDefault()`. React.lazy reads
 * `.default` off whatever it is handed, so validate before it gets there.
 */
function assertHasDefault<T>(mod: { default: T } | undefined): { default: T } {
  if (!mod || typeof mod !== 'object' || !('default' in mod)) {
    throw chunkLoadError('dynamic import resolved with no module')
  }
  return mod
}

/**
 * Drop-in replacement for `React.lazy` that automatically retries the dynamic
 * import once (after a 300 ms delay) when a chunk-load error is detected.
 *
 * Handles the Vercel / CDN race condition where a freshly-deployed asset URL
 * is not yet available on the edge when a user navigates right after a deploy,
 * causing `lazy()` to throw before the Suspense boundary resolves.
 */
export function lazyWithRetry<T extends React.ComponentType<unknown>>(
  factory: () => Promise<{ default: T }>,
  retries = 1,
  delayMs = 300,
): ReturnType<typeof lazy<T>> {
  return lazy(() =>
    factory()
      .then(assertHasDefault)
      .catch((err: unknown) => {
        if (!isChunkLoadError(err)) throw err

        if (retries > 0) {
          // First failure: wait then retry once
          return new Promise<{ default: T }>((resolve, reject) => {
            setTimeout(async () => {
              try {
                const mod = assertHasDefault(await factory())
                resolve(mod)
              } catch (retryErr: unknown) {
                // Retry also failed (e.g. stale chunk URL after a Vercel deploy).
                // Auto-reload if within the rate limit, otherwise surface the
                // ErrorBoundary so the user can manually reload.
                if (isChunkLoadError(retryErr)) {
                  const { allowed, state } = nextReloadState(LAZY_STORAGE_KEY)
                  if (allowed) {
                    rememberReload(LAZY_STORAGE_KEY, state)
                    reloading = true
                    window.location.reload()
                    return // page is reloading; leave promise pending
                  }
                }
                reject(retryErr)
              }
            }, delayMs)
          })
        }

        throw err
      }),
  )
}
