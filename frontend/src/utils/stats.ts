import { useStatsStore } from '@/stores/stats-store'

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'

const STATS_SESSION_KEY = 'resume-stats-session'

interface Stats {
  visits: number
  downloads: number
}

export async function getStats(): Promise<Stats> {
  try {
    const res = await fetch(`${API_BASE}/stats`)
    if (res.ok) {
      const data = await res.json()
      return {
        visits: typeof data.visits === 'number' ? data.visits : 0,
        downloads: typeof data.downloads === 'number' ? data.downloads : 0,
      }
    }
  } catch {}
  return { visits: 0, downloads: 0 }
}

export async function recordVisit(): Promise<void> {
  if (sessionStorage.getItem(STATS_SESSION_KEY)) return
  sessionStorage.setItem(STATS_SESSION_KEY, '1')
  try {
    await fetch(`${API_BASE}/stats/visit`, { method: 'POST' })
  } catch {}
}

export async function recordDownload(): Promise<number> {
  try {
    const res = await fetch(`${API_BASE}/stats/download`, { method: 'POST' })
    if (res.ok) {
      const data = await res.json()
      const count = typeof data.downloads === 'number' ? data.downloads : 0
      useStatsStore.getState().setDownloads(count)
      return count
    }
  } catch {}
  return 0
}

export async function getDashboardStats(adminKey: string): Promise<Stats | null> {
  try {
    const res = await fetch(`${API_BASE}/stats/dashboard`, {
      headers: { 'X-Admin-Key': adminKey },
    })
    if (res.ok) {
      const data = await res.json()
      return {
        visits: typeof data.visits === 'number' ? data.visits : 0,
        downloads: typeof data.downloads === 'number' ? data.downloads : 0,
      }
    }
  } catch {}
  return null
}
