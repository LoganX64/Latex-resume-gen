import type { ResumeData } from '@/types/resume'
import type { ReactNode } from 'react'
import { formatDate } from '@/lib/utils'
import config from './config'
import { generateReferenceLatex } from './latex'
import { ContactIcon } from '../icons'

function dateRange(start: string, end: string, current: boolean): string {
  const from = formatDate(start)
  if (!from) return ''
  return `${from} – ${current ? 'Present' : formatDate(end)}`
}

function Preview({ resume, sections }: {
  resume: ResumeData
  sections: { id: string; type: string; label: string }[]
}): ReactNode {
  const { personalInfo } = resume
  const contacts = [
    personalInfo.email && <span key="email"><ContactIcon type="email" className="mr-1 inline h-3 w-3" />{personalInfo.email}</span>,
    personalInfo.phone && <span key="phone"><ContactIcon type="phone" className="mr-1 inline h-3 w-3" />{personalInfo.phone}</span>,
    personalInfo.linkedin && <span key="linkedin"><ContactIcon type="linkedin" className="mr-1 inline h-3 w-3" />{personalInfo.linkedin}</span>,
    personalInfo.github && <span key="github"><ContactIcon type="github" className="mr-1 inline h-3 w-3" />{personalInfo.github}</span>,
    personalInfo.website && <span key="website"><ContactIcon type="website" className="mr-1 inline h-3 w-3" />{personalInfo.website}</span>,
  ].filter(Boolean)

  return (
    <div style={{ fontFamily: 'Montserrat, Arial, sans-serif', fontSize: '10px', lineHeight: '1.28', color: '#171717' }}>
      <header style={{ textAlign: 'center', marginBottom: '9px' }}>
        {personalInfo.fullName && <div style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '.2px', textTransform: 'uppercase' }}>{personalInfo.fullName}</div>}
        {personalInfo.professionalTitle && <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '1px', textTransform: 'uppercase' }}>{personalInfo.professionalTitle}</div>}
        {contacts.length > 0 && <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', columnGap: '5px', color: '#333', fontSize: '9px', marginTop: '3px' }}>{contacts.map((contact, i) => <span key={i}>{i > 0 && <span style={{ marginRight: 5 }}>·</span>}{contact}</span>)}</div>}
        {personalInfo.location && <div style={{ fontSize: '9px', marginTop: '2px' }}><ContactIcon type="location" className="mr-1 inline h-3 w-3" />{personalInfo.location}</div>}
      </header>
      {sections.map((section) => <SectionContent key={section.id} type={section.type} resume={resume} />)}
    </div>
  )
}

function Heading({ title, date }: { title: ReactNode; date?: string }) {
  return <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}><strong>{title}</strong>{date && <strong style={{ flexShrink: 0, fontSize: '9px' }}>{date}</strong>}</div>
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  const chars = Array.from(title)
  return <section style={{ marginTop: '5px' }} data-section="true"><h2 style={{ fontSize: '11px', fontVariant: 'small-caps', fontWeight: 800, borderBottom: '1px solid #333', paddingBottom: '1px', margin: '0 0 3px' }}><span style={{ fontSize: '11.6px' }}>{chars[0]}</span>{chars.slice(1).join('')}</h2>{children}</section>
}

function SectionContent({ type, resume }: { type: string; resume: ResumeData }) {
  switch (type) {
    case 'summary': return resume.summary ? <Section title="Professional Summary"><p style={{ margin: 0 }}>{resume.summary}</p></Section> : null
    case 'experience': return resume.experience.length ? <Section title="Experience">{resume.experience.map((item) => <div key={item.id} style={{ marginBottom: 4 }}><Heading title={`${item.position}${item.company ? ` | ${item.company}` : ''}`} date={dateRange(item.startDate, item.endDate, item.current)} />{item.location && <div style={{ fontSize: 9, fontStyle: 'italic' }}>{item.location}</div>}{item.bulletPoints.filter(Boolean).length > 0 && <ul style={{ margin: '1px 0 0', paddingLeft: 20 }}>{item.bulletPoints.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}</ul>}</div>)}</Section> : null
    case 'skills': return resume.skills.length ? <Section title="Skills">{resume.skills.map((item) => <div key={item.id}><strong>{item.name}: </strong>{item.skills.join(', ')}</div>)}</Section> : null
    case 'projects': return resume.projects.length ? <Section title="Projects">{resume.projects.map((item) => <div key={item.id} style={{ marginBottom: 5 }}><Heading title={<>{item.name}{item.role && <span style={{ fontWeight: 400, fontStyle: 'italic' }}> – {item.role}</span>}</>} date={item.duration} />{item.technologies.length > 0 && <div style={{ fontWeight: 700, fontSize: 9, marginTop: 1 }}>{item.technologies.join(' | ')}</div>}{(item.githubUrl || item.liveDemoUrl) && <div style={{ fontSize: 9 }}>{item.githubUrl && <span><strong>GitHub Link:</strong> {item.githubUrl}</span>}{item.githubUrl && item.liveDemoUrl && ' · '}{item.liveDemoUrl && <span><strong>Live Link:</strong> {item.liveDemoUrl}</span>}</div>}{item.description && <p style={{ margin: '2px 0 0' }}>{item.description}</p>}{item.bulletPoints.filter(Boolean).length > 0 && <ul style={{ margin: '1px 0 0', paddingLeft: 20 }}>{item.bulletPoints.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}</ul>}</div>)}</Section> : null
    case 'education': return resume.education.length ? <Section title="Education">{resume.education.map((item) => <div key={item.id} style={{ marginBottom: 3 }}><Heading title={`${item.degree}${item.specialization ? ` in ${item.specialization}` : ''}`} date={dateRange(item.startDate, item.endDate, false)} /><div>{item.institution}{item.cgpa && <span style={{ float: 'right' }}>GPA: {item.cgpa}</span>}</div>{item.description && <div>{item.description}</div>}</div>)}</Section> : null
    case 'certifications': return resume.certifications.length ? <Section title="Certifications">{resume.certifications.map((item) => <div key={item.id}><Heading title={<>{item.name}{item.issuer && <span style={{ fontWeight: 400, fontStyle: 'italic' }}> – {item.issuer}</span>}</>} date={item.date} /></div>)}</Section> : null
    case 'achievements': return resume.achievements.length ? <Section title="Achievements">{resume.achievements.map((item) => <div key={item.id}><Heading title={item.title} date={item.date} />{item.description && <div>{item.description}</div>}</div>)}</Section> : null
    case 'publications': return resume.publications.length ? <Section title="Publications">{resume.publications.map((item) => <div key={item.id} style={{ marginBottom: 4 }}><Heading title={item.title} date={item.date} />{item.publisher && <div style={{ fontStyle: 'italic' }}>{item.publisher}</div>}{item.description && <div>{item.description}</div>}{item.url && <div style={{ fontSize: 9 }}><strong>Publication Link:</strong> {item.url}</div>}</div>)}</Section> : null
    case 'languages': return resume.languages.length ? <Section title="Languages">{resume.languages.map((item, i) => <span key={item.id}>{i > 0 && ' · '}<strong>{item.name}</strong> ({item.proficiency})</span>)}</Section> : null
    case 'customSections': return resume.customSections.map((item) => item.title || item.content ? <Section key={item.id} title={item.title || 'Additional Information'}><div style={{ whiteSpace: 'pre-wrap' }}>{item.content}</div></Section> : null)
    default: return null
  }
}

export default { config, Preview, generateLatex: generateReferenceLatex }
