import { useResumeStore } from '@/stores/resume-store'
import { AlertTriangle } from 'lucide-react'

const SOFT_LIMITS = {
  summary: 300,
  experience: { entries: 3, bulletsPerEntry: 4 },
  projects: { entries: 2, bulletsPerEntry: 3 },
  education: { entries: 1 },
  certifications: { entries: 2 },
  achievements: { entries: 1 },
}

export function OverflowIndicator() {
  const resume = useResumeStore((s) => s.resume)

  const summaryLen = resume.summary.length
  const expCount = resume.experience.length
  const expBullets = resume.experience.reduce((sum, e) => sum + e.bulletPoints.filter(Boolean).length, 0)
  const projCount = resume.projects.length
  const projBullets = resume.projects.reduce((sum, p) => sum + (p.bulletPoints?.filter(Boolean).length || 0), 0)
  const eduCount = resume.education.length
  const certCount = resume.certifications.length
  const achCount = resume.achievements.length
  const langCount = resume.languages.length
  const skCount = resume.skills.length

  const totalSections = [summaryLen > 0, expCount > 0, projCount > 0, eduCount > 0, certCount > 0, achCount > 0, langCount > 0, skCount > 0].filter(Boolean).length

  const warnings: string[] = []

  if (summaryLen > SOFT_LIMITS.summary) {
    warnings.push(`Summary: ${summaryLen} chars keep it under ${SOFT_LIMITS.summary} for one-page fit`)
  }
  if (expCount > SOFT_LIMITS.experience.entries) {
    warnings.push(`Experience: ${expCount} entries — hide or remove to fit one page`)
  }
  if (expBullets > SOFT_LIMITS.experience.entries * SOFT_LIMITS.experience.bulletsPerEntry) {
    warnings.push(`Experience bullets: ${expBullets} total — too many for one page`)
  }
  if (projCount > SOFT_LIMITS.projects.entries) {
    warnings.push(`Projects: ${projCount} entries — hide or remove to fit one page`)
  }
  if (projBullets > SOFT_LIMITS.projects.entries * SOFT_LIMITS.projects.bulletsPerEntry) {
    warnings.push(`Project bullets: ${projBullets} total — too many for one page`)
  }
  if (totalSections > 7) {
    warnings.push(`Too many sections: ${totalSections} active — hide some in the sidebar`)
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
      <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[9px] text-muted-foreground">
        <span>Sum: {summaryLen}</span>
        <span>Exp: {expCount}</span>
        <span>Proj: {projCount}</span>
        <span>Edu: {eduCount}</span>
        <span>Sections: {totalSections}</span>
      </div>
    </div>
  )
}
