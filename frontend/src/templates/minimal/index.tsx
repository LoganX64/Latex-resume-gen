import type { ResumeData, TemplateConfig } from '@/types/resume'
import type { ReactNode } from 'react'
import { generateMinimalLatex } from './latex'

const config: TemplateConfig = {
  id: 'minimal',
  name: 'Minimal ATS',
  description: 'Ultra-clean, keyword-optimized layout. Maximum ATS compatibility with minimal formatting.',
  supportsPhoto: false,
  category: 'minimal',
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
    <div style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontSize: '10px', lineHeight: '1.35' }}>
      {/* Header */}
      {personalInfo.fullName && (
        <header className="text-center pb-1.5 mb-1.5">
          <h1 className="text-base font-bold text-black tracking-tight">
            {personalInfo.fullName}
          </h1>
          {personalInfo.professionalTitle && (
            <p className="text-[9px] text-gray-500 italic mt-0.5">{personalInfo.professionalTitle}</p>
          )}
          <div className="flex flex-wrap justify-center gap-x-2 gap-y-0 mt-1 text-[8px] text-gray-600">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span> | {personalInfo.phone}</span>}
            {personalInfo.location && <span> | {personalInfo.location}</span>}
            {personalInfo.linkedin && <span> | {personalInfo.linkedin}</span>}
            {personalInfo.github && <span> | {personalInfo.github}</span>}
            {personalInfo.website && <span> | {personalInfo.website}</span>}
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
        <Section title="Summary">
          <p className="text-[9px] leading-relaxed text-gray-700">{resume.summary}</p>
        </Section>
      ) : null

    case 'experience':
      return resume.experience.length > 0 ? (
        <Section title="Experience">
          {resume.experience.map((exp) => (
            <div key={exp.id} className="mb-1.5 last:mb-0">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-[9px]">{exp.position || 'Position'}</span>
                <span className="text-[8px] text-gray-500">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <div className="text-[8px] text-gray-600">
                {exp.company || 'Company'}{exp.location ? ` | ${exp.location}` : ''}
              </div>
              {exp.bulletPoints.filter(Boolean).length > 0 && (
                <ul className="mt-0.5 space-y-0">
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
        <Section title="Skills">
          <div className="space-y-0.5">
            {resume.skills.map((cat) => (
              <div key={cat.id}>
                <span className="font-bold text-[8px]">{cat.name || 'Category'}: </span>
                <span className="text-[8px] text-gray-700">{cat.skills.join(', ')}</span>
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
                <span className="font-bold text-[9px]">{proj.name || 'Project'}</span>
                {proj.duration && (
                  <span className="text-[8px] text-gray-500">{proj.duration}</span>
                )}
              </div>
              {proj.description && (
                <p className="text-[8px] text-gray-700">{proj.description}</p>
              )}
              {proj.bulletPoints.filter(Boolean).length > 0 && (
                <ul className="mt-0 space-y-0">
                  {proj.bulletPoints.filter(Boolean).map((bullet, i) => (
                    <li key={i} className="text-[8px] text-gray-700 pl-2 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400">
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
              {proj.technologies.length > 0 && (
                <p className="text-[8px] text-gray-500">
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
            <div key={edu.id} className="mb-1 last:mb-0">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-[9px]">
                  {edu.degree || 'Degree'}
                  {edu.specialization ? ` in ${edu.specialization}` : ''}
                </span>
                <span className="text-[8px] text-gray-500">
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[8px] text-gray-600">{edu.institution || 'Institution'}</span>
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
            <div key={cert.id} className="mb-0.5 last:mb-0 flex justify-between items-baseline">
              <span className="text-[8px]">
                <span className="font-bold">{cert.name || 'Certification'}</span>
                {cert.issuer && <span className="text-gray-600"> – {cert.issuer}</span>}
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
            <div key={ach.id} className="mb-0.5 last:mb-0">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-[8px]">{ach.title || 'Achievement'}</span>
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
            <div key={pub.id} className="mb-0.5 last:mb-0">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-[8px]">{pub.title || 'Publication'}</span>
                <span className="text-[8px] text-gray-500">{pub.date}</span>
              </div>
              <span className="text-[8px] text-gray-600 italic">{pub.publisher}</span>
            </div>
          ))}
        </Section>
      ) : null

    case 'languages':
      return resume.languages.length > 0 ? (
        <Section title="Languages">
          <p className="text-[8px] text-gray-700">
            {resume.languages.map((lang) => (
              <span key={lang.id}>
                <span className="font-medium">{lang.name || 'Language'}</span>
                {lang.proficiency && <span className="text-gray-500"> ({lang.proficiency})</span>}
                {lang.id !== resume.languages[resume.languages.length - 1].id && <span>, </span>}
              </span>
            ))}
          </p>
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

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-1.5">
      <h2 className="text-[9px] font-bold uppercase tracking-wider text-black border-b border-gray-400 pb-0.5 mb-1">
        {title}
      </h2>
      {children}
    </div>
  )
}

export default {
  config,
  Preview,
  generateLatex: generateMinimalLatex,
}
