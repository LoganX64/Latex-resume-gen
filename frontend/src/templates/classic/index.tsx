import type { ResumeData } from '@/types/resume'
import type { ReactNode } from 'react'
import { formatDate } from '@/lib/utils'
import config from './config'
import { generateClassicLatex } from './latex'
import { ContactIcon } from '../icons'

function fmtDateRange(start: string, end: string, current: boolean): string {
  const s = formatDate(start)
  const e = current ? 'Present' : formatDate(end)
  if (!s) return ''
  return `${s} – ${e}`
}

function Preview({
  resume,
  sections,
}: {
  resume: ResumeData
  sections: { id: string; type: string; label: string }[]
}): ReactNode {
  const { personalInfo } = resume

  return (
    <div style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '14px', lineHeight: '1.15' }}>
      {/* Header */}
      {personalInfo.fullName && (
        <header className="text-center border-b border-gray-300 pb-[2px] mb-[2px]">
          <h1 className="text-[19px] font-bold tracking-wide text-gray-900">
            {personalInfo.fullName}
          </h1>
          {personalInfo.professionalTitle && (
            <p className="text-[16px] text-gray-900 italic mt-0">{personalInfo.professionalTitle}</p>
          )}
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-0 mt-1 text-[11px] text-gray-900">
            {personalInfo.email && <span className="inline-flex items-center gap-1"><ContactIcon type="email" className="w-3 h-3" />{personalInfo.email}</span>}
            {personalInfo.phone && <span className="inline-flex items-center gap-1"><ContactIcon type="phone" className="w-3 h-3" />{personalInfo.phone}</span>}
            {personalInfo.location && <span className="italic inline-flex items-center gap-1"><ContactIcon type="location" className="w-3 h-3" />{personalInfo.location}</span>}
            {personalInfo.linkedin && <span className="text-blue-700 inline-flex items-center gap-1"><ContactIcon type="linkedin" className="w-3 h-3" />{personalInfo.linkedin}</span>}
            {personalInfo.github && <span className="text-blue-700 inline-flex items-center gap-1"><ContactIcon type="github" className="w-3 h-3" />{personalInfo.github}</span>}
            {personalInfo.website && <span className="text-blue-700 inline-flex items-center gap-1"><ContactIcon type="website" className="w-3 h-3" />{personalInfo.website}</span>}
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
  resume: ResumeData
}) {
  switch (section.type) {
    case 'summary':
      return resume.summary ? (
        <Section title="Professional Summary">
          <p className="text-[11px] text-gray-900">{resume.summary}</p>
        </Section>
      ) : null

    case 'experience':
      return resume.experience.length > 0 ? (
        <Section title="Work Experience">
          {resume.experience.map((exp) => (
            <div key={exp.id} className="mb-[2px] last:mb-0">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-[11px]">{exp.position || 'Position'}</span>
                <span className="text-[11px] text-gray-800">
                  {fmtDateRange(exp.startDate, exp.endDate, exp.current)}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[11px] text-gray-900 italic">{exp.company || 'Company'}</span>
                {exp.location && (
                  <span className="text-[11px] text-gray-800">{exp.location}</span>
                )}
              </div>
              {exp.bulletPoints.filter(Boolean).length > 0 && (
                <ul className="mt-0 space-y-0">
                  {exp.bulletPoints.filter(Boolean).map((bullet, i) => (
                    <li key={i} className="text-[11px] text-gray-900 pl-2 relative before:content-['•'] before:absolute before:left-0 before:text-gray-600">
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
            <div key={cat.id} className="mb-[2px] last:mb-0">
              <span className="font-semibold text-[11px]">{cat.name || 'Category'}: </span>
              <span className="text-[11px] text-gray-900">{cat.skills.join(', ')}</span>
            </div>
          ))}
        </Section>
      ) : null

    case 'projects':
      return resume.projects.length > 0 ? (
        <Section title="Projects">
          {resume.projects.map((proj) => (
            <div key={proj.id} className="mb-[2px] last:mb-0">
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="font-semibold text-[11px]">{proj.name || 'Project'}</span>
                  {proj.role && (
                    <span className="text-[11px] text-gray-900 italic"> – {proj.role}</span>
                  )}
                </div>
                {proj.duration && (
                  <span className="text-[11px] text-gray-800">{proj.duration}</span>
                )}
              </div>
              {proj.description && (
                <p className="text-[11px] text-gray-900 mt-0">{proj.description}</p>
              )}
              {proj.bulletPoints.filter(Boolean).length > 0 && (
                <ul className="mt-0 space-y-0">
                  {proj.bulletPoints.filter(Boolean).map((bullet, i) => (
                    <li key={i} className="text-[11px] text-gray-900 pl-2 relative before:content-['•'] before:absolute before:left-0 before:text-gray-600">
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
              {proj.technologies.length > 0 && (
                <p className="text-[11px] text-gray-800 mt-[1px]">
                  <span className="font-bold">Tech:</span> {proj.technologies.join(', ')}
                </p>
              )}
              {(proj.githubUrl || proj.liveDemoUrl) && (
                <p className="text-[11px] text-gray-800 mt-[1px]">
                  {proj.githubUrl && <span><span className="font-bold">GitHub:</span> <span className="text-blue-700">{proj.githubUrl}</span></span>}
                  {proj.githubUrl && proj.liveDemoUrl && <span> | </span>}
                  {proj.liveDemoUrl && <span><span className="font-bold">Demo:</span> <span className="text-blue-700">{proj.liveDemoUrl}</span></span>}
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
            <div key={edu.id} className="mb-[2px] last:mb-0">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-[11px]">
                  {edu.degree || 'Degree'}
                  {edu.specialization ? ` in ${edu.specialization}` : ''}
                </span>
                <span className="text-[11px] text-gray-800">
                  {fmtDateRange(edu.startDate, edu.endDate, false)}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[11px] text-gray-900 italic">{edu.institution || 'Institution'}</span>
                {edu.cgpa && <span className="text-[11px] text-gray-800">CGPA: {edu.cgpa}</span>}
              </div>
            </div>
          ))}
        </Section>
      ) : null

    case 'certifications':
      return resume.certifications.length > 0 ? (
        <Section title="Certifications">
          {resume.certifications.map((cert) => (
            <div key={cert.id} className="mb-[2px] last:mb-0 flex justify-between items-baseline">
              <span className="text-[11px]">
                <span className="font-semibold">{cert.name || 'Certification'}</span>
                {cert.url && (
                  <a href={cert.url} target="_blank" rel="noopener noreferrer" className="ml-1 text-gray-500 hover:text-gray-700">
                    <ContactIcon type="externalLink" className="w-3 h-3 inline" />
                  </a>
                )}
                {cert.issuer && <span className="text-gray-900"> – {cert.issuer}</span>}
              </span>
              <span className="text-[11px] text-gray-800">{cert.date}</span>
            </div>
          ))}
        </Section>
      ) : null

    case 'achievements':
      return resume.achievements.length > 0 ? (
        <Section title="Achievements">
          {resume.achievements.map((ach) => (
            <div key={ach.id} className="mb-[2px] last:mb-0">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-[11px]">{ach.title || 'Achievement'}</span>
                {ach.date && <span className="text-[11px] text-gray-800">{ach.date}</span>}
              </div>
              {ach.description && (
                <p className="text-[11px] text-gray-900">{ach.description}</p>
              )}
            </div>
          ))}
        </Section>
      ) : null

    case 'publications':
      return resume.publications.length > 0 ? (
        <Section title="Publications">
          {resume.publications.map((pub) => (
            <div key={pub.id} className="mb-[2px] last:mb-0">
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="font-semibold text-[11px]">{pub.title || 'Publication'}</span>
                  {pub.url && (
                    <a href={pub.url} target="_blank" rel="noopener noreferrer" className="ml-1 text-gray-500 hover:text-gray-700">
                      <ContactIcon type="externalLink" className="w-3 h-3 inline" />
                    </a>
                  )}
                  {pub.publisher && (
                    <span className="text-[11px] text-gray-900 italic"> — {pub.publisher}</span>
                  )}
                </div>
                <span className="text-[11px] text-gray-800">{pub.date}</span>
              </div>
              {pub.description && (
                <p className="text-[11px] text-gray-900">{pub.description}</p>
              )}
            </div>
          ))}
        </Section>
      ) : null

    case 'languages':
      return resume.languages.length > 0 ? (
        <Section title="Languages">
          <div className="text-[11px] text-gray-900">
            {resume.languages.map((lang, i) => (
              <span key={lang.id}>
                {i > 0 && ', '}
                <span className="font-bold">{lang.name || 'Language'}</span>
                {lang.proficiency && ` (${lang.proficiency})`}
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
              <p className="text-[11px] text-gray-900 whitespace-pre-wrap">{cs.content}</p>
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
    <div className="mb-[3px]" data-section="true">
      <h2 className="text-[16px] font-bold uppercase tracking-wider text-gray-900 border-b border-gray-300 pb-[3px] mb-[1px]">
        {title}
      </h2>
      {children}
    </div>
  )
}

export default {
  config,
  Preview,
  generateLatex: generateClassicLatex,
}
