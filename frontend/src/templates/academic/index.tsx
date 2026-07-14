import type { ResumeData } from '@/types/resume'
import type { ReactNode } from 'react'
import config from './config'
import { generateAcademicLatex } from './latex'
import { ContactIcon } from '../icons'

function Preview({
  resume,
  sections,
}: {
  resume: ResumeData
  sections: { id: string; type: string; label: string }[]
}): ReactNode {
  const { personalInfo } = resume

  return (
    <div style={{ fontFamily: 'Palatino, "Palatino Linotype", Georgia, serif', fontSize: '14px', lineHeight: '1.1' }}>
      {personalInfo.fullName && (
        <header className="text-center border-b border-gray-400 pb-1.5 mb-1.5">
          <h1 className="text-xl font-bold tracking-wide text-black" style={{ fontVariant: 'small-caps' }}>
            {personalInfo.fullName}
          </h1>
          {(personalInfo.professionalTitle || personalInfo.location) && (
            <p className="text-[15px] text-gray-600 italic mt-0">
              {[personalInfo.professionalTitle, personalInfo.location].filter(Boolean).join(' – ')}
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-1 text-[11px] text-gray-600">
            {personalInfo.email && <span className="inline-flex items-center gap-1"><ContactIcon type="email" className="w-3 h-3" />{personalInfo.email}</span>}
            {personalInfo.phone && <span className="inline-flex items-center gap-1">| <ContactIcon type="phone" className="w-3 h-3" />{personalInfo.phone}</span>}
            {personalInfo.linkedin && <span className="inline-flex items-center gap-1">| <ContactIcon type="linkedin" className="w-3 h-3" />{personalInfo.linkedin}</span>}
            {personalInfo.github && <span className="inline-flex items-center gap-1">| <ContactIcon type="github" className="w-3 h-3" />{personalInfo.github}</span>}
            {personalInfo.website && <span className="inline-flex items-center gap-1">| <ContactIcon type="website" className="w-3 h-3" />{personalInfo.website}</span>}
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
        <Section title="Research Interests">
          <p className="text-[13px] leading-snug text-gray-700 italic">{resume.summary}</p>
        </Section>
      ) : null

    case 'experience':
      return resume.experience.length > 0 ? (
        <Section title="Experience">
          {resume.experience.map((exp) => (
            <div key={exp.id} className="mb-1.5 last:mb-0">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-[13px]">{exp.position || 'Position'}</span>
                <span className="text-[11px] text-gray-500 italic">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[13px] text-gray-600 italic">{exp.company || 'Company'}</span>
                {exp.location && (
                  <span className="text-[11px] text-gray-500">{exp.location}</span>
                )}
              </div>
              {exp.bulletPoints.filter(Boolean).length > 0 && (
                <ul className="mt-0 space-y-0">
                  {exp.bulletPoints.filter(Boolean).map((bullet, i) => (
                    <li key={i} className="text-[11px] text-gray-700 pl-2 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400">
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
          <div className="space-y-0">
            {resume.skills.map((cat) => (
              <div key={cat.id} className="text-[11px]">
                <span className="font-bold">{cat.name || 'Category'}: </span>
                <span className="text-gray-700">{cat.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        </Section>
      ) : null

    case 'projects':
      return resume.projects.length > 0 ? (
        <Section title="Research Projects">
          {resume.projects.map((proj) => (
            <div key={proj.id} className="mb-2 last:mb-0">
              <div className="flex justify-between items-baseline">
                <div className="flex items-baseline gap-1 flex-wrap">
                  <span className="font-bold text-[13px]">{proj.name || 'Project'}</span>
                  {proj.role && (
                    <span className="text-[11px] text-gray-600 italic"> — {proj.role}</span>
                  )}
                </div>
                {proj.duration && (
                  <span className="text-[11px] text-gray-500 italic">{proj.duration}</span>
                )}
              </div>
              {proj.description && (
                <p className="text-[11px] text-gray-700 mt-0">{proj.description}</p>
              )}
              {proj.bulletPoints.filter(Boolean).length > 0 && (
                <ul className="mt-0 space-y-0">
                  {proj.bulletPoints.filter(Boolean).map((bullet, i) => (
                    <li key={i} className="text-[11px] text-gray-700 pl-2 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400">
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
              {proj.technologies.length > 0 && (
                <p className="text-[11px] text-gray-500 mt-0 italic">
                  <span className="font-medium not-italic">Technologies:</span> {proj.technologies.join(', ')}
                </p>
              )}
              {(proj.githubUrl || proj.liveDemoUrl) && (
                <p className="text-[11px] text-gray-500 mt-0 italic">
                  {proj.githubUrl && <span>GitHub: {proj.githubUrl}</span>}
                  {proj.githubUrl && proj.liveDemoUrl && <span className="not-italic"> | </span>}
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
            <div key={edu.id} className="mb-1.5 last:mb-0">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-[13px]">
                  {edu.degree || 'Degree'}
                  {edu.specialization ? ` in ${edu.specialization}` : ''}
                </span>
                <span className="text-[11px] text-gray-500 italic">
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[13px] text-gray-600 italic">{edu.institution || 'Institution'}</span>
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
              <span className="text-[13px]">
                <span className="font-bold">{cert.name || 'Certification'}</span>
                {cert.url && (
                  <a href={cert.url} target="_blank" rel="noopener noreferrer" className="ml-1 text-gray-400 hover:text-gray-600">
                    <ContactIcon type="externalLink" className="w-3 h-3 inline" />
                  </a>
                )}
                {cert.issuer && <span className="text-gray-600"> – {cert.issuer}</span>}
              </span>
              <span className="text-[11px] text-gray-500 italic">{cert.date}</span>
            </div>
          ))}
        </Section>
      ) : null

    case 'achievements':
      return resume.achievements.length > 0 ? (
        <Section title="Awards and Honors">
          {resume.achievements.map((ach) => (
            <div key={ach.id} className="mb-1 last:mb-0">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-[13px]">{ach.title || 'Achievement'}</span>
                {ach.date && <span className="text-[11px] text-gray-500 italic">{ach.date}</span>}
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
                <span className="text-[13px] font-bold italic">{pub.title || 'Publication'}</span>
                <span className="text-[11px] text-gray-500">{pub.date}</span>
              </div>
              <span className="text-[11px] text-gray-600">{pub.publisher}
                {pub.url && (
                  <a href={pub.url} target="_blank" rel="noopener noreferrer" className="ml-1 text-gray-400 hover:text-gray-600 not-italic">
                    <ContactIcon type="externalLink" className="w-3 h-3 inline" />
                  </a>
                )}
              </span>
              {pub.description && (
                <p className="text-[11px] text-gray-700 mt-0">{pub.description}</p>
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
              <span key={lang.id} className="text-[11px] text-gray-700">
                <span className="font-bold">{lang.name || 'Language'}</span>
                {lang.proficiency && <span className="text-gray-500"> – {lang.proficiency}</span>}
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
    <div className="mb-1" data-section="true">
      <h2 className="text-[15px] font-bold uppercase tracking-wider pb-0 mb-0 border-b border-gray-400" style={{ fontVariant: 'small-caps' }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

export default {
  config,
  Preview,
  generateLatex: generateAcademicLatex,
}
