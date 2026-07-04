import { useResumeStore } from '@/stores/resume-store'
import { AlertTriangle } from 'lucide-react'

const SOFT_LIMITS = {
  summary: 400,
  experience: { entries: 4, bulletsPerEntry: 5 },
  projects: { entries: 3, bulletsPerEntry: 4 },
}

export function OverflowIndicator() {
  const resume = useResumeStore((s) => s.resume)

  const summaryLen = resume.summary.length
  const expCount = resume.experience.length
  const totalBullets = resume.experience.reduce((sum, e) => sum + e.bulletPoints.filter(Boolean).length, 0)
  const projCount = resume.projects.length
  const totalProjBullets = resume.projects.reduce((sum, p) => sum + (p.bulletPoints?.filter(Boolean).length || 0), 0)

  const warnings: string[] = []

  if (summaryLen > SOFT_LIMITS.summary) {
    warnings.push(`Summary: ${summaryLen}/${SOFT_LIMITS.summary} chars (consider shortening)`)
  }
  if (expCount > SOFT_LIMITS.experience.entries) {
    warnings.push(`Experience: ${expCount} entries (max recommended: ${SOFT_LIMITS.experience.entries})`)
  }
  if (totalBullets > SOFT_LIMITS.experience.entries * SOFT_LIMITS.experience.bulletsPerEntry) {
    warnings.push(`Experience bullets: ${totalBullets} (max recommended: ${SOFT_LIMITS.experience.entries * SOFT_LIMITS.experience.bulletsPerEntry})`)
  }
  if (projCount > SOFT_LIMITS.projects.entries) {
    warnings.push(`Projects: ${projCount} entries (max recommended: ${SOFT_LIMITS.projects.entries})`)
  }
  if (totalProjBullets > SOFT_LIMITS.projects.entries * SOFT_LIMITS.projects.bulletsPerEntry) {
    warnings.push(`Project bullets: ${totalProjBullets} (max recommended: ${SOFT_LIMITS.projects.entries * SOFT_LIMITS.projects.bulletsPerEntry})`)
  }

  if (warnings.length === 0) return null

  return (
    <div className="border-t border-border px-3 py-2 space-y-1.5">
      {warnings.map((w, i) => (
        <div key={i} className="flex items-center gap-1.5 text-amber-600 bg-amber-50 dark:bg-amber-950/30 rounded px-2 py-1">
          <AlertTriangle className="h-3 w-3 shrink-0" />
          <p className="text-[10px] leading-tight">{w}</p>
        </div>
      ))}
      <div className="flex gap-3 text-[9px] text-muted-foreground">
        <span>Summary: {summaryLen}/{SOFT_LIMITS.summary}</span>
        <span>Exp: {expCount}/{SOFT_LIMITS.experience.entries}</span>
        <span>Proj: {projCount}/{SOFT_LIMITS.projects.entries}</span>
      </div>
    </div>
  )
}
