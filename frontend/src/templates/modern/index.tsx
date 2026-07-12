import type { ResumeData } from '@/types/resume'
import type { ReactNode } from 'react'
import { generateModernLatex } from './latex'
import config from './config'

const styles = {
  sectionTitle: {
    fontSize: '14px',
    fontWeight: 700,
    fontVariant: 'small-caps' as const,
    letterSpacing: '0.5px',
    borderBottom: '1px solid #000',
    paddingBottom: '0',
    marginBottom: '2px',
    marginTop: '0',
  },
  sectionWrapper: {
    marginBottom: '4px',
  },
  itemList: {
    margin: 0,
    paddingLeft: '12px',
    listStyle: 'none',
  },
  bulletList: {
    margin: '2px 0 0 0',
    paddingLeft: '20px',
  },
}

function ProjectHeading({ children, date }: { children: ReactNode; date?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', width: '97%' }}>
      <span style={{ fontSize: '12px' }}>{children}</span>
      {date && <span style={{ fontSize: '11px', fontStyle: 'italic', color: '#555' }}>{date}</span>}
    </div>
  )
}

function SubItem({ children }: { children: ReactNode }) {
  return (
    <li style={{ fontSize: '11px', marginBottom: '1px' }}>{children}</li>
  )
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
    <div style={{ fontFamily: '"Source Sans Pro", "Helvetica Neue", Arial, sans-serif', fontSize: '12px', lineHeight: '1.2' }}>
      {personalInfo.fullName && (
        <div style={{ textAlign: 'left', marginBottom: '4px' }}>
          <div style={{ fontSize: '16px', fontWeight: 700 }}>{personalInfo.fullName}</div>
          <div style={{ fontSize: '11px', color: '#555', marginTop: '1px' }}>
            {[
              personalInfo.email,
              personalInfo.phone,
              personalInfo.location,
              personalInfo.linkedin && personalInfo.linkedin.replace(/^https?:\/\//, '').replace(/\/$/, ''),
              personalInfo.github && personalInfo.github.replace(/^https?:\/\//, '').replace(/\/$/, ''),
              personalInfo.website,
            ].filter(Boolean).join(' | ')}
          </div>
        </div>
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
        <div style={styles.sectionWrapper}>
          <h2 style={styles.sectionTitle}>Professional Summary</h2>
          <ul style={styles.itemList}>
            <li style={{ fontSize: '11px', lineHeight: '1.25' }}>{resume.summary}</li>
          </ul>
        </div>
      ) : null

    case 'experience':
      return resume.experience.length > 0 ? (
        <div style={styles.sectionWrapper}>
          <h2 style={styles.sectionTitle}>Experience</h2>
          <ul style={styles.itemList}>
            {resume.experience.map((exp) => (
              <li key={exp.id} style={{ marginBottom: '4px' }}>
                <ProjectHeading date={exp.startDate ? `${exp.startDate} – ${exp.current ? 'Present' : exp.endDate}` : ''}>
                  <strong>{exp.position}</strong> | <em>{exp.company}</em>
                </ProjectHeading>
                {exp.bulletPoints.filter(Boolean).length > 0 && (
                  <ul style={styles.bulletList}>
                    {exp.bulletPoints.filter(Boolean).map((b, i) => (
                      <SubItem key={i}>{b}</SubItem>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null

    case 'skills':
      return resume.skills.length > 0 ? (
        <div style={styles.sectionWrapper}>
          <h2 style={styles.sectionTitle}>Technical Skills</h2>
          <ul style={styles.itemList}>
            <li style={{ fontSize: '11px', lineHeight: '1.3' }}>
              {resume.skills.map((cat) => (
                <div key={cat.id}>
                  <strong>{cat.name}:</strong> {cat.skills.join(', ')}
                </div>
              ))}
            </li>
          </ul>
        </div>
      ) : null

    case 'projects':
      return resume.projects.length > 0 ? (
        <div style={styles.sectionWrapper}>
          <h2 style={styles.sectionTitle}>Projects</h2>
          <ul style={styles.itemList}>
            {resume.projects.map((proj) => (
              <li key={proj.id} style={{ marginBottom: '4px' }}>
                <ProjectHeading date={proj.duration}>
                  <strong>{proj.name}</strong>
                  {proj.technologies.length > 0 && <em> | {proj.technologies.join(', ')}</em>}
                </ProjectHeading>
                {proj.description && <div style={{ fontSize: '11px', marginTop: '1px' }}>{proj.description}</div>}
                {proj.bulletPoints.filter(Boolean).length > 0 && (
                  <ul style={styles.bulletList}>
                    {proj.bulletPoints.filter(Boolean).map((b, i) => (
                      <SubItem key={i}>{b}</SubItem>
                    ))}
                  </ul>
                )}
                {(proj.githubUrl || proj.liveDemoUrl) && (
                  <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '1px' }}>
                    {proj.githubUrl && <span>GitHub: {proj.githubUrl}</span>}
                    {proj.githubUrl && proj.liveDemoUrl && <span> | </span>}
                    {proj.liveDemoUrl && <span>Demo: {proj.liveDemoUrl}</span>}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null

    case 'education':
      return resume.education.length > 0 ? (
        <div style={styles.sectionWrapper}>
          <h2 style={styles.sectionTitle}>Education</h2>
          <ul style={styles.itemList}>
            {resume.education.map((edu) => {
              const degreeLine = edu.specialization
                ? `${edu.degree} in ${edu.specialization}`
                : edu.degree
              const dateRange = edu.startDate ? `${edu.startDate} – ${edu.endDate}` : ''
              return (
                <li key={edu.id} style={{ marginBottom: '3px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '97%' }}>
                    <span><strong>{edu.institution}</strong></span>
                    <span style={{ fontSize: '11px', fontStyle: 'italic', color: '#555' }}>{dateRange}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '97%' }}>
                    <span style={{ fontSize: '11px' }}><strong>{degreeLine}</strong></span>
                    {edu.cgpa && <span style={{ fontSize: '11px', fontStyle: 'italic', color: '#555' }}>GPA: {edu.cgpa}</span>}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      ) : null

    case 'certifications':
      return resume.certifications.length > 0 ? (
        <div style={styles.sectionWrapper}>
          <h2 style={styles.sectionTitle}>Awards and Certifications</h2>
          <ul style={styles.itemList}>
            {resume.certifications.map((cert) => (
              <li key={cert.id} style={{ marginBottom: '2px' }}>
                <ProjectHeading date={cert.date}>
                  <strong>{cert.name}</strong>
                  {cert.issuer && <em> | {cert.issuer}</em>}
                </ProjectHeading>
              </li>
            ))}
          </ul>
        </div>
      ) : null

    case 'achievements':
      return resume.achievements.length > 0 ? (
        <div style={styles.sectionWrapper}>
          <h2 style={styles.sectionTitle}>Achievements</h2>
          <ul style={styles.itemList}>
            {resume.achievements.map((ach) => (
              <li key={ach.id} style={{ marginBottom: '2px' }}>
                <ProjectHeading date={ach.date}>
                  <strong>{ach.title}</strong>
                  {ach.description && <span> -- {ach.description}</span>}
                </ProjectHeading>
              </li>
            ))}
          </ul>
        </div>
      ) : null

    case 'publications':
      return resume.publications.length > 0 ? (
        <div style={styles.sectionWrapper}>
          <h2 style={styles.sectionTitle}>Publications</h2>
          <ul style={styles.itemList}>
            {resume.publications.map((pub) => (
              <li key={pub.id} style={{ marginBottom: '2px' }}>
                <ProjectHeading date={pub.date}>
                  <strong>{pub.title}</strong> <em>-- {pub.publisher}</em>
                </ProjectHeading>
              </li>
            ))}
          </ul>
        </div>
      ) : null

    case 'languages':
      return resume.languages.length > 0 ? (
        <div style={styles.sectionWrapper}>
          <h2 style={styles.sectionTitle}>Languages</h2>
          <ul style={styles.itemList}>
            <li style={{ fontSize: '11px' }}>
              {resume.languages.map((lang, i) => (
                <span key={lang.id}>
                  <strong>{lang.name}:</strong> {lang.proficiency}
                  {i < resume.languages.length - 1 && <span>, </span>}
                </span>
              ))}
            </li>
          </ul>
        </div>
      ) : null

    case 'customSections':
      return resume.customSections.length > 0 ? (
        <>
          {resume.customSections.map((cs) => (
            <div key={cs.id} style={styles.sectionWrapper}>
              <h2 style={styles.sectionTitle}>{cs.title}</h2>
              <ul style={styles.itemList}>
                <li style={{ fontSize: '11px', whiteSpace: 'pre-wrap' }}>{cs.content}</li>
              </ul>
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
  generateLatex: generateModernLatex,
}
