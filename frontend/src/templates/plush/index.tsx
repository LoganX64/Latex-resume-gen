import type { ResumeData } from '@/types/resume'
import type { ReactNode } from 'react'
import { plushConfig as config } from './config'
import { generatePlushLatex } from './latex'

const titleColor = '#1d76e2'
const subheadingsColor = '#333333'
const headingsColor = '#6a6a6a'

function Preview({
  resume,
  sections,
}: {
  resume: ResumeData
  sections: { id: string; type: string; label: string }[]
}): ReactNode {
  const { personalInfo } = resume

  const rightTypes = ['skills', 'education']
  const leftTypes = ['experience', 'projects', 'certifications', 'achievements', 'publications', 'languages', 'customSections']

  const rightSections = sections.filter((s) => rightTypes.includes(s.type))
  const leftSections = sections.filter((s) => leftTypes.includes(s.type))
  const summarySection = sections.find((s) => s.type === 'summary')

  return (
    <div style={{ fontFamily: '"Source Sans Pro", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', fontSize: '14px', lineHeight: '1.2' }}>
      {/* Header - 3 lines without horizontal rules */}
      {personalInfo.fullName && (
        <header className="pb-1 mb-1">
          {/* Line 1: Name */}
          <div>
            <h1 className="text-[28px] font-bold" style={{ color: titleColor }}>
              {personalInfo.fullName}
            </h1>
          </div>

          {/* Line 2: Title */}
          {personalInfo.professionalTitle && (
            <div>
              <p className="text-[12px] mt-0.5" style={{ color: titleColor, fontFamily: '"Courier New", Courier, monospace' }}>
                {personalInfo.professionalTitle}
              </p>
            </div>
          )}

          {/* Line 3: Contact line with icons */}
          <div>
            <div className="flex flex-wrap gap-x-2 gap-y-0 mt-0.5 text-[10px]" style={{ color: titleColor, fontFamily: '"Courier New", Courier, monospace' }}>
              {personalInfo.website && (
                <span>
                  <span className="mr-0.5">🏠</span>
                  <a href={`https://${personalInfo.website}`} className="underline">{personalInfo.website}</a>
                </span>
              )}
              {personalInfo.github && (
                <span>
                  <span className="mr-0.5">⟳</span>
                  <a href={`https://${personalInfo.github}`} className="underline">{personalInfo.github}</a>
                </span>
              )}
              {personalInfo.linkedin && (
                <span>
                  <span className="mr-0.5">in</span>
                  <a href={`https://${personalInfo.linkedin}`} className="underline">{personalInfo.linkedin}</a>
                </span>
              )}
              {personalInfo.email && (
                <span>
                  <span className="mr-0.5">✉</span>
                  <a href={`mailto:${personalInfo.email}`} className="underline">{personalInfo.email}</a>
                </span>
              )}
              {personalInfo.phone && (
                <span>
                  <span className="mr-0.5">☎</span>
                  {personalInfo.phone}
                </span>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Summary (full width) */}
      {summarySection && resume.summary && (
        <div className="mb-1">
          <h2 className="text-[13px] font-bold uppercase tracking-wider" style={{ color: titleColor }}>
            Professional Summary
          </h2>
          <p className="text-[10px] mt-0.5" style={{ color: subheadingsColor }}>{resume.summary}</p>
        </div>
      )}

      {/* Two columns */}
      <div className="flex gap-2">
        {/* Left column - 70% */}
        <div className="flex-[7] min-w-0">
          {leftSections.map((section) => (
            <LeftSection key={section.id} section={section} resume={resume} />
          ))}
        </div>

        {/* Right column - 25% */}
        <div className="flex-[3] min-w-0">
          {rightSections.map((section) => (
            <RightSection key={section.id} section={section} resume={resume} />
          ))}
        </div>
      </div>
    </div>
  )
}

function LeftSection({
  section,
  resume,
}: {
  section: { type: string; label: string }
  resume: ResumeData
}) {
  switch (section.type) {
    case 'experience':
      return resume.experience.length > 0 ? (
        <div className="mb-1.5">
          <SectionTitle title="Experience" />
          {resume.experience.map((exp) => (
            <div key={exp.id} className="mt-0.5 mb-1 last:mb-0">
              {/* Company name - bold uppercase */}
              <div className="text-[11px] font-bold uppercase" style={{ color: subheadingsColor }}>
                {exp.company || 'Company'}
              </div>
              {/* Position - small caps */}
              <div className="text-[9px] uppercase" style={{ color: subheadingsColor, fontVariant: 'small-caps' }}>
                | {exp.position || 'Position'}
              </div>
              {/* Date | Location - gray */}
              <div className="text-[8px]" style={{ color: headingsColor }}>
                {exp.startDate} – {exp.current ? 'Current' : exp.endDate}{exp.location ? ` | ${exp.location}` : ''}
              </div>
              {/* Bullet points with diamond */}
              {exp.bulletPoints.filter(Boolean).length > 0 && (
                <ul className="mt-0.5 space-y-0">
                  {exp.bulletPoints.filter(Boolean).map((bullet, i) => (
                    <li key={i} className="text-[9px] pl-2 relative" style={{ color: subheadingsColor }}>
                      <span className="absolute left-0" style={{ color: titleColor }}>◆</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      ) : null

    case 'projects':
      return resume.projects.length > 0 ? (
        <div className="mb-1.5">
          <SectionTitle title="Projects" />
          {resume.projects.map((proj) => (
            <div key={proj.id} className="mt-0.5 mb-1 last:mb-0">
              {/* Project name - bold uppercase */}
              <div className="text-[11px] font-bold uppercase" style={{ color: subheadingsColor }}>
                {proj.name || 'Project'}
              </div>
              {/* Technologies - small caps */}
              {proj.technologies.length > 0 && (
                <div className="text-[9px] uppercase" style={{ color: subheadingsColor, fontVariant: 'small-caps' }}>
                  | {proj.technologies.join(', ')}
                </div>
              )}
              {/* Date */}
              {proj.duration && (
                <div className="text-[8px]" style={{ color: headingsColor }}>
                  {proj.duration}
                </div>
              )}
              {/* Bullet points */}
              {proj.bulletPoints.filter(Boolean).length > 0 && (
                <ul className="mt-0.5 space-y-0">
                  {proj.bulletPoints.filter(Boolean).map((bullet, i) => (
                    <li key={i} className="text-[9px] pl-2 relative" style={{ color: subheadingsColor }}>
                      <span className="absolute left-0" style={{ color: titleColor }}>◆</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      ) : null

    case 'certifications':
      return resume.certifications.length > 0 ? (
        <div className="mb-1.5">
          <SectionTitle title="Certifications" />
          {resume.certifications.map((cert) => (
            <div key={cert.id} className="mt-0.5 mb-0.5 last:mb-0">
              <span className="font-bold text-[9px]" style={{ color: subheadingsColor }}>{cert.name || 'Certification'}</span>
              {cert.issuer && <span className="text-[9px]" style={{ color: headingsColor }}> - {cert.issuer}</span>}
              {cert.date && <span className="text-[8px] italic ml-1" style={{ color: headingsColor }}>{cert.date}</span>}
            </div>
          ))}
        </div>
      ) : null

    case 'achievements':
      return resume.achievements.length > 0 ? (
        <div className="mb-1.5">
          <SectionTitle title="Achievements" />
          {resume.achievements.map((ach) => (
            <div key={ach.id} className="mt-0.5 mb-0.5 last:mb-0">
              <span className="font-bold text-[9px]" style={{ color: subheadingsColor }}>{ach.title || 'Achievement'}</span>
              {ach.date && <span className="text-[8px] italic ml-1" style={{ color: headingsColor }}>{ach.date}</span>}
              {ach.description && <p className="text-[9px] mt-0" style={{ color: subheadingsColor }}>{ach.description}</p>}
            </div>
          ))}
        </div>
      ) : null

    case 'publications':
      return resume.publications.length > 0 ? (
        <div className="mb-1.5">
          <SectionTitle title="Publications" />
          {resume.publications.map((pub) => (
            <div key={pub.id} className="mt-0.5 mb-0.5 last:mb-0">
              <span className="font-bold text-[9px]" style={{ color: subheadingsColor }}>{pub.title || 'Publication'}</span>
              {pub.date && <span className="text-[8px] italic ml-1" style={{ color: headingsColor }}>{pub.date}</span>}
              <span className="text-[9px] italic block" style={{ color: headingsColor }}>{pub.publisher}</span>
            </div>
          ))}
        </div>
      ) : null

    case 'languages':
      return resume.languages.length > 0 ? (
        <div className="mb-1.5">
          <SectionTitle title="Languages" />
          <div className="text-[9px]" style={{ color: headingsColor }}>
            {resume.languages.map((lang) =>
              `${lang.name || 'Language'}${lang.proficiency ? ` (${lang.proficiency})` : ''}`
            ).join(', ')}
          </div>
        </div>
      ) : null

    case 'customSections':
      return resume.customSections.length > 0 ? (
        <>
          {resume.customSections.map((cs) => (
            <div key={cs.id} className="mb-1.5">
              <SectionTitle title={cs.title || 'Custom Section'} />
              <p className="text-[9px] whitespace-pre-wrap mt-0.5" style={{ color: subheadingsColor }}>{cs.content}</p>
            </div>
          ))}
        </>
      ) : null

    default:
      return null
  }
}

function RightSection({
  section,
  resume,
}: {
  section: { type: string; label: string }
  resume: ResumeData
}) {
  switch (section.type) {
    case 'skills':
      return resume.skills.length > 0 ? (
        <div className="mb-1.5">
          <SectionTitle title="Skills" />
          <div className="space-y-1 mt-0.5">
            {resume.skills.map((cat) => (
              <div key={cat.id}>
                <span className="font-bold text-[9px] uppercase" style={{ color: subheadingsColor }}>{cat.name || 'Category'}</span>
                <p className="text-[9px] mt-0" style={{ color: headingsColor }}>{cat.skills.join(', ')}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null

    case 'education':
      return resume.education.length > 0 ? (
        <div className="mb-1.5">
          <SectionTitle title="Education" />
          {resume.education.map((edu) => (
            <div key={edu.id} className="mt-0.5 mb-1 last:mb-0">
              {/* University name */}
              <p className="font-bold text-[10px] uppercase" style={{ color: subheadingsColor }}>
                {edu.institution || 'Institution'}
              </p>
              {/* Degree - small caps */}
              <p className="text-[9px] uppercase" style={{ color: subheadingsColor, fontVariant: 'small-caps' }}>
                {edu.degree || 'Degree'}{edu.specialization ? ` in ${edu.specialization}` : ''}
              </p>
              {/* Date | Location */}
              <p className="text-[8px]" style={{ color: headingsColor }}>
                {edu.startDate} – {edu.endDate}
              </p>
              {/* GPA */}
              {edu.cgpa && (
                <p className="text-[8px]" style={{ color: headingsColor }}>
                  Cum. GPA: {edu.cgpa}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : null

    default:
      return null
  }
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h2
      className="text-[13px] font-bold uppercase tracking-wider pb-0 mb-0"
      style={{ color: titleColor, fontVariant: 'small-caps' }}
    >
      {title}
    </h2>
  )
}

export default {
  config,
  Preview,
  generateLatex: generatePlushLatex,
}
