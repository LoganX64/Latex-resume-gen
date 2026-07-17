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

export async function recordVisit(): Promise<number> {
  if (sessionStorage.getItem(STATS_SESSION_KEY)) {
    const stats = await getStats()
    return stats.visits
  }
  sessionStorage.setItem(STATS_SESSION_KEY, '1')
  try {
    const res = await fetch(`${API_BASE}/stats/visit`, { method: 'POST' })
    if (res.ok) {
      const data = await res.json()
      return typeof data.visits === 'number' ? data.visits : 0
    }
  } catch {}
  return 0
}

export async function recordDownload(): Promise<number> {
  try {
    const res = await fetch(`${API_BASE}/stats/download`, { method: 'POST' })
    if (res.ok) {
      const data = await res.json()
      return typeof data.downloads === 'number' ? data.downloads : 0
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
