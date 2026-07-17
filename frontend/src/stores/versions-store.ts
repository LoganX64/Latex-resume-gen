import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ResumeVersion } from '@/types/resume'
import { generateId } from '@/lib/utils'

interface VersionsStore {
  versions: ResumeVersion[]
  addVersion: (version: Omit<ResumeVersion, 'id' | 'createdAt'>) => void
  removeVersion: (id: string) => void
  getVersion: (id: string) => ResumeVersion | undefined
}

export const useVersionsStore = create<VersionsStore>()(
  persist(
    (set, get) => ({
      versions: [],

      addVersion: (version) =>
        set((state) => ({
          versions: [
            ...state.versions,
            {
              ...version,
              id: generateId(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      removeVersion: (id) =>
        set((state) => ({
          versions: state.versions.filter((v) => v.id !== id),
        })),

      getVersion: (id) => get().versions.find((v) => v.id === id),
    }),
    {
      name: 'latex-resume-versions',
    }
  )
)
