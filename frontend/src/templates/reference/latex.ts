import type { ResumeData, SectionOrder, SectionVisibility } from '@/types/resume'
import { escapeLatex, formatDate } from '@/lib/utils'
import { generateBulletPoints, getContactParts } from '../shared'

export function generateReferenceLatex(resume: ResumeData, sectionOrder: SectionOrder[], sectionVisibility: SectionVisibility): string {
  const body = sectionOrder
    .filter((section) => sectionVisibility[section.type] ?? false)
    .map((section) => generateSection(section.type, resume))
    .filter(Boolean)
    .join('\n\n')
  return buildDocument(resume, body)
}

function buildDocument(resume: ResumeData, body: string): string {
  const info = resume.personalInfo
  const name = escapeLatex((info.fullName || 'Your Name').toLocaleUpperCase())
  const title = info.professionalTitle ? `\\\\[-1pt]{\\fontsize{14}{16}\\selectfont\\bfseries ${escapeLatex(info.professionalTitle.toLocaleUpperCase())}}` : ''
  const contacts = getContactParts({ ...info, location: '' }, false)
  const contactLine = contacts.length ? `\\\\[1pt]{\\fontsize{8}{10}\\selectfont ${contacts.join(' $\\cdot$ ')}}` : ''
  const location = info.location ? `\\\\[-1pt]{\\fontsize{8}{10}\\selectfont ${escapeLatex(info.location)}}` : ''

  // Keep fontawesome before montserrat. fontawesome loads fontspec, which resets
  // \sfdefault to Latin Modern Sans if it comes later, so Montserrat bold would
  // silently disappear and every \textbf/\bfseries would render as regular text.
  return `\\documentclass[9pt,a4paper]{article}
\\usepackage[T1]{fontenc}
\\usepackage{fontawesome}
\\usepackage[defaultfam,tabular,lining]{montserrat}
\\usepackage[margin=0.5in]{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{titlesec}
\\usepackage{xcolor}
\\pagestyle{empty}
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{0pt}
\\linespread{1.0}
\\titleformat{\\section}{\\fontsize{9}{10}\\selectfont\\bfseries}{}{0em}{}[\\vspace{-1pt}\\titlerule]
\\titlespacing*{\\section}{0pt}{3pt}{2.5pt}
\\setlist[itemize]{nosep,leftmargin=1.5em,label=\\textbullet,topsep=1pt,itemsep=0pt,parsep=0pt}
\\hypersetup{colorlinks=true,linkcolor=black,urlcolor=blue!70!black}
\\urlstyle{same}
\\begin{document}
\\begin{center}
{\\fontsize{15}{17}\\selectfont\\bfseries ${name}}${title}${contactLine}${location}
\\end{center}
\\vspace{-5pt}
${body}
\\end{document}`
}

function section(title: string, content: string): string {
  return content ? `\\section*{${escapeLatex(title.toLocaleUpperCase())}}\n${content}` : ''
}

function date(value: string): string {
  return value ? `\\hfill \\mbox{\\small\\bfseries ${escapeLatex(value)}}` : ''
}

function dateRange(start: string, end: string, current: boolean): string {
  const from = formatDate(start)
  if (!from) return ''
  const to = current ? 'Present' : formatDate(end)
  return `${escapeLatex(from)} -- ${escapeLatex(to)}`
}

