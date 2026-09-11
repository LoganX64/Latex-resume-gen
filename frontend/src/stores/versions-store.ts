import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { ResumeVersion } from '@/types/resume'
import { generateId } from '@/lib/utils'
import { encryptedStorage, encryptData } from '@/lib/crypto'

interface VersionMatchData {
  resume: ResumeVersion['resume']
  templateId: string
  sectionOrder: ResumeVersion['sectionOrder']
  sectionVisibility: ResumeVersion['sectionVisibility']
}

interface VersionsStore {
  versions: ResumeVersion[]
  addVersion: (version: Omit<ResumeVersion, 'id' | 'createdAt'>) => boolean
  updateVersion: (id: string, data: Omit<ResumeVersion, 'id' | 'createdAt'>) => boolean
  removeVersion: (id: string) => void
  getVersion: (id: string) => ResumeVersion | undefined
  findMatchingVersion: (data: VersionMatchData) => ResumeVersion | null
}

export const useVersionsStore = create<VersionsStore>()(
  persist(
    (set, get) => ({
      versions: [],

      addVersion: (version) => {
        const newVersion: ResumeVersion = {
          ...version,
          id: generateId(),
          createdAt: new Date().toISOString(),
        }
        const newState = [...get().versions, newVersion]
        try {
          encryptData(
            JSON.stringify({ state: { versions: newState }, version: 0 })
          ).then((encrypted) => {
            localStorage.setItem('latex-resume-versions', encrypted)
          })
          set({ versions: newState })
          return true
        } catch {
          return false
        }
      },

      updateVersion: (id, data) => {
        const updatedVersion: ResumeVersion = {
          ...data,
          id,
          createdAt: new Date().toISOString(),
        }
        const newState = get().versions.map((v) => (v.id === id ? updatedVersion : v))
        try {
          encryptData(
            JSON.stringify({ state: { versions: newState }, version: 0 })
          ).then((encrypted) => {
            localStorage.setItem('latex-resume-versions', encrypted)
          })
          set({ versions: newState })
          return true
        } catch {
          return false
        }
      },

      removeVersion: (id) =>
        set((state) => ({
          versions: state.versions.filter((v) => v.id !== id),
        })),

      getVersion: (id) => get().versions.find((v) => v.id === id),

      findMatchingVersion: (data) => {
        const versions = get().versions
        for (const version of versions) {
          if (
            JSON.stringify(version.resume) === JSON.stringify(data.resume) &&
            version.templateId === data.templateId &&
            JSON.stringify(version.sectionOrder) === JSON.stringify(data.sectionOrder) &&
            JSON.stringify(version.sectionVisibility) === JSON.stringify(data.sectionVisibility)
          ) {
            return version
          }
        }
        return null
      },
    }),
    {
      name: 'latex-resume-versions',
      storage: createJSONStorage(() => encryptedStorage),
    }
  )
)
