import type { CSSProperties, ReactNode } from 'react'
import type { ResumeData } from '@/types/resume'
import { formatDate } from '@/lib/utils'
import config from './config'
import { generateReferenceLatex } from './latex'
import { ContactIcon } from '../icons'
import '@fontsource-variable/montserrat'
import '@fontsource-variable/montserrat/wght-italic.css'

const FONT_FAMILY = "'Montserrat Variable', Montserrat, Arial, sans-serif"
const LINK_COLOR = '#0000b3'
const LINK_STYLE: CSSProperties = { color: LINK_COLOR, textDecoration: 'none' }

function withProtocol(url: string): string {
  return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`
}

function dateRange(start: string, end: string, current: boolean): string {
  const from = formatDate(start)
  if (!from) return ''
  return `${from} – ${current ? 'Present' : formatDate(end)}`
}

function Heading({ title, date }: { title: ReactNode; date?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8pt' }}>
      <span style={{ fontWeight: 700, minWidth: 0 }}>{title}</span>
      {date && <span style={{ fontWeight: 700, flexShrink: 0, whiteSpace: 'nowrap' }}>{date}</span>}
    </div>
  )
}

function ItalicRow({ left, right }: { left?: ReactNode; right?: ReactNode }) {
  if (!left && !right) return null
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8pt', fontStyle: 'italic' }}>
      <span style={{ minWidth: 0 }}>{left}</span>
      {right && <span style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>{right}</span>}
    </div>
  )
}

function Bullets({ items }: { items: string[] }) {
  if (items.length === 0) return null
  return (
    <ul
      className="reference-bullets"
      role="list"
      style={{ listStyle: 'none', margin: '1pt 0 0', padding: 0 }}
    >
      {items.map((item, i) => (
        <li key={i} style={{ position: 'relative', paddingLeft: '13.45pt' }}>
          <span
            aria-hidden="true"
            style={{ position: 'absolute', left: '5.25pt', top: 0, fontWeight: 700 }}
          >
            •
          </span>
          {item}
        </li>
      ))}
    </ul>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  const chars = Array.from(title.toLocaleUpperCase())
  return (
    <section style={{ marginTop: '2.5pt' }} data-section="true">
      <h2
        style={{
          fontSize: '9pt',
          lineHeight: '10pt',
          fontWeight: 700,
          color: '#000',
          borderBottom: '0.4pt solid #000',
          paddingBottom: '0.4pt',
          margin: '0 0 0.6pt',
        }}
      >
        <span style={{ fontSize: '9.5pt' }}>{chars[0]}</span>
        {chars.slice(1).join('')}
      </h2>
      {children}
    </section>
  )
}

function Preview({ resume, sections }: {
  resume: ResumeData
  sections: { id: string; type: string; label: string }[]
}): ReactNode {
  const { personalInfo } = resume

  const contacts: ReactNode[] = []
  if (personalInfo.email) {
    contacts.push(<a key="email" href={`mailto:${personalInfo.email}`} style={LINK_STYLE}>{personalInfo.email}</a>)
  }
  if (personalInfo.phone) {
    contacts.push(<span key="phone">{personalInfo.phone}</span>)
  }
  if (personalInfo.linkedin) {
    contacts.push(<a key="linkedin" href={withProtocol(personalInfo.linkedin)} style={LINK_STYLE}>{personalInfo.linkedin}</a>)
  }
  if (personalInfo.github) {
    contacts.push(<a key="github" href={withProtocol(personalInfo.github)} style={LINK_STYLE}>{personalInfo.github}</a>)
  }
  if (personalInfo.website) {
    contacts.push(<a key="website" href={withProtocol(personalInfo.website)} style={LINK_STYLE}>{personalInfo.website}</a>)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', fontFamily: FONT_FAMILY, fontSize: '9pt', lineHeight: '11pt', color: '#000', textAlign: 'justify', wordSpacing: '-0.076em' }}>
      <header style={{ textAlign: 'center', marginBottom: '4.7pt' }}>
        {personalInfo.fullName && (
          <div style={{ fontSize: '15pt', lineHeight: '11pt', fontWeight: 700, textTransform: 'uppercase' }}>
            {personalInfo.fullName}
          </div>
        )}
        {personalInfo.professionalTitle && (
          <div style={{ fontSize: '14pt', lineHeight: '11pt', fontWeight: 700, textTransform: 'uppercase' }}>
            {personalInfo.professionalTitle}
          </div>
        )}
        {contacts.length > 0 && (
          <div style={{ fontSize: '8pt', lineHeight: '11pt', marginTop: '4pt' }}>
            {contacts.map((contact, i) => <span key={i}>{i > 0 && ' · '}{contact}</span>)}
          </div>
        )}
        {personalInfo.location && (
          <div style={{ fontSize: '8pt', lineHeight: '11pt' }}>{personalInfo.location}</div>
        )}
      </header>
      {sections.map((section) => <SectionContent key={section.id} type={section.type} resume={resume} />)}
    </div>
  )
}

function SectionContent({ type, resume }: { type: string; resume: ResumeData }) {
  switch (type) {
    case 'summary':
      return resume.summary ? <Section title="Professional Summary"><p style={{ margin: 0 }}>{resume.summary}</p></Section> : null
    case 'experience':
      return resume.experience.length ? (
        <Section title="Experience">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4pt' }}>
            {resume.experience.map((item) => (
              <div key={item.id}>
                <Heading title={item.position} date={dateRange(item.startDate, item.endDate, item.current)} />
                <ItalicRow left={item.company} right={item.location} />
                <Bullets items={item.bulletPoints.filter((b) => b.trim() !== '')} />
              </div>
            ))}
          </div>
        </Section>
      ) : null
    case 'skills':
      return resume.skills.length ? (
        <Section title="Skills">
          {resume.skills.map((item) => (
            <div key={item.id}><span style={{ fontWeight: 700 }}>{item.name}:</span> {item.skills.join(', ')}</div>
          ))}
        </Section>
      ) : null
    case 'projects':
      return resume.projects.length ? (
        <Section title="Projects">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4pt' }}>
            {resume.projects.map((item) => {
              const github = item.githubUrl ? withProtocol(item.githubUrl) : ''
              const live = item.liveDemoUrl ? withProtocol(item.liveDemoUrl) : ''
              const links: ReactNode[] = []
              if (github) links.push(<span key="github">GitHub Link: <a href={github} style={LINK_STYLE}>{github}</a></span>)
              if (live) links.push(<span key="live">Live Link: <a href={live} style={LINK_STYLE}>{live}</a></span>)
              return (
                <div key={item.id}>
                  <Heading
                    title={<>{item.name}{item.role && <span style={{ fontWeight: 400, fontStyle: 'italic' }}> – {item.role}</span>}</>}
                    date={item.duration}
                  />
                  {item.technologies.length > 0 && (
                    <div style={{ fontSize: '8pt', lineHeight: '11pt', fontWeight: 700 }}>{item.technologies.join(' | ')}</div>
                  )}
                  {links.length > 0 && (
                    <div style={{ fontSize: '8pt', lineHeight: '11pt' }}>
                      {links.map((link, i) => <span key={i}>{i > 0 && ' • '}{link}</span>)}
                    </div>
                  )}
                  {item.description && <div>{item.description}</div>}
                  <Bullets items={item.bulletPoints.filter((b) => b.trim() !== '')} />
                </div>
              )
            })}
          </div>
        </Section>
      ) : null
    case 'education':
      return resume.education.length ? (
        <Section title="Education">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2pt' }}>
            {resume.education.map((item) => (
              <div key={item.id}>
                <Heading
                  title={`${item.degree}${item.specialization ? ` in ${item.specialization}` : ''}`}
                  date={dateRange(item.startDate, item.endDate, false)}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8pt' }}>
                  <span>{item.institution}</span>
                  {item.cgpa && <span style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>GPA: {item.cgpa}</span>}
                </div>
                {item.description && <div>{item.description}</div>}
              </div>
            ))}
          </div>
        </Section>
      ) : null
    case 'certifications':
      return resume.certifications.length ? (
        <Section title="Certifications">
          {resume.certifications.map((item) => (
            <div key={item.id}>
              <Heading
                title={
                  <>
                    {item.name}
                    {item.issuer && <span style={{ fontWeight: 400, fontStyle: 'italic' }}> – {item.issuer}</span>}
                    {item.url && (
                      <a href={item.url} style={{ color: '#00aeef', textDecoration: 'none' }}>
                        {' '}<ContactIcon type="externalLink" className="inline h-[0.8em] w-[0.8em] align-[-0.05em]" />
                      </a>
                    )}
                  </>
                }
                date={item.date}
              />
            </div>
          ))}
        </Section>
      ) : null
    case 'achievements':
      return resume.achievements.length ? (
        <Section title="Achievements">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2pt' }}>
            {resume.achievements.map((item) => (
              <div key={item.id}>
                <Heading title={item.title} date={item.date} />
                {item.description && <div>{item.description}</div>}
              </div>
            ))}
          </div>
        </Section>
      ) : null
    case 'publications':
      return resume.publications.length ? (
        <Section title="Publications">
          {resume.publications.map((item) => {
            const url = item.url ? withProtocol(item.url) : ''
            return (
              <div key={item.id}>
                <Heading title={item.title} date={item.date} />
                {item.publisher && <div style={{ fontStyle: 'italic' }}>{item.publisher}</div>}
                {item.description && <div>{item.description}</div>}
                {url && (
                  <div style={{ fontSize: '8pt', lineHeight: '11pt' }}>
                    Publication Link: <a href={url} style={LINK_STYLE}>{url}</a>
                  </div>
                )}
              </div>
            )
          })}
        </Section>
      ) : null
    case 'languages':
      return resume.languages.length ? (
        <Section title="Languages">
          {resume.languages.map((item, i) => (
            <span key={item.id}>
              {i > 0 && ' • '}
              <span style={{ fontWeight: 700 }}>{item.name}</span> ({item.proficiency})
            </span>
          ))}
        </Section>
      ) : null
    case 'customSections':
      return resume.customSections.map((item) => item.title || item.content ? (
        <Section key={item.id} title={item.title || 'Additional Information'}>
          <div>{item.content}</div>
        </Section>
      ) : null)
    default:
      return null
  }
}

export default { config, Preview, generateLatex: generateReferenceLatex }
