import type { ResumeData, TemplateConfig } from '@/types/resume'
import type { ReactNode } from 'react'
import { generateCompactLatex } from './latex'

const config: TemplateConfig = {
  id: 'compact',
  name: 'Compact One Page',
  description: 'Dense, information-packed layout that maximizes space. Perfect for fitting more content on one page.',
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
    <div style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontSize: '9px', lineHeight: '1.3' }}>
      {personalInfo.fullName && (
        <header className="text-center border-b border-gray-300 pb-1 mb-1">
          <h1 className="text-base font-bold text-black">
            {personalInfo.fullName}
            {personalInfo.professionalTitle && (
              <span className="text-gray-500 font-normal italic"> | {personalInfo.professionalTitle}</span>
            )}
          </h1>
          <div className="flex flex-wrap justify-center gap-x-1.5 gap-y-0 mt-0.5 text-[7px] text-gray-500">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>· {personalInfo.phone}</span>}
            {personalInfo.location && <span className="italic">{personalInfo.location}</span>}
            {personalInfo.linkedin && <span>· {personalInfo.linkedin}</span>}
            {personalInfo.github && <span>· {personalInfo.github}</span>}
            {personalInfo.website && <span>· {personalInfo.website}</span>}
          </div>
        </header>
      )}

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
          <p className="text-[8px] leading-relaxed text-gray-700">{resume.summary}</p>
        </Section>
      ) : null

    case 'experience':
      return resume.experience.length > 0 ? (
        <Section title="Experience">
          {resume.experience.map((exp) => (
            <div key={exp.id} className="mb-1 last:mb-0">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-[8px]">{exp.position || 'Position'}</span>
                <span className="text-[7px] text-gray-500">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <div className="text-[7px] text-gray-600 italic">
                {exp.company || 'Company'}{exp.location ? `, ${exp.location}` : ''}
              </div>
              {exp.bulletPoints.filter(Boolean).length > 0 && (
                <ul className="mt-0 space-y-0">
                  {exp.bulletPoints.filter(Boolean).map((bullet, i) => (
                    <li key={i} className="text-[7px] text-gray-700 pl-2 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400">
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
          <div className="space-y-0">
            {resume.skills.map((cat) => (
              <div key={cat.id} className="text-[7px]">
                <span className="font-bold">{cat.name || 'Category'}: </span>
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
            <div key={proj.id} className="mb-1 last:mb-0">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-[8px]">
                  {proj.name || 'Project'}
                  {proj.technologies.length > 0 && (
                    <span className="font-normal text-gray-500 italic"> [{proj.technologies.join(', ')}]</span>
                  )}
                </span>
                {proj.duration && (
                  <span className="text-[7px] text-gray-500">{proj.duration}</span>
                )}
              </div>
              {proj.description && (
                <p className="text-[7px] text-gray-700">{proj.description}</p>
              )}
              {proj.bulletPoints.filter(Boolean).length > 0 && (
                <ul className="mt-0 space-y-0">
                  {proj.bulletPoints.filter(Boolean).map((bullet, i) => (
                    <li key={i} className="text-[7px] text-gray-700 pl-2 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400">
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Section>
      ) : null

    case 'education':
      return resume.education.length > 0 ? (
        <Section title="Education">
          {resume.education.map((edu) => (
            <div key={edu.id} className="mb-0.5 last:mb-0">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-[8px]">
                  {edu.degree || 'Degree'}
                  {edu.specialization ? ` in ${edu.specialization}` : ''}
                </span>
                <span className="text-[7px] text-gray-500">
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[7px] text-gray-600">{edu.institution || 'Institution'}</span>
                {edu.cgpa && <span className="text-[7px] text-gray-500">CGPA: {edu.cgpa}</span>}
              </div>
            </div>
          ))}
        </Section>
      ) : null

    case 'certifications':
      return resume.certifications.length > 0 ? (
        <Section title="Certifications">
          {resume.certifications.map((cert) => (
            <div key={cert.id} className="mb-0 last:mb-0 flex justify-between items-baseline">
              <span className="text-[7px]">
                <span className="font-bold">{cert.name || 'Certification'}</span>
                {cert.issuer && <span className="text-gray-600">, {cert.issuer}</span>}
              </span>
              <span className="text-[7px] text-gray-500">{cert.date}</span>
            </div>
          ))}
        </Section>
      ) : null

    case 'achievements':
      return resume.achievements.length > 0 ? (
        <Section title="Achievements">
          {resume.achievements.map((ach) => (
            <div key={ach.id} className="mb-0 last:mb-0 flex justify-between items-baseline">
              <span className="text-[7px]">
                {ach.title || 'Achievement'}
                {ach.description && <span className="text-gray-600"> -- {ach.description}</span>}
              </span>
              {ach.date && <span className="text-[7px] text-gray-500">{ach.date}</span>}
            </div>
          ))}
        </Section>
      ) : null

    case 'publications':
      return resume.publications.length > 0 ? (
        <Section title="Publications">
          {resume.publications.map((pub) => (
            <div key={pub.id} className="mb-0 last:mb-0 flex justify-between items-baseline">
              <span className="text-[7px] italic">{pub.title || 'Publication'} -- {pub.publisher}</span>
              <span className="text-[7px] text-gray-500">{pub.date}</span>
            </div>
          ))}
        </Section>
      ) : null

    case 'languages':
      return resume.languages.length > 0 ? (
        <Section title="Languages">
          <p className="text-[7px] text-gray-700">
            {resume.languages.map((lang, i) => (
              <span key={lang.id}>
                {lang.name || 'Language'}: {lang.proficiency}
                {i < resume.languages.length - 1 && <span>, </span>}
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
              <p className="text-[7px] text-gray-700 whitespace-pre-wrap">{cs.content}</p>
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
    <div className="mb-1">
      <h2 className="text-[8px] font-bold uppercase tracking-wider border-b border-gray-300 pb-0 mb-0.5">
        {title}
      </h2>
      {children}
    </div>
  )
}

export default {
  config,
  Preview,
  generateLatex: generateCompactLatex,
}