function link(url: string, label: string): string {
  if (!url) return ''
  const target = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`
  return `${escapeLatex(label)}: \\url{${target}}`
}

function generateSection(type: string, resume: ResumeData): string {
  switch (type) {
    case 'summary':
      return section('Professional Summary', resume.summary ? `\\fontsize{9}{11}\\selectfont ${escapeLatex(resume.summary)}` : '')
    case 'experience':
      return section('Experience', resume.experience.map((item) => {
        const range = dateRange(item.startDate, item.endDate, item.current)
        const bullets = generateBulletPoints(item.bulletPoints)
        return `\\textbf{${escapeLatex(item.position)}}${date(range)}${item.company ? `\\\\\\textit{${escapeLatex(item.company)}}` : ''}${item.location ? `\\hfill\\textit{${escapeLatex(item.location)}}` : ''}${bullets ? `\n${bullets}` : ''}`
      }).join('\\vspace{3pt}\n'))
    case 'skills':
      return section('Skills', resume.skills.map((item) => `\\textbf{${escapeLatex(item.name)}:} ${escapeLatex(item.skills.join(', '))}`).join('\\\\\n'))
    case 'projects':
      return section('Projects', resume.projects.map((item) => {
        const bullets = generateBulletPoints(item.bulletPoints)
        const links = [item.githubUrl && link(item.githubUrl, 'GitHub Link'), item.liveDemoUrl && link(item.liveDemoUrl, 'Live Link')].filter(Boolean).join(' \\textbullet{} ')
        const tech = item.technologies.length ? `{\\fontsize{8}{10}\\selectfont\\bfseries ${escapeLatex(item.technologies.join(' | '))}}` : ''
        const role = item.role ? ` \\textendash{} \\textit{${escapeLatex(item.role)}}` : ''
        const titleWidth = item.duration ? `\\dimexpr\\textwidth-10em\\relax` : `\\textwidth`
        const heading = `\\noindent\\begin{minipage}[t]{${titleWidth}}\\raggedright\\textbf{${escapeLatex(item.name)}}${role}\\end{minipage}${item.duration ? `\\hfill\\begin{minipage}[t]{10em}\\raggedleft \\small\\bfseries ${escapeLatex(item.duration)}\\end{minipage}` : ''}\\\\`
        const body = [
          tech,
          links ? `{\\fontsize{8}{10}\\selectfont ${links}}` : '',
          item.description ? escapeLatex(item.description) : '',
        ].filter(Boolean).join('\\\\\n')
        return `${heading}${body ? `\n${body}` : ''}${bullets ? `\n${bullets}` : ''}`
      }).join('\\vspace{3pt}\n'))
    case 'education':
      return section('Education', resume.education.map((item) => {
        const degree = item.specialization ? `${item.degree} in ${item.specialization}` : item.degree
        const range = dateRange(item.startDate, item.endDate, false)
        return `\\textbf{${escapeLatex(degree)}}${date(range)}\\\\${escapeLatex(item.institution)}${item.cgpa ? `\\hfill GPA: ${escapeLatex(item.cgpa)}` : ''}${item.description ? `\\\\${escapeLatex(item.description)}` : ''}`
      }).join('\\vspace{2pt}\n'))
    case 'certifications':
      return section('Certifications', resume.certifications.map((item) => {
        const issuer = item.issuer ? ` \\textendash{} \\textit{${escapeLatex(item.issuer)}}` : ''
        const urlIcon = item.url ? ` \\href{${escapeLatex(item.url)}}{\\faExternalLink}` : ''
        return `\\textbf{${escapeLatex(item.name)}}${issuer}${urlIcon}${date(item.date)}`
      }).join('\\\\\n'))
    case 'achievements':
      return section('Achievements', resume.achievements.map((item) => `\\textbf{${escapeLatex(item.title)}}${date(item.date || '')}${item.description ? `\\\\${escapeLatex(item.description)}` : ''}`).join('\\vspace{2pt}\n'))
    case 'publications':
      return section('Publications', resume.publications.map((item) => {
        const titleWidth = item.date ? `\\dimexpr\\textwidth-7em\\relax` : `\\textwidth`
        const heading = `\\noindent\\begin{minipage}[t]{${titleWidth}}\\raggedright\\textbf{${escapeLatex(item.title)}}\\end{minipage}${item.date ? `\\hfill\\begin{minipage}[t]{7em}\\raggedleft \\small\\bfseries ${escapeLatex(item.date)}\\end{minipage}` : ''}\\par`
        const rest = [
          item.publisher ? `\\textit{${escapeLatex(item.publisher)}}` : '',
          item.description ? escapeLatex(item.description) : '',
          item.url ? `{\\fontsize{8}{10}\\selectfont ${link(item.url, 'Publication Link')}}` : '',
        ].filter(Boolean).join('\\\\\n')
        return rest ? `${heading}\n${rest}` : heading
      }).join('\n\n'))
    case 'languages':
      return section('Languages', resume.languages.map((item) => `\\textbf{${escapeLatex(item.name)}} (${escapeLatex(item.proficiency)})`).join(' \\textbullet{} '))
    case 'customSections':
      return resume.customSections.map((item) => section(item.title || 'Additional Information', escapeLatex(item.content))).filter(Boolean).join('\n')
    default:
      return ''
  }
}
