import type { ResumeData, SectionOrder, SectionVisibility } from '@/types/resume'
import { escapeLatex } from '@/lib/utils'
import { formatDateRange, getContactParts } from '../shared'

export function generateModernLatex(
  resume: ResumeData,
  sectionOrder: SectionOrder[],
  sectionVisibility: SectionVisibility
): string {
  const sections = sectionOrder.filter(
    (s) => sectionVisibility[s.type] ?? false
  )

  const body = sections
    .map((section) => generateSection(section.type, resume))
    .filter(Boolean)
    .join('\n')

  return buildModernDocument(resume.personalInfo, body)
}

function buildModernDocument(
  personalInfo: ResumeData['personalInfo'],
  body: string
): string {
  const name = escapeLatex(personalInfo.fullName || 'Your Name')
  const contactParts = getContactParts(personalInfo, true)
  const contactLine = contactParts.length > 0
    ? contactParts.join(' $|$ ')
    : ''

  return `\\documentclass[a4paper,10pt]{article}

\\usepackage[T1]{fontenc}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{xcolor}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage{amsmath}
\\usepackage[margin=0.5in]{geometry}
\\usepackage[default]{sourcesanspro}
\\usepackage{fontawesome}
\\ifx\\pdfglyphtounicode\\undefined
\\else
    \\input{glyphtounicode}
    \\pdfgentounicode=1
\\fi

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}
\\linespread{0.95}

\\titleformat{\\section}{\\vspace{-5pt}\\scshape\\raggedright\\large}{}{0em}{}[\\color{black}\\titlerule\\vspace{-4pt}]

\\definecolor{lightyellow}{cmyk}{0.00, 0.05, 0.20, 0.00}

\\newcommand{\\sectionspace}{\\vspace{-8pt}}
\\newcommand{\\subheadingtitlevspace}{\\vspace{-3pt}}

\\newcommand{\\resumeItem}[1]{\\item{#1\\vspace{-4pt}}}

\\newcommand{\\titleItem}[1]{\\textbf{#1}}

\\newcommand{\\highlight}[1]{\\textsl{\\textbf{#1}}}

\\newcommand{\\resumeSubheading}[4]{
\\item
\\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
\\textbf{#1} & \\textit{\\small #2}\\\\
\\textit{\\small #3} & \\textit{\\small #4}\\\\
\\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubSubheading}[2]{
\\item
\\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
\\textit{#1} & \\textit{#2} \\\\
\\end{tabular*}\\vspace{-2pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
\\item
\\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
#1 & \\textit{#2} \\\\
\\end{tabular*}\\vspace{-9pt}
}

\\newcommand{\\resumeSubHeadingListStart}{\\subheadingtitlevspace\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}

\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-8pt}}

\\hypersetup{
    colorlinks=true,
    linkcolor=black,
    urlcolor=blue!70!black
}

\\begin{document}

\\begin{flushleft}
\\textbf{\\large ${name}} \\\\
${contactLine}
\\vspace{-8pt}
\\end{flushleft}

${body}

\\end{document}`
}

function generateSection(type: string, resume: ResumeData): string {
  switch (type) {
    case 'summary':
      return generateSummary(resume.summary)
    case 'experience':
      return generateExperience(resume.experience)
    case 'skills':
      return generateSkills(resume.skills)
    case 'projects':
      return generateProjects(resume.projects)
    case 'education':
      return generateEducation(resume.education)
    case 'certifications':
      return generateCertifications(resume.certifications)
    case 'achievements':
      return generateAchievements(resume.achievements)
    case 'publications':
      return generatePublications(resume.publications)
    case 'languages':
      return generateLanguages(resume.languages)
    case 'customSections':
      return resume.customSections.map((cs) => generateCustomSection(cs)).join('\n\n')
    default:
      return ''
  }
}

function generateSummary(summary: string): string {
  if (!summary) return ''
  return `\\section{Professional Summary}
\\resumeSubHeadingListStart
\\item{${escapeLatex(summary)}\\vspace{-8pt}}
\\resumeSubHeadingListEnd`
}

function generateExperience(experience: ResumeData['experience']): string {
  if (experience.length === 0) return ''
  const items = experience
    .map((exp) => {
      const dateRange = formatDateRange(exp.startDate, exp.endDate, exp.current)
      const bullets = exp.bulletPoints.filter((b): b is string => !!b && b.trim() !== '')
      const bulletBlock = bullets.length > 0
        ? `\\resumeItemListStart\n${bullets.map((b) => `\\resumeItem{${escapeLatex(b)}}`).join('\n')}\n\\resumeItemListEnd`
        : ''

      return `\\resumeProjectHeading
{\\titleItem{${escapeLatex(exp.position)}} $|$ \\emph{${escapeLatex(exp.company)}}}{${dateRange}}
${bulletBlock}`
    })
    .join('\n\n')

  return `\\section{Experience}
\\resumeSubHeadingListStart
${items}
\\resumeSubHeadingListEnd`
}

function generateSkills(skills: ResumeData['skills']): string {
  if (skills.length === 0) return ''
  const items = skills
    .map((cat) => `\\titleItem{${escapeLatex(cat.name)}}: ${escapeLatex(cat.skills.join(', '))}`)
    .join(' \\\\\n')

  return `\\section{Technical Skills}
\\resumeSubHeadingListStart
\\item{${items}\\vspace{-8pt}}
\\resumeSubHeadingListEnd`
}

