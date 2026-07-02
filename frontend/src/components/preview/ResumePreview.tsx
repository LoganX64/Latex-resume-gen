import { useRef, useEffect, useState, useCallback } from 'react'
import { useResumeStore } from '@/stores/resume-store'
import type { ZoomLevel } from '@/types/resume'
import { Button } from '@/components/ui/button'
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react'

const A4_WIDTH_MM = 210
const A4_HEIGHT_MM = 297
const MM_TO_PX = 3.7795275591
const A4_WIDTH_PX = Math.round(A4_WIDTH_MM * MM_TO_PX)
const A4_HEIGHT_PX = Math.round(A4_HEIGHT_MM * MM_TO_PX)

const zoomLevels: ZoomLevel[] = [50, 75, 100, 125, 150]

interface ResumePreviewProps {
  onOverflowChange?: (isOverflowing: boolean) => void
}

export function ResumePreview({ onOverflowChange }: ResumePreviewProps) {
  const zoom = useResumeStore((s) => s.zoom)
  const setZoom = useResumeStore((s) => s.setZoom)
  const resume = useResumeStore((s) => s.resume)
  const sectionOrder = useResumeStore((s) => s.sectionOrder)
  const sectionVisibility = useResumeStore((s) => s.sectionVisibility)
  const pageRef = useRef<HTMLDivElement>(null)
  const [isOverflowing, setIsOverflowing] = useState(false)

  const scale = zoom === 'fit' ? 1 : zoom / 100

  const checkOverflow = useCallback(() => {
    if (!pageRef.current) return
    const el = pageRef.current
    const overflowing = el.scrollHeight > el.clientHeight + 5
    setIsOverflowing(overflowing)
    onOverflowChange?.(overflowing)
  }, [onOverflowChange])

  useEffect(() => {
    checkOverflow()
  }, [resume, sectionOrder, sectionVisibility, checkOverflow])

  function cycleZoom(direction: 'in' | 'out') {
    const currentIdx = typeof zoom === 'number' ? zoomLevels.indexOf(zoom) : -1
    if (currentIdx === -1) {
      setZoom(direction === 'in' ? 100 : 75)
      return
    }
    if (direction === 'in' && currentIdx < zoomLevels.length - 1) {
      setZoom(zoomLevels[currentIdx + 1])
    } else if (direction === 'out' && currentIdx > 0) {
      setZoom(zoomLevels[currentIdx - 1])
    }
  }

  const visibleSections = sectionOrder.filter(
    (s) => sectionVisibility[s.type] ?? false
  )

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-background/95 backdrop-blur">
        <span className="text-[10px] text-muted-foreground">Preview</span>
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => cycleZoom('out')}
            disabled={zoom === 50}
          >
            <ZoomOut className="h-3 w-3" />
          </Button>
          <select
            value={zoom}
            onChange={(e) => {
              const val = e.target.value
              setZoom(val === 'fit' ? 'fit' : Number(val) as ZoomLevel)
            }}
            className="text-[10px] bg-transparent border border-border rounded px-1.5 py-0.5 text-foreground cursor-pointer"
          >
            {zoomLevels.map((z) => (
              <option key={z} value={z}>
                {z}%
              </option>
            ))}
            <option value="fit">Fit</option>
          </select>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => cycleZoom('in')}
            disabled={zoom === 150}
          >
            <ZoomIn className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setZoom('fit')}
            title="Fit to width"
          >
            <Maximize className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div className="flex items-start justify-center min-h-full">
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
              width: A4_WIDTH_PX,
            }}
          >
            <div
              ref={pageRef}
              className={`bg-white text-black relative overflow-hidden ${
                isOverflowing ? 'ring-2 ring-red-500' : ''
              }`}
              style={{
                width: A4_WIDTH_PX,
                minHeight: A4_HEIGHT_PX,
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                padding: `${20 * MM_TO_PX}px ${15 * MM_TO_PX}px`,
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: '10px',
                lineHeight: '1.4',
              }}
            >
              <ResumeContent resume={resume} sections={visibleSections} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ResumeContent({
  resume,
  sections,
}: {
  resume: ReturnType<typeof useResumeStore.getState>['resume']
  sections: { id: string; type: string; label: string }[]
}) {
  const { personalInfo } = resume

  return (
    <div className="space-y-3">
      {/* Header */}
      {personalInfo.fullName && (
        <header className="text-center border-b border-gray-300 pb-2">
          <h1 className="text-lg font-bold tracking-wide text-gray-900">
            {personalInfo.fullName}
          </h1>
          {personalInfo.professionalTitle && (
            <p className="text-xs text-gray-600 mt-0.5">{personalInfo.professionalTitle}</p>
          )}
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-1 text-[9px] text-gray-600">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
            {personalInfo.github && <span>{personalInfo.github}</span>}
            {personalInfo.website && <span>{personalInfo.website}</span>}
          </div>
        </header>
      )}

      {/* Sections */}
      {sections.map((section) => (
        <SectionContent key={section.id} section={section} resume={resume} />
      ))}
    </div>
  )
}

