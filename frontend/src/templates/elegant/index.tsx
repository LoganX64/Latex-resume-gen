import type { ResumeData, TemplateConfig } from '@/types/resume'
import type { ReactNode } from 'react'
import { generateElegantLatex } from './latex'

const config: TemplateConfig = {
  id: 'elegant',
  name: 'Elegant Professional',
  description: 'Refined, elegant design with subtle styling. Perfect balance of professionalism and visual appeal.',
  supportsPhoto: true,
  category: 'classic',
  margins: { top: 7.62, bottom: 7.62, left: 7.62, right: 7.62 },
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
    <div style={{ fontFamily: 'Garamond, "EB Garamond", Georgia, serif', fontSize: '13px', lineHeight: '1.25' }}>
      {personalInfo.fullName && (
        <header className="text-center pb-1.5 mb-1.5" style={{ borderBottom: '0.5px solid #9ca3af' }}>
          <div className="flex items-center justify-center gap-3">
            {resume.personalInfo.profileImage && (
              <div className="w-14 h-14 rounded-full overflow-hidden" style={{ border: '2px solid #9ca3af' }}>
                <img src={resume.personalInfo.profileImage} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div>
              <h1 className="text-lg font-bold text-black tracking-wide">
                {personalInfo.fullName}
              </h1>
              {personalInfo.professionalTitle && (
                <p className="text-xs italic mt-0.5" style={{ color: '#4a5568' }}>{personalInfo.professionalTitle}</p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-x-2 gap-y-0.5 mt-1.5 text-[11px]" style={{ color: '#4a5568' }}>
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
        <Section title="Professional Summary">
          <p className="text-[13px] leading-relaxed italic" style={{ color: '#4a5568' }}>{resume.summary}</p>
        </Section>
      ) : null

    case 'experience':
      return resume.experience.length > 0 ? (
        <Section title="Experience">
          {resume.experience.map((exp) => (
            <div key={exp.id} className="mb-1.5 last:mb-0">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-[13px]">{exp.position || 'Position'}</span>
                <span className="text-[11px] italic" style={{ color: '#6b7280' }}>
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[13px] italic" style={{ color: '#4a5568' }}>{exp.company || 'Company'}</span>
                {exp.location && (
                  <span className="text-[11px]" style={{ color: '#6b7280' }}>{exp.location}</span>
                )}
              </div>
              {exp.bulletPoints.filter(Boolean).length > 0 && (
                <ul className="mt-0.5 space-y-0.5">
                  {exp.bulletPoints.filter(Boolean).map((bullet, i) => (
                    <li key={i} className="text-[11px] pl-2 relative" style={{ color: '#374151' }}>
                      <span className="absolute left-0" style={{ color: '#9ca3af' }}>–</span>
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
                <span className="font-bold">{cat.name || 'Category'}: </span>
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
            <div key={proj.id} className="mb-2 last:mb-0">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-[13px]">{proj.name || 'Project'}</span>
                {proj.duration && (
                  <span className="text-[11px] italic" style={{ color: '#6b7280' }}>{proj.duration}</span>
                )}
              </div>
              {proj.role && (
                <span className="text-[11px] italic" style={{ color: '#4a5568' }}>{proj.role}</span>
              )}
              {proj.description && (
                <p className="text-[11px] mt-0.5" style={{ color: '#374151' }}>{proj.description}</p>
              )}
              {proj.bulletPoints.filter(Boolean).length > 0 && (
                <ul className="mt-0.5 space-y-0.5">
                  {proj.bulletPoints.filter(Boolean).map((bullet, i) => (
                    <li key={i} className="text-[11px] pl-2 relative" style={{ color: '#374151' }}>
                      <span className="absolute left-0" style={{ color: '#9ca3af' }}>–</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
              {proj.technologies.length > 0 && (
                <p className="text-[11px] mt-0.5 italic" style={{ color: '#6b7280' }}>
                  <span className="font-medium not-italic">Tech:</span> {proj.technologies.join(', ')}
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
                <span className="text-[11px] italic" style={{ color: '#6b7280' }}>
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[13px] italic" style={{ color: '#4a5568' }}>{edu.institution || 'Institution'}</span>
                {edu.cgpa && <span className="text-[11px]" style={{ color: '#6b7280' }}>CGPA: {edu.cgpa}</span>}
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
                {cert.issuer && <span style={{ color: '#4a5568' }}> – {cert.issuer}</span>}
              </span>
              <span className="text-[11px] italic" style={{ color: '#6b7280' }}>{cert.date}</span>
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
                <span className="font-bold text-[13px]">{ach.title || 'Achievement'}</span>
                {ach.date && <span className="text-[11px] italic" style={{ color: '#6b7280' }}>{ach.date}</span>}
              </div>
              {ach.description && (
                <p className="text-[11px]" style={{ color: '#374151' }}>{ach.description}</p>
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
                <span className="font-bold text-[13px] italic">{pub.title || 'Publication'}</span>
                <span className="text-[11px]" style={{ color: '#6b7280' }}>{pub.date}</span>
              </div>
              <span className="text-[11px] italic" style={{ color: '#4a5568' }}>{pub.publisher}</span>
              {pub.description && (
                <p className="text-[11px]" style={{ color: '#374151' }}>{pub.description}</p>
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
              <span key={lang.id} className="text-[11px]" style={{ color: '#374151' }}>
                <span className="font-medium">{lang.name || 'Language'}</span>
                {lang.proficiency && <span style={{ color: '#6b7280' }}> – {lang.proficiency}</span>}
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
              <p className="text-[11px] whitespace-pre-wrap" style={{ color: '#374151' }}>{cs.content}</p>
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
      <h2 className="text-[14px] font-bold uppercase tracking-wider pb-0 mb-0.5" style={{ color: '#4a5568', borderBottom: '0.5px solid #9ca3af' }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

export default {
  config,
  Preview,
  generateLatex: generateElegantLatex,
}
