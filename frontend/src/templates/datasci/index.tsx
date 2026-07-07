import type { ResumeData } from '@/types/resume'
import type { ReactNode } from 'react'
import { datasciConfig as config } from './config'
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
      <header className="relative pb-2 mb-2" style={{ borderBottom: `2px solid ${highlight}` }}>
        <div className="flex">
          {/* Left column - Phone, City, Email */}
          <div className="w-[120px] shrink-0 text-[10px] text-gray-600 leading-tight">
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.location && <div>{personalInfo.location}</div>}
            {personalInfo.email && (
              <div><a href={`mailto:${personalInfo.email}`} className="underline" style={{ color: highlight }}>{personalInfo.email}</a></div>
            )}
          </div>

          {/* Center column - Name, Role */}
          <div className="flex-1 text-center">
            <h1 className="text-[22px] font-bold text-gray-900" style={{ letterSpacing: '0.5px' }}>
              {personalInfo.fullName || 'Your Name'}
            </h1>
            {personalInfo.professionalTitle && (
              <p className="text-[14px] mt-0" style={{ color: highlight }}>{personalInfo.professionalTitle}</p>
            )}
          </div>

          {/* Right column - Portfolio, GitHub, LinkedIn */}
          <div className="w-[150px] shrink-0 text-[10px] text-gray-600 leading-tight text-right">
            {personalInfo.website && (
              <div>Portfolio: <a href={`https://${personalInfo.website}`} className="underline" style={{ color: highlight }}>{personalInfo.website}</a></div>
            )}
            {personalInfo.github && (
              <div><a href={`https://${personalInfo.github}`} className="underline" style={{ color: highlight }}>github.com/{personalInfo.github}</a></div>
            )}
            {personalInfo.linkedin && (
              <div><a href={`https://${personalInfo.linkedin}`} className="underline" style={{ color: highlight }}>linkedin.com/in/{personalInfo.linkedin}</a></div>
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
          <p className="text-[11px] text-gray-700">{resume.summary}</p>
        </Section>
      ) : null

    case 'experience':
      return resume.experience.length > 0 ? (
        <Section title="Technical Experience">
          {resume.experience.map((exp) => (
            <div key={exp.id} className="mb-1.5 last:mb-0">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-[12px]">{exp.position || 'Position'}</span>
                <span className="text-[11px] text-gray-500">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[12px] text-gray-600 italic">{exp.company || 'Company'}</span>
                {exp.location && (
                  <span className="text-[11px] text-gray-500">{exp.location}</span>
                )}
              </div>
              {exp.bulletPoints.filter(Boolean).length > 0 && (
                <ul className="mt-0.5 space-y-0">
                  {exp.bulletPoints.filter(Boolean).map((bullet, i) => (
                    <li key={i} className="text-[11px] text-gray-700 pl-2 relative before:content-['•'] before:absolute before:left-0" style={{ color: highlight }}>
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
          <div className="space-y-0.5">
            {resume.skills.map((cat) => (
              <div key={cat.id} className="text-[11px]">
                <span className="font-semibold">{cat.name || 'Category'}: </span>
                <span className="text-gray-700">{cat.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        </Section>
      ) : null

    case 'projects':
      return resume.projects.length > 0 ? (
        <Section title="Projects">
          {resume.projects.map((proj) => (
            <div key={proj.id} className="mb-1.5 last:mb-0">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-[12px]">{proj.name || 'Project'}</span>
                {proj.duration && (
                  <span className="text-[11px] text-gray-500">{proj.duration}</span>
                )}
              </div>
              {proj.role && (
                <span className="text-[11px] text-gray-600 italic">{proj.role}</span>
              )}
              {proj.description && (
                <p className="text-[11px] text-gray-700 mt-0">{proj.description}</p>
              )}
              {proj.bulletPoints.filter(Boolean).length > 0 && (
                <ul className="mt-0.5 space-y-0">
                  {proj.bulletPoints.filter(Boolean).map((bullet, i) => (
                    <li key={i} className="text-[11px] text-gray-700 pl-2 relative before:content-['•'] before:absolute before:left-0" style={{ color: highlight }}>
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
              {proj.technologies.length > 0 && (
                <p className="text-[11px] text-gray-500 mt-0">
                  <span className="font-medium">Tech:</span> {proj.technologies.join(', ')}
                </p>
              )}
              {(proj.githubUrl || proj.liveDemoUrl) && (
                <p className="text-[11px] text-gray-500 mt-0">
                  {proj.githubUrl && <span>GitHub: {proj.githubUrl}</span>}
                  {proj.githubUrl && proj.liveDemoUrl && <span> | </span>}
                  {proj.liveDemoUrl && <span>Demo: {proj.liveDemoUrl}</span>}
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
            <div key={edu.id} className="mb-1 last:mb-0">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-[12px]">
                  {edu.degree || 'Degree'}
                  {edu.specialization ? ` in ${edu.specialization}` : ''}
                </span>
                <span className="text-[11px] text-gray-500">
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[12px] text-gray-600 italic">{edu.institution || 'Institution'}</span>
                {edu.cgpa && <span className="text-[11px] text-gray-500">CGPA: {edu.cgpa}</span>}
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
              <span className="text-[11px]">
                <span className="font-semibold">{cert.name || 'Certification'}</span>
                {cert.issuer && <span className="text-gray-600"> – {cert.issuer}</span>}
              </span>
              <span className="text-[10px] text-gray-500">{cert.date}</span>
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
                <span className="font-semibold text-[11px]">{ach.title || 'Achievement'}</span>
                {ach.date && <span className="text-[10px] text-gray-500">{ach.date}</span>}
              </div>
              {ach.description && (
                <p className="text-[11px] text-gray-700">{ach.description}</p>
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
                <span className="font-semibold text-[11px]">{pub.title || 'Publication'}</span>
                <span className="text-[10px] text-gray-500">{pub.date}</span>
              </div>
              <span className="text-[11px] text-gray-600 italic">{pub.publisher}</span>
            </div>
          ))}
        </Section>
      ) : null

    case 'languages':
      return resume.languages.length > 0 ? (
        <Section title="Activities">
          <div className="flex flex-wrap gap-x-2 gap-y-0.5">
            {resume.languages.map((lang) => (
              <span key={lang.id} className="text-[11px] text-gray-700">
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
              <p className="text-[11px] text-gray-700 whitespace-pre-wrap">{cs.content}</p>
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
    <div className="mb-1.5">
      <h2
        className="text-[13px] font-bold uppercase tracking-wider pb-0 mb-0.5"
        style={{ color: highlight, fontVariant: 'small-caps' }}
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