function SectionContent({
  section,
  resume,
}: {
  section: { type: string; label: string }
  resume: ReturnType<typeof useResumeStore.getState>['resume']
}) {
  switch (section.type) {
    case 'summary':
      return resume.summary ? (
        <Section title="Professional Summary">
          <p className="text-[9px] leading-relaxed text-gray-700">{resume.summary}</p>
        </Section>
      ) : null

    case 'experience':
      return resume.experience.length > 0 ? (
        <Section title="Work Experience">
          {resume.experience.map((exp) => (
            <div key={exp.id} className="mb-2 last:mb-0">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-[9px]">{exp.position || 'Position'}</span>
                <span className="text-[8px] text-gray-500">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[9px] text-gray-600 italic">{exp.company || 'Company'}</span>
                {exp.location && (
                  <span className="text-[8px] text-gray-500">{exp.location}</span>
                )}
              </div>
              {exp.bulletPoints.filter(Boolean).length > 0 && (
                <ul className="mt-0.5 space-y-0.5">
                  {exp.bulletPoints.filter(Boolean).map((bullet, i) => (
                    <li key={i} className="text-[8px] text-gray-700 pl-2 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400">
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Section>
      ) : null

    case 'skills':
      return resume.skills.length > 0 ? (
        <Section title="Technical Skills">
          {resume.skills.map((cat) => (
            <div key={cat.id} className="mb-1 last:mb-0">
              <span className="font-semibold text-[9px]">{cat.name || 'Category'}: </span>
              <span className="text-[8px] text-gray-700">{cat.skills.join(', ')}</span>
            </div>
          ))}
        </Section>
      ) : null

    case 'projects':
      return resume.projects.length > 0 ? (
        <Section title="Projects">
          {resume.projects.map((proj) => (
            <div key={proj.id} className="mb-2 last:mb-0">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-[9px]">{proj.name || 'Project'}</span>
                {proj.duration && (
                  <span className="text-[8px] text-gray-500">{proj.duration}</span>
                )}
              </div>
              {proj.role && (
                <span className="text-[8px] text-gray-600 italic">{proj.role}</span>
              )}
              {proj.description && (
                <p className="text-[8px] text-gray-700 mt-0.5">{proj.description}</p>
              )}
              {proj.bulletPoints.filter(Boolean).length > 0 && (
                <ul className="mt-0.5 space-y-0.5">
                  {proj.bulletPoints.filter(Boolean).map((bullet, i) => (
                    <li key={i} className="text-[8px] text-gray-700 pl-2 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400">
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
              {proj.technologies.length > 0 && (
                <p className="text-[8px] text-gray-500 mt-0.5">
                  <span className="font-medium">Tech:</span> {proj.technologies.join(', ')}
                </p>
              )}
            </div>
          ))}
        </Section>
      ) : null

    case 'education':
      return resume.education.length > 0 ? (
        <Section title="Education">
          {resume.education.map((edu) => (
            <div key={edu.id} className="mb-1.5 last:mb-0">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-[9px]">
                  {edu.degree || 'Degree'}
                  {edu.specialization ? ` in ${edu.specialization}` : ''}
                </span>
                <span className="text-[8px] text-gray-500">
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[9px] text-gray-600 italic">{edu.institution || 'Institution'}</span>
                {edu.cgpa && <span className="text-[8px] text-gray-500">CGPA: {edu.cgpa}</span>}
              </div>
            </div>
          ))}
        </Section>
      ) : null

    case 'certifications':
      return resume.certifications.length > 0 ? (
        <Section title="Certifications">
          {resume.certifications.map((cert) => (
            <div key={cert.id} className="mb-1 last:mb-0 flex justify-between items-baseline">
              <span className="text-[9px]">
                <span className="font-semibold">{cert.name || 'Certification'}</span>
                {cert.issuer && <span className="text-gray-600"> - {cert.issuer}</span>}
              </span>
              <span className="text-[8px] text-gray-500">{cert.date}</span>
            </div>
          ))}
        </Section>
      ) : null

    case 'achievements':
      return resume.achievements.length > 0 ? (
        <Section title="Achievements">
          {resume.achievements.map((ach) => (
            <div key={ach.id} className="mb-1 last:mb-0">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-[9px]">{ach.title || 'Achievement'}</span>
                {ach.date && <span className="text-[8px] text-gray-500">{ach.date}</span>}
              </div>
              {ach.description && (
                <p className="text-[8px] text-gray-700">{ach.description}</p>
              )}
            </div>
          ))}
        </Section>
      ) : null

    case 'publications':
      return resume.publications.length > 0 ? (
        <Section title="Publications">
          {resume.publications.map((pub) => (
            <div key={pub.id} className="mb-1 last:mb-0">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-[9px]">{pub.title || 'Publication'}</span>
                <span className="text-[8px] text-gray-500">{pub.date}</span>
              </div>
              <span className="text-[8px] text-gray-600 italic">{pub.publisher}</span>
              {pub.description && (
                <p className="text-[8px] text-gray-700">{pub.description}</p>
              )}
            </div>
          ))}
        </Section>
      ) : null

    case 'languages':
      return resume.languages.length > 0 ? (
        <Section title="Languages">
          <div className="flex flex-wrap gap-x-3 gap-y-0.5">
            {resume.languages.map((lang) => (
              <span key={lang.id} className="text-[8px] text-gray-700">
                <span className="font-medium">{lang.name || 'Language'}</span>
                {lang.proficiency && <span className="text-gray-500"> ({lang.proficiency})</span>}
              </span>
            ))}
          </div>
        </Section>
      ) : null

    case 'customSections':
      return resume.customSections.length > 0 ? (
        <>
          {resume.customSections.map((cs) => (
            <Section key={cs.id} title={cs.title || 'Custom Section'}>
              <p className="text-[8px] text-gray-700 whitespace-pre-wrap">{cs.content}</p>
            </Section>
          ))}
        </>
      ) : null

    default:
      return null
  }
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-[10px] font-bold uppercase tracking-wider text-gray-800 border-b border-gray-300 pb-0.5 mb-1">
        {title}
      </h2>
      {children}
    </div>
  )
}
