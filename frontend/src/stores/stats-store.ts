import { create } from 'zustand'
import { getStats } from '@/utils/stats'

interface StatsState {
  visits: number
  downloads: number
  refresh: () => Promise<void>
  setDownloads: (count: number) => void
}

export const useStatsStore = create<StatsState>((set) => ({
  visits: 0,
  downloads: 0,
  refresh: async () => {
    const stats = await getStats()
    set(stats)
  },
  setDownloads: (downloads) => set({ downloads }),
}))
