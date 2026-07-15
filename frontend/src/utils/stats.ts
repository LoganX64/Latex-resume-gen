const STORAGE_KEY = 'resume-stats'
const VISIT_SESSION_KEY = 'resume-stats-session'

interface Stats {
  visits: number
  downloads: number
}

function read(): Stats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      return {
        visits: typeof data.visits === 'number' ? data.visits : 0,
        downloads: typeof data.downloads === 'number' ? data.downloads : 0,
      }
    }
  } catch {}
  return { visits: 0, downloads: 0 }
}

function write(stats: Stats) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
}

export function getStats(): Stats {
  return read()
}

export function recordVisit(): number {
  if (sessionStorage.getItem(VISIT_SESSION_KEY)) {
    return read().visits
  }
  sessionStorage.setItem(VISIT_SESSION_KEY, '1')
  const stats = read()
  stats.visits += 1
  write(stats)
  return stats.visits
}

export function recordDownload(): number {
  const stats = read()
  stats.downloads += 1
  write(stats)
  return stats.downloads
}