function generateProjects(projects: ResumeData['projects']): string {
  if (projects.length === 0) return ''
  const items = projects
    .map((proj) => {
      const techTag = proj.technologies.length > 0
        ? ` $|$ \\emph{${escapeLatex(proj.technologies.join(', '))}}`
        : ''
      const bullets = proj.bulletPoints.filter((b): b is string => !!b && b.trim() !== '').map((b) => escapeLatex(b))
      
      const links = []
      if (proj.githubUrl) links.push(`\\href{${escapeLatex(proj.githubUrl)}}{\\underline{GitHub}}`)
      if (proj.liveDemoUrl) links.push(`\\href{${escapeLatex(proj.liveDemoUrl)}}{\\underline{Live Demo}}`)
      if (links.length > 0) bullets.push(links.join(' $|$ '))
      
      const bulletBlock = bullets.length > 0
        ? `\\resumeItemListStart\n${bullets.map((b) => `\\resumeItem{${b}}`).join('\n')}\n\\resumeItemListEnd`
        : ''

      return `\\resumeProjectHeading
{\\titleItem{${escapeLatex(proj.name)}}${techTag}}{${escapeLatex(proj.duration || '')}}
${bulletBlock}`
    })
    .join('\n\n')

  return `\\section{Projects}
\\resumeSubHeadingListStart
${items}
\\resumeSubHeadingListEnd`
}

function generateEducation(education: ResumeData['education']): string {
  if (education.length === 0) return ''
  const items = education
    .map((edu) => {
      const dateRange = formatDateRange(edu.startDate, edu.endDate, false)
      const degreeLine = edu.specialization
        ? `${escapeLatex(edu.degree)} in ${escapeLatex(edu.specialization)}`
        : escapeLatex(edu.degree)
      const cgpa = edu.cgpa ? `GPA: ${escapeLatex(edu.cgpa)}` : ''

      return `\\resumeSubheading
{${escapeLatex(edu.institution)}}{${dateRange}}
{${degreeLine}}{${cgpa}}`
    })
    .join('\n\n')

  return `\\section{Education}
\\resumeSubHeadingListStart
${items}
\\resumeSubHeadingListEnd`
}

function generateCertifications(certifications: ResumeData['certifications']): string {
  if (certifications.length === 0) return ''
  const items = certifications
    .map((cert) => {
      const issuerStr = cert.issuer ? ` \\emph{$|$ ${escapeLatex(cert.issuer)}}` : ''
      const urlIcon = cert.url ? ` \\href{${cert.url}}{\\faExternalLink}` : ''
      return `\\resumeProjectHeading
{\\titleItem{${escapeLatex(cert.name)}}${urlIcon}${issuerStr}}{${escapeLatex(cert.date || '')}}`
    })
    .join('\n')

  return `\\section{Awards and Certifications}
\\resumeSubHeadingListStart
${items}
\\resumeSubHeadingListEnd`
}

function generateAchievements(achievements: ResumeData['achievements']): string {
  if (achievements.length === 0) return ''
  const items = achievements
    .map((ach) => {
      const descStr = ach.description 
        ? `\n\\resumeItemListStart\n\\resumeItem{${escapeLatex(ach.description)}}\n\\resumeItemListEnd`
        : ''
      return `\\resumeProjectHeading
{\\titleItem{${escapeLatex(ach.title)}}}{${escapeLatex(ach.date || '')}}${descStr}`
    })
    .join('\n')

  return `\\section{Achievements}
\\resumeSubHeadingListStart
${items}
\\resumeSubHeadingListEnd`
}

function generatePublications(publications: ResumeData['publications']): string {
  if (publications.length === 0) return ''
  const items = publications
    .map((pub) => {
      const descStr = pub.description 
        ? `\n\\resumeItemListStart\n\\resumeItem{${escapeLatex(pub.description)}}\n\\resumeItemListEnd`
        : ''
      const urlIcon = pub.url ? ` \\href{${pub.url}}{\\faExternalLink}` : ''
      return `\\resumeProjectHeading
{\\titleItem{${escapeLatex(pub.title)}}${urlIcon} \\emph{-- ${escapeLatex(pub.publisher)}}}{${escapeLatex(pub.date || '')}}${descStr}`
    })
    .join('\n')

  return `\\section{Publications}
\\resumeSubHeadingListStart
${items}
\\resumeSubHeadingListEnd`
}

function generateLanguages(languages: ResumeData['languages']): string {
  if (languages.length === 0) return ''
  const items = languages
    .map((lang) => `\\textbf{${escapeLatex(lang.name)}} (${escapeLatex(lang.proficiency)})`)
    .join(', ')

  return `\\section{Languages}
\\subheadingtitlevspace
\\begin{itemize}[leftmargin=0.15in, label={}]
\\item{${items}}
\\end{itemize}`
}

function generateCustomSection(section: { title: string; content: string }): string {
  if (!section.title || !section.content) return ''
  return `\\section{${escapeLatex(section.title)}}
\\begin{itemize}[leftmargin=0.15in, label={}]
\\item{${escapeLatex(section.content)}}
\\end{itemize}`
}
