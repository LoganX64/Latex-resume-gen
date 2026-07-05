import type { ResumeData } from '@/types/resume'
import type { ReactNode } from 'react'
import { sidebarConfig as config } from './config'
import { generateSidebarLatex } from './latex'

function Preview({
  resume,
  sections,
}: {
  resume: ResumeData
  sections: { id: string; type: string; label: string }[]
}): ReactNode {
  const { personalInfo } = resume

  const sidebarTypes = ['skills', 'languages', 'certifications']
  const sidebarSections = sections.filter((s) => sidebarTypes.includes(s.type))
  const mainSections = sections.filter((s) => !sidebarTypes.includes(s.type))

  return (
    <div className="flex min-h-full" style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontSize: '14px', lineHeight: '1.25' }}>
      {/* Sidebar */}
      <div className="w-[160px] shrink-0 text-white p-3" style={{ backgroundColor: '#1a365d' }}>
        <div className="text-center mb-3">
          {resume.personalInfo.profileImage && (
            <div className="w-16 h-16 rounded-full mx-auto mb-2 overflow-hidden border-2 border-white/30">
              <img src={resume.personalInfo.profileImage} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <h1 className="text-base font-bold">{personalInfo.fullName || 'Your Name'}</h1>
          {personalInfo.professionalTitle && (
            <p className="text-[12px] text-white/80 italic mt-0">{personalInfo.professionalTitle}</p>
          )}
        </div>

        <div className="space-y-1 text-[12px]">
          {personalInfo.email && (
            <div className="flex items-center gap-1">
              <span className="opacity-70">@</span>
              <span className="truncate">{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1">
              <span className="opacity-70">#</span>
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-1">
              <span className="opacity-70">*</span>
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-1">
              <span className="opacity-70">in</span>
              <span className="truncate">{personalInfo.linkedin}</span>
            </div>
          )}
          {personalInfo.github && (
            <div className="flex items-center gap-1">
              <span className="opacity-70">gh</span>
              <span className="truncate">{personalInfo.github}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-1">
              <span className="opacity-70">www</span>
              <span className="truncate">{personalInfo.website}</span>
            </div>
          )}
        </div>

        {/* Sidebar Sections */}
        <div className="mt-3 space-y-2">
          {sidebarSections.map((section) => (
            <SidebarSection key={section.id} section={section} resume={resume} />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-3" style={{ backgroundColor: '#f7fafc' }}>
        {mainSections.map((section) => (
          <MainSection key={section.id} section={section} resume={resume} />
        ))}
      </div>
    </div>
  )
}

function SidebarSection({
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
          <h3 className="text-[14px] font-bold uppercase tracking-wider mb-1 pb-0.5 border-b border-white/30">
            Skills
          </h3>
          <div className="space-y-1">
            {resume.skills.map((cat) => (
              <div key={cat.id}>
                <span className="text-[12px] font-semibold">{cat.name || 'Category'}</span>
                <p className="text-[12px] text-white/80">{cat.skills.join(', ')}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null

    case 'languages':
      return resume.languages.length > 0 ? (
        <div className="mb-1.5">
          <h3 className="text-[14px] font-bold uppercase tracking-wider mb-1 pb-0.5 border-b border-white/30">
            Languages
          </h3>
          <div className="space-y-0.5">
            {resume.languages.map((lang) => (
              <div key={lang.id} className="flex justify-between text-[12px]">
                <span>{lang.name || 'Language'}</span>
                {lang.proficiency && <span className="text-white/70">{lang.proficiency}</span>}
              </div>
            ))}
          </div>
        </div>
      ) : null

    case 'certifications':
      return resume.certifications.length > 0 ? (
        <div className="mb-1.5">
          <h3 className="text-[14px] font-bold uppercase tracking-wider mb-1 pb-0.5 border-b border-white/30">
            Certifications
          </h3>
          <div className="space-y-0.5">
            {resume.certifications.map((cert) => (
              <div key={cert.id} className="text-[12px]">
                <span className="font-semibold">{cert.name || 'Certification'}</span>
                {cert.issuer && <span className="text-white/70"> - {cert.issuer}</span>}
              </div>
            ))}
          </div>
        </div>
      ) : null

    default:
      return null
  }
}

function MainSection({
  section,
  resume,
}: {
  section: { type: string; label: string }
  resume: ResumeData
}) {
  switch (section.type) {
    case 'summary':
      return resume.summary ? (
        <div className="mb-1.5">
          <h3 className="text-[15px] font-bold uppercase tracking-wider mb-0.5 pb-0" style={{ color: '#1a365d', borderBottom: '1px solid #1a365d' }}>
            Professional Summary
          </h3>
          <p className="text-[12px] leading-relaxed text-gray-700">{resume.summary}</p>
        </div>
      ) : null

    case 'experience':
      return resume.experience.length > 0 ? (
        <div className="mb-1.5">
          <h3 className="text-[15px] font-bold uppercase tracking-wider mb-0.5 pb-0" style={{ color: '#1a365d', borderBottom: '1px solid #1a365d' }}>
            Experience
          </h3>
          {resume.experience.map((exp) => (
            <div key={exp.id} className="mb-2 last:mb-0">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-[14px]">{exp.position || 'Position'}</span>
                <span className="text-[12px] text-gray-500">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[12px] text-gray-600 italic">{exp.company || 'Company'}</span>
                {exp.location && (
                  <span className="text-[12px] text-gray-500">{exp.location}</span>
                )}
              </div>
              {exp.bulletPoints.filter(Boolean).length > 0 && (
                <ul className="mt-0 space-y-0.5">
                  {exp.bulletPoints.filter(Boolean).map((bullet, i) => (
                    <li key={i} className="text-[12px] text-gray-700 pl-2 relative before:content-['•'] before:absolute before:left-0" style={{ color: '#1a365d' }}>
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
          <h3 className="text-[15px] font-bold uppercase tracking-wider mb-0.5 pb-0" style={{ color: '#1a365d', borderBottom: '1px solid #1a365d' }}>
            Projects
          </h3>
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
                <ul className="mt-0 space-y-0.5">
                  {proj.bulletPoints.filter(Boolean).map((bullet, i) => (
                    <li key={i} className="text-[12px] text-gray-700 pl-2 relative before:content-['•'] before:absolute before:left-0" style={{ color: '#1a365d' }}>
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
        </div>
      ) : null

    case 'education':
      return resume.education.length > 0 ? (
        <div className="mb-1.5">
          <h3 className="text-[15px] font-bold uppercase tracking-wider mb-0.5 pb-0" style={{ color: '#1a365d', borderBottom: '1px solid #1a365d' }}>
            Education
          </h3>
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
                <span className="text-[12px] text-gray-600 italic">{edu.institution || 'Institution'}</span>
                {edu.cgpa && <span className="text-[12px] text-gray-500">CGPA: {edu.cgpa}</span>}
              </div>
            </div>
          ))}
        </div>
      ) : null

    case 'achievements':
      return resume.achievements.length > 0 ? (
        <div className="mb-1.5">
          <h3 className="text-[15px] font-bold uppercase tracking-wider mb-0.5 pb-0" style={{ color: '#1a365d', borderBottom: '1px solid #1a365d' }}>
            Achievements
          </h3>
          {resume.achievements.map((ach) => (
            <div key={ach.id} className="mb-1 last:mb-0">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-[12px]">{ach.title || 'Achievement'}</span>
                {ach.date && <span className="text-[12px] text-gray-500">{ach.date}</span>}
              </div>
              {ach.description && (
                <p className="text-[12px] text-gray-700">{ach.description}</p>
              )}
            </div>
          ))}
        </div>
      ) : null

    case 'publications':
      return resume.publications.length > 0 ? (
        <div className="mb-1.5">
          <h3 className="text-[15px] font-bold uppercase tracking-wider mb-0.5 pb-0" style={{ color: '#1a365d', borderBottom: '1px solid #1a365d' }}>
            Publications
          </h3>
          {resume.publications.map((pub) => (
            <div key={pub.id} className="mb-1 last:mb-0">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-[12px]">{pub.title || 'Publication'}</span>
                <span className="text-[12px] text-gray-500">{pub.date}</span>
              </div>
              <span className="text-[12px] text-gray-600 italic">{pub.publisher}</span>
              {pub.description && (
                <p className="text-[12px] text-gray-700">{pub.description}</p>
              )}
            </div>
          ))}
        </div>
      ) : null

    case 'customSections':
      return resume.customSections.length > 0 ? (
        <>
          {resume.customSections.map((cs) => (
            <div key={cs.id} className="mb-2">
              <h3 className="text-[15px] font-bold uppercase tracking-wider mb-0.5 pb-0" style={{ color: '#1a365d', borderBottom: '1px solid #1a365d' }}>
                {cs.title || 'Custom Section'}
              </h3>
              <p className="text-[12px] text-gray-700 whitespace-pre-wrap">{cs.content}</p>
            </div>
          ))}
        </>
      ) : null

    default:
      return null
  }
}

export default {
  config,
  Preview,
  generateLatex: generateSidebarLatex,
}
