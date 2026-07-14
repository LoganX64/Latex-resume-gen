import type { ResumeData } from '@/types/resume'
import type { ReactNode } from 'react'
import config from './config'
import { generateTwocolumnLatex } from './latex'
import { ContactIcon } from '../icons'

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

  const rightTypes = ['skills', 'education', 'languages', 'certifications']
  const leftTypes = ['experience', 'projects', 'achievements', 'publications', 'customSections']

  const rightSections = sections.filter((s) => rightTypes.includes(s.type))
  const leftSections = sections.filter((s) => leftTypes.includes(s.type))
  const summarySection = sections.find((s) => s.type === 'summary')

  return (
    <div style={{ fontFamily: '"Source Sans Pro", sans-serif', fontSize: '14px', lineHeight: 1.2 }}>
      {/* Header */}
      {personalInfo.fullName && (
        <header style={{ marginBottom: '4px' }}>
          {/* Name */}
          <div>
            <h1 style={{ fontSize: '48px', fontWeight: 700, lineHeight: 1.22, margin: 0, color: titleColor }}>
              {personalInfo.fullName}
            </h1>
          </div>

          {/* Title */}
          {personalInfo.professionalTitle && (
            <div style={{ marginTop: '4px' }}>
              <p style={{ fontSize: '19px', lineHeight: 1.2, margin: 0, color: titleColor }}>
                {personalInfo.professionalTitle}
              </p>
            </div>
          )}

          {/* Contact line */}
          <div style={{ marginTop: '2px' }}>
            <div style={{ fontSize: '13px', lineHeight: 1.3, color: titleColor }}>
              {[
                personalInfo.website && <a key="web" href={`https://${personalInfo.website}`} style={{ color: titleColor, display: 'inline-flex', alignItems: 'center', gap: '4px' }}><ContactIcon type="website" className="w-3.5 h-3.5" />{personalInfo.website}</a>,
                personalInfo.github && <a key="gh" href={`https://${personalInfo.github}`} style={{ color: titleColor, display: 'inline-flex', alignItems: 'center', gap: '4px' }}><ContactIcon type="github" className="w-3.5 h-3.5" />{personalInfo.github}</a>,
                personalInfo.linkedin && <a key="li" href={`https://${personalInfo.linkedin}`} style={{ color: titleColor, display: 'inline-flex', alignItems: 'center', gap: '4px' }}><ContactIcon type="linkedin" className="w-3.5 h-3.5" />{personalInfo.linkedin}</a>,
                personalInfo.email && <a key="em" href={`mailto:${personalInfo.email}`} style={{ color: titleColor, display: 'inline-flex', alignItems: 'center', gap: '4px' }}><ContactIcon type="email" className="w-3.5 h-3.5" />{personalInfo.email}</a>,
                personalInfo.phone && <a key="ph" href={`tel:${personalInfo.phone}`} style={{ color: titleColor, display: 'inline-flex', alignItems: 'center', gap: '4px' }}><ContactIcon type="phone" className="w-3.5 h-3.5" />{personalInfo.phone}</a>,
              ].filter(Boolean).map((item, i, arr) => (
                <span key={i}>
                  {item}
                  {i < arr.length - 1 && <span style={{ margin: '0 6px' }}>·</span>}
                </span>
              ))}
            </div>
          </div>
        </header>
      )}

      {/* Summary (full width) */}
      {summarySection && resume.summary && (
        <div style={{ marginBottom: '8px' }}>
          <SectionTitle title="Professional Summary" />
          <p style={{ fontSize: '12px', lineHeight: 1.4, marginTop: '2px', color: subheadingsColor }}>{resume.summary}</p>
        </div>
      )}

      {/* Two columns */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {/* Left column - 70% */}
        <div style={{ flex: 7, minWidth: 0 }}>
          {leftSections.map((section) => (
            <LeftSection key={section.id} section={section} resume={resume} />
          ))}
        </div>

        {/* Right column - 25% */}
        <div style={{ flex: 3, minWidth: 0 }}>
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
        <div style={{ marginBottom: '8px' }} data-section="true">
          <SectionTitle title="Experience" />
          {resume.experience.map((exp) => (
            <div key={exp.id} style={{ marginTop: '2px', marginBottom: '4px' }}>
              {/* Company | Position - same line */}
              <div style={{ lineHeight: 1.3, color: subheadingsColor }}>
                <span style={{ fontSize: '15px', fontWeight: 700, textTransform: 'uppercase' as const }}>{exp.company || 'Company'}</span>
                <span style={{ fontSize: '13px' }}> | {exp.position || 'Position'}</span>
              </div>
              {/* Date | Location - gray */}
              <div style={{ fontSize: '12px', lineHeight: 1.3, color: headingsColor }}>
                {exp.startDate} – {exp.current ? 'Current' : exp.endDate}{exp.location ? ` | ${exp.location}` : ''}
              </div>
              {/* Bullet points with diamond */}
              {exp.bulletPoints.filter(Boolean).length > 0 && (
                <ul style={{ marginTop: '2px', paddingLeft: '14px', listStyle: 'none' }}>
                  {exp.bulletPoints.filter(Boolean).map((bullet, i) => (
                    <li key={i} style={{ fontSize: '12px', lineHeight: 1.35, color: headingsColor, position: 'relative', marginBottom: '1px' }}>
                      <span style={{ position: 'absolute', left: '-12px', color: titleColor, fontSize: '8px', top: '3px' }}>◆</span>
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
        <div style={{ marginBottom: '8px' }} data-section="true">
          <SectionTitle title="Projects" />
          {resume.projects.map((proj) => (
            <div key={proj.id} style={{ marginTop: '2px', marginBottom: '4px' }}>
              {/* Project | Technologies - same line with date right-aligned */}
              <div style={{ display: 'flex', justifyContent: 'space-between', lineHeight: 1.3, color: subheadingsColor }}>
                <span>
                  <span style={{ fontSize: '15px', fontWeight: 700, textTransform: 'uppercase' as const }}>{proj.name || 'Project'}</span>
                  {proj.technologies.length > 0 && (
                    <span style={{ fontSize: '13px' }}> | {proj.technologies.join(', ')}</span>
                  )}
                </span>
                {proj.duration && (
                  <span style={{ fontSize: '12px', lineHeight: 1.3, color: headingsColor, whiteSpace: 'nowrap' }}>
                    {proj.duration}
                  </span>
                )}
              </div>
              {/* Description */}
              {proj.description && (
                <p style={{ fontSize: '12px', lineHeight: 1.3, margin: '2px 0 0 0', color: headingsColor }}>{proj.description}</p>
              )}
              {/* Bullet points */}
              {proj.bulletPoints.filter(Boolean).length > 0 && (
                <ul style={{ marginTop: '2px', paddingLeft: '14px', listStyle: 'none' }}>
                  {proj.bulletPoints.filter(Boolean).map((bullet, i) => (
                    <li key={i} style={{ fontSize: '12px', lineHeight: 1.35, color: headingsColor, position: 'relative', marginBottom: '1px' }}>
                      <span style={{ position: 'absolute', left: '-12px', color: titleColor, fontSize: '8px', top: '3px' }}>◆</span>
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
        <div style={{ marginBottom: '8px' }} data-section="true">
          <SectionTitle title="Certifications" />
          {resume.certifications.map((cert) => (
            <div key={cert.id} style={{ marginTop: '2px', marginBottom: '2px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: subheadingsColor }}>{cert.name || 'Certification'}</span>
              {cert.issuer && <span style={{ fontSize: '12px', color: headingsColor }}> – {cert.issuer}</span>}
              {cert.date && <span style={{ fontSize: '11px', fontStyle: 'italic', marginLeft: '6px', color: headingsColor }}>{cert.date}</span>}
            </div>
          ))}
        </div>
      ) : null

    case 'achievements':
      return resume.achievements.length > 0 ? (
        <div style={{ marginBottom: '8px' }} data-section="true">
          <SectionTitle title="Achievements" />
          {resume.achievements.map((ach) => (
            <div key={ach.id} style={{ marginTop: '2px', marginBottom: '2px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: subheadingsColor }}>{ach.title || 'Achievement'}</span>
              {ach.date && <span style={{ fontSize: '11px', fontStyle: 'italic', marginLeft: '6px', color: headingsColor }}>{ach.date}</span>}
              {ach.description && <p style={{ fontSize: '12px', lineHeight: 1.3, margin: '2px 0 0 0', color: headingsColor }}>{ach.description}</p>}
            </div>
          ))}
        </div>
      ) : null

    case 'publications':
      return resume.publications.length > 0 ? (
        <div style={{ marginBottom: '8px' }} data-section="true">
          <SectionTitle title="Publications" />
          {resume.publications.map((pub) => (
            <div key={pub.id} style={{ marginTop: '2px', marginBottom: '2px' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: subheadingsColor }}>{pub.title || 'Publication'}</span>
                {pub.date && <span style={{ fontSize: '11px', fontStyle: 'italic', marginLeft: '6px', color: headingsColor }}>{pub.date}</span>}
              </div>
              {pub.publisher && <span style={{ fontSize: '12px', fontStyle: 'italic', display: 'block', color: headingsColor }}>{pub.publisher}</span>}
              {pub.description && <span style={{ fontSize: '12px', display: 'block', color: headingsColor }}>{pub.description}</span>}
            </div>
          ))}
        </div>
      ) : null

    case 'languages':
      return resume.languages.length > 0 ? (
        <div style={{ marginBottom: '8px' }} data-section="true">
          <SectionTitle title="Languages" />
          <div style={{ fontSize: '12px', lineHeight: 1.4, color: headingsColor }}>
            {resume.languages.map((lang) =>
              `${lang.name || 'Language'}${lang.proficiency ? ` – ${lang.proficiency}` : ''}`
            ).join(' \\\\n')}
          </div>
        </div>
      ) : null

    case 'customSections':
      return resume.customSections.length > 0 ? (
        <>
          {resume.customSections.map((cs) => (
            <div key={cs.id} style={{ marginBottom: '8px' }} data-section="true">
              <SectionTitle title={cs.title || 'Custom Section'} />
              <p style={{ fontSize: '12px', lineHeight: 1.4, marginTop: '2px', whiteSpace: 'pre-wrap', color: subheadingsColor }}>{cs.content}</p>
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
        <div style={{ marginBottom: '8px' }} data-section="true">
          <SectionTitle title="Skills" />
          <div style={{ marginTop: '4px' }}>
            {resume.skills.map((cat) => (
              <div key={cat.id} style={{ marginBottom: '6px' }}>
                <div style={{ fontSize: '15px', fontWeight: 700, textTransform: 'uppercase' as const, lineHeight: 1.3, color: subheadingsColor }}>
                  {cat.name || 'Category'}
                </div>
                <div style={{ fontSize: '13px', lineHeight: 1.4, color: headingsColor, marginTop: '2px' }}>
                  {cat.skills.join(' • ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null

    case 'education':
      return resume.education.length > 0 ? (
        <div style={{ marginBottom: '8px' }} data-section="true">
          <SectionTitle title="Education" />
          {resume.education.map((edu) => (
            <div key={edu.id} style={{ marginTop: '2px', marginBottom: '4px' }}>
              {/* University name */}
              <p style={{ fontSize: '15px', fontWeight: 700, textTransform: 'uppercase' as const, lineHeight: 1.3, margin: 0, color: subheadingsColor }}>
                {edu.institution || 'Institution'}
              </p>
              {/* Degree - small caps */}
              <p style={{ fontSize: '13px', fontVariant: 'small-caps' as const, lineHeight: 1.3, margin: 0, color: subheadingsColor }}>
                {edu.degree || 'Degree'}{edu.specialization ? ` in ${edu.specialization}` : ''}
              </p>
              {/* Date */}
              <p style={{ fontSize: '12px', lineHeight: 1.3, margin: 0, color: headingsColor }}>
                {edu.startDate} – {edu.endDate}
              </p>
              {/* GPA */}
              {edu.cgpa && (
                <p style={{ fontSize: '12px', lineHeight: 1.3, margin: 0, color: headingsColor }}>
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
    <h2 style={{ fontSize: '18px', fontWeight: 700, textTransform: 'uppercase' as const, lineHeight: 1.2, margin: '0 0 4px 0', color: titleColor }}>
      {title}
    </h2>
  )
}

export default {
  config,
  Preview,
  generateLatex: generateTwocolumnLatex,
}
