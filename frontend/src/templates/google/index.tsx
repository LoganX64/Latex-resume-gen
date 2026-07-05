import type { ResumeData } from '@/types/resume'
import type { ReactNode } from 'react'
import { googleConfig as config } from './config'
import { generateGoogleLatex } from './latex'

function Preview({
  resume,
  sections,
}: {
  resume: ResumeData
  sections: { id: string; type: string; label: string }[]
}): ReactNode {
  const { personalInfo } = resume

  return (
    <div style={{ fontFamily: '"Roboto", "Helvetica Neue", Arial, sans-serif', fontSize: '14px', lineHeight: '1.25' }}>
      {personalInfo.fullName && (
        <header className="text-center border-b-2 pb-1.5 mb-1.5" style={{ borderColor: '#1a73e8' }}>
          <h1 className="text-xl font-bold text-black">{personalInfo.fullName}</h1>
          {personalInfo.professionalTitle && (
            <p className="text-[15px] text-gray-600 italic mt-0">{personalInfo.professionalTitle}</p>
          )}
          <div className="flex flex-wrap justify-center gap-x-2 gap-y-0.5 mt-1 text-[12px] text-gray-600">
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
          <p className="text-[14px] leading-relaxed text-gray-700">{resume.summary}</p>
        </Section>
      ) : null

    case 'experience':
      return resume.experience.length > 0 ? (
        <Section title="Experience">
          {resume.experience.map((exp) => (
            <div key={exp.id} className="mb-2 last:mb-0">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-[14px]">{exp.position || 'Position'}</span>
                <span className="text-[12px] text-gray-500">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[14px] text-gray-600 italic">{exp.company || 'Company'}</span>
                {exp.location && (
                  <span className="text-[12px] text-gray-500">{exp.location}</span>
                )}
              </div>
              {exp.bulletPoints.filter(Boolean).length > 0 && (
                <ul className="mt-0 space-y-0">
                  {exp.bulletPoints.filter(Boolean).map((bullet, i) => (
                    <li key={i} className="text-[12px] text-gray-700 pl-2 relative before:content-['•'] before:absolute before:left-0" style={{ color: '#1a73e8' }}>
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
              <div key={cat.id} className="text-[12px]">
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
            <div key={proj.id} className="mb-2 last:mb-0">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-[14px]">{proj.name || 'Project'}</span>
                {proj.duration && (
                  <span className="text-[12px] text-gray-500">{proj.duration}</span>
                )}
              </div>
              {proj.role && (
                <span className="text-[12px] text-gray-600 italic">{proj.role}</span>
              )}
              {proj.description && (
                <p className="text-[12px] text-gray-700 mt-0">{proj.description}</p>
              )}
              {proj.bulletPoints.filter(Boolean).length > 0 && (
                <ul className="mt-0 space-y-0">
                  {proj.bulletPoints.filter(Boolean).map((bullet, i) => (
                    <li key={i} className="text-[12px] text-gray-700 pl-2 relative before:content-['•'] before:absolute before:left-0" style={{ color: '#1a73e8' }}>
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
              {proj.technologies.length > 0 && (
                <p className="text-[12px] text-gray-500 mt-0">
                  <span className="font-medium">Tech:</span> {proj.technologies.join(', ')}
                </p>
              )}
              {(proj.githubUrl || proj.liveDemoUrl) && (
                <p className="text-[12px] text-gray-500 mt-0">
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
            <div key={edu.id} className="mb-1.5 last:mb-0">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-[14px]">
                  {edu.degree || 'Degree'}
                  {edu.specialization ? ` in ${edu.specialization}` : ''}
                </span>
                <span className="text-[12px] text-gray-500">
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[14px] text-gray-600 italic">{edu.institution || 'Institution'}</span>
                {edu.cgpa && <span className="text-[12px] text-gray-500">CGPA: {edu.cgpa}</span>}
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
              <span className="text-[14px]">
                <span className="font-semibold">{cert.name || 'Certification'}</span>
                {cert.issuer && <span className="text-gray-600"> – {cert.issuer}</span>}
              </span>
              <span className="text-[12px] text-gray-500">{cert.date}</span>
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
                <span className="font-semibold text-[14px]">{ach.title || 'Achievement'}</span>
                {ach.date && <span className="text-[12px] text-gray-500">{ach.date}</span>}
              </div>
              {ach.description && (
                <p className="text-[12px] text-gray-700">{ach.description}</p>
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
                <span className="font-semibold text-[14px]">{pub.title || 'Publication'}</span>
                <span className="text-[12px] text-gray-500">{pub.date}</span>
              </div>
              <span className="text-[12px] text-gray-600 italic">{pub.publisher}</span>
            </div>
          ))}
        </Section>
      ) : null

    case 'languages':
      return resume.languages.length > 0 ? (
        <Section title="Languages">
          <p className="text-[12px] text-gray-700">
            {resume.languages.map((lang, i) => (
              <span key={lang.id}>
                <span className="font-medium">{lang.name || 'Language'}</span>
                {lang.proficiency && <span className="text-gray-500"> ({lang.proficiency})</span>}
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
              <p className="text-[12px] text-gray-700 whitespace-pre-wrap">{cs.content}</p>
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
      <h2 className="text-[15px] font-bold uppercase tracking-wider pb-0 mb-0.5" style={{ color: '#1a73e8', borderBottom: '2px solid #1a73e8' }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

export default {
  config,
  Preview,
  generateLatex: generateGoogleLatex,
}
