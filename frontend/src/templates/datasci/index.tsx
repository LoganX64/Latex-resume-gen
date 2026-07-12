import type { ResumeData } from '@/types/resume'
import type { ReactNode } from 'react'
import config from './config'
import { generateDatasciLatex } from './latex'

const highlight = '#3d5a80'

function Preview({
  resume,
  sections,
}: {
  resume: ResumeData
  sections: { id: string; type: string; label: string }[]
}): ReactNode {
  const { personalInfo } = resume

  return (
    <div style={{ fontFamily: '"Source Sans Pro", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', fontSize: '14px', lineHeight: '1.3' }}>
      {/* 3-column header */}
      <header style={{ position: 'relative', paddingBottom: '8px', marginBottom: '8px', borderBottom: `2px solid ${highlight}` }}>
        <div style={{ display: 'flex' }}>
          {/* Left column - Phone, City, Email */}
          <div style={{ width: '120px', flexShrink: 0, fontSize: '10px', color: '#4b5563', lineHeight: '1.3' }}>
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.location && <div>{personalInfo.location}</div>}
            {personalInfo.email && (
              <div><a href={`mailto:${personalInfo.email}`} style={{ textDecoration: 'underline', color: highlight }}>{personalInfo.email}</a></div>
            )}
          </div>

          {/* Center column - Name, Role */}
          <div style={{ flex: 1, textAlign: 'center' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', letterSpacing: '0.5px', margin: 0 }}>
              {personalInfo.fullName || 'Your Name'}
            </h1>
            {personalInfo.professionalTitle && (
              <p style={{ fontSize: '14px', marginTop: 0, marginBottom: 0, color: highlight }}>{personalInfo.professionalTitle}</p>
            )}
          </div>

          {/* Right column - Portfolio, GitHub, LinkedIn */}
          <div style={{ width: '150px', flexShrink: 0, fontSize: '10px', color: '#4b5563', lineHeight: '1.3', textAlign: 'right' }}>
            {personalInfo.website && (
              <div>Portfolio: <a href={`https://${personalInfo.website}`} style={{ textDecoration: 'underline', color: highlight }}>{personalInfo.website}</a></div>
            )}
            {personalInfo.github && (
              <div><a href={`https://${personalInfo.github}`} style={{ textDecoration: 'underline', color: highlight }}>github.com/{personalInfo.github}</a></div>
            )}
            {personalInfo.linkedin && (
              <div><a href={`https://${personalInfo.linkedin}`} style={{ textDecoration: 'underline', color: highlight }}>linkedin.com/in/{personalInfo.linkedin}</a></div>
            )}
          </div>
        </div>
      </header>

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
  resume: ResumeData
}) {
  switch (section.type) {
    case 'summary':
      return resume.summary ? (
        <Section title="Objective">
          <p style={{ fontSize: '11px', color: '#374151', margin: 0 }}>{resume.summary}</p>
        </Section>
      ) : null

    case 'experience':
      return resume.experience.length > 0 ? (
        <Section title="Technical Experience">
          {resume.experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 600, fontSize: '12px' }}>{exp.position || 'Position'}</span>
                <span style={{ fontSize: '11px', color: '#6b7280' }}>
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '12px', color: '#4b5563', fontStyle: 'italic' }}>{exp.company || 'Company'}</span>
                {exp.location && (
                  <span style={{ fontSize: '11px', color: '#6b7280' }}>{exp.location}</span>
                )}
              </div>
              {exp.bulletPoints.filter(Boolean).length > 0 && (
                <ul style={{ marginTop: '2px', paddingLeft: 0, listStyle: 'none' }}>
                  {exp.bulletPoints.filter(Boolean).map((bullet, i) => (
                    <li key={i} style={{ fontSize: '11px', color: '#374151', paddingLeft: '8px', position: 'relative', marginBottom: 0 }}>
                      <span style={{ position: 'absolute', left: 0, color: highlight }}>•</span>
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
        <Section title="Skills">
          <div>
            {resume.skills.map((cat) => (
              <div key={cat.id} style={{ fontSize: '11px', marginBottom: '2px' }}>
                <span style={{ fontWeight: 600 }}>{cat.name || 'Category'}: </span>
                <span style={{ color: '#374151' }}>{cat.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        </Section>
      ) : null

    case 'projects':
      return resume.projects.length > 0 ? (
        <Section title="Projects">
          {resume.projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 600, fontSize: '12px' }}>{proj.name || 'Project'}</span>
                {proj.duration && (
                  <span style={{ fontSize: '11px', color: '#6b7280' }}>{proj.duration}</span>
                )}
              </div>
              {proj.role && (
                <span style={{ fontSize: '11px', color: '#4b5563', fontStyle: 'italic' }}>{proj.role}</span>
              )}
              {proj.description && (
                <p style={{ fontSize: '11px', color: '#374151', marginTop: 0, marginBottom: 0 }}>{proj.description}</p>
              )}
              {proj.bulletPoints.filter(Boolean).length > 0 && (
                <ul style={{ marginTop: '2px', paddingLeft: 0, listStyle: 'none' }}>
                  {proj.bulletPoints.filter(Boolean).map((bullet, i) => (
                    <li key={i} style={{ fontSize: '11px', color: '#374151', paddingLeft: '8px', position: 'relative', marginBottom: 0 }}>
                      <span style={{ position: 'absolute', left: 0, color: highlight }}>•</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
              {proj.technologies.length > 0 && (
                <p style={{ fontSize: '11px', color: '#6b7280', marginTop: 0, marginBottom: 0 }}>
                  <span style={{ fontWeight: 500 }}>Tech:</span> {proj.technologies.join(', ')}
                </p>
              )}
              {(proj.githubUrl || proj.liveDemoUrl) && (
                <p style={{ fontSize: '11px', color: '#6b7280', marginTop: 0, marginBottom: 0 }}>
                  {proj.githubUrl && <span><span style={{ fontWeight: 500 }}>GitHub:</span> {proj.githubUrl}</span>}
                  {proj.githubUrl && proj.liveDemoUrl && <span> </span>}
                  {proj.liveDemoUrl && <span><span style={{ fontWeight: 500 }}>Live:</span> {proj.liveDemoUrl}</span>}
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
            <div key={edu.id} style={{ marginBottom: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 600, fontSize: '12px' }}>
                  {edu.degree || 'Degree'}
                  {edu.specialization ? ` in ${edu.specialization}` : ''}
                </span>
                <span style={{ fontSize: '11px', color: '#6b7280' }}>
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '12px', color: '#4b5563', fontStyle: 'italic' }}>{edu.institution || 'Institution'}</span>
                {edu.cgpa && <span style={{ fontSize: '11px', color: '#6b7280' }}>CGPA: {edu.cgpa}</span>}
              </div>
            </div>
          ))}
        </Section>
      ) : null

    case 'certifications':
      return resume.certifications.length > 0 ? (
        <Section title="Certifications">
          {resume.certifications.map((cert) => (
            <div key={cert.id} style={{ marginBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '11px' }}>
                <span style={{ fontWeight: 600 }}>{cert.name || 'Certification'}</span>
                {cert.issuer && <span style={{ color: '#4b5563' }}> – {cert.issuer}</span>}
              </span>
              <span style={{ fontSize: '10px', color: '#6b7280' }}>{cert.date}</span>
            </div>
          ))}
        </Section>
      ) : null

    case 'achievements':
      return resume.achievements.length > 0 ? (
        <Section title="Achievements">
          {resume.achievements.map((ach) => (
            <div key={ach.id} style={{ marginBottom: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 600, fontSize: '11px' }}>{ach.title || 'Achievement'}</span>
                {ach.date && <span style={{ fontSize: '10px', color: '#6b7280' }}>{ach.date}</span>}
              </div>
              {ach.description && (
                <p style={{ fontSize: '11px', color: '#374151', margin: 0 }}>{ach.description}</p>
              )}
            </div>
          ))}
        </Section>
      ) : null

    case 'publications':
      return resume.publications.length > 0 ? (
        <Section title="Publications">
          {resume.publications.map((pub) => (
            <div key={pub.id} style={{ marginBottom: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '11px' }}>
                  <span style={{ fontWeight: 600 }}>{pub.title || 'Publication'}</span>
                  {pub.publisher && <span style={{ color: '#4b5563' }}> - {pub.publisher}</span>}
                </span>
                <span style={{ fontSize: '10px', color: '#6b7280' }}>{pub.date}</span>
              </div>
              {pub.description && <p style={{ fontSize: '11px', color: '#374151', marginTop: 0, marginBottom: 0 }}>{pub.description}</p>}
            </div>
          ))}
        </Section>
      ) : null

    case 'languages':
      return resume.languages.length > 0 ? (
        <Section title="Activities">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 8px' }}>
            {resume.languages.map((lang) => (
              <span key={lang.id} style={{ fontSize: '11px', color: '#374151' }}>
                {lang.name || 'Language'}{lang.proficiency ? ` (${lang.proficiency})` : ''}
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
              <p style={{ fontSize: '11px', color: '#374151', whiteSpace: 'pre-wrap', margin: 0 }}>{cs.content}</p>
            </Section>
          ))}
        </>
      ) : null

    default:
      return null
  }
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: '6px' }} data-section="true">
      <h2
        style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', paddingBottom: 0, marginBottom: '2px', color: highlight, fontVariant: 'small-caps' }}
      >
        {title}
      </h2>
      <div style={{ borderBottom: `1px solid ${highlight}`, marginBottom: '4px' }} />
      {children}
    </div>
  )
}

export default {
  config,
  Preview,
  generateLatex: generateDatasciLatex,
}
