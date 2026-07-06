import type { ResumeData, SectionOrder, SectionVisibility } from '@/types/resume'
import { escapeLatex } from '@/lib/utils'
import { formatDateRange, generateBulletPoints } from '../shared'

export function generateProfessionalLatex(
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

  return buildProfessionalDocument(resume.personalInfo, body)
}

function buildProfessionalDocument(
  personalInfo: ResumeData['personalInfo'],
  body: string
): string {
  const name = escapeLatex(personalInfo.fullName || 'Your Name')

  const headerLines: string[] = []
  headerLines.push(`\\textbf{\\Huge \\scshape ${name}}`)

  if (personalInfo.professionalTitle) {
    headerLines.push(`\\small\\textit{${escapeLatex(personalInfo.professionalTitle)}}`)
  }

  const contactParts: string[] = []
  if (personalInfo.phone) {
    contactParts.push(escapeLatex(personalInfo.phone))
  }
  if (personalInfo.email) {
    contactParts.push(`\\href{mailto:${personalInfo.email}}{\\underline{${escapeLatex(personalInfo.email)}}}`)
  }
  if (personalInfo.linkedin) {
    contactParts.push(`\\href{https://${personalInfo.linkedin}}{\\underline{${escapeLatex(personalInfo.linkedin)}}}`)
  }
  if (personalInfo.github) {
    contactParts.push(`\\href{https://${personalInfo.github}}{\\underline{${escapeLatex(personalInfo.github)}}}`)
  }
  if (personalInfo.website) {
    contactParts.push(`\\href{https://${personalInfo.website}}{\\underline{${escapeLatex(personalInfo.website)}}}`)
  }

  if (contactParts.length > 0) {
    headerLines.push(contactParts.join(' $|$ '))
  }

  const header = headerLines.join(' \\\\\n')

  return `\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{xcolor}
\\usepackage{verbatim}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage[margin=0.5in]{geometry}
\\usepackage{savetrees}
\\usepackage{enumitem}
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
\\setlength{\\parskip}{0pt}

\\titleformat{\\section}{\\scshape\\raggedright\\large}{}{0em}{}[\\vspace{-0.4ex}\\titlerule]
\\titlespacing*{\\section}{0pt}{0pt}{4pt}

\\newcommand{\\resumeItem}[1]{
\\item\\small{
{#1}
}
}

\\newcommand{\\resumeSubheading}[4]{
\\item
\\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
\\textbf{#1} & #2 \\\\
\\textit{\\small#3} & \\textit{\\small #4} \\\\
\\end{tabular*}
}

\\newcommand{\\resumeSubSubheading}[2]{
\\item
\\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
\\textit{\\small#1} & \\textit{\\small #2} \\\\
\\end{tabular*}
}

\\newcommand{\\resumeProjectHeading}[2]{
\\item
\\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
\\small#1 & #2 \\\\
\\end{tabular*}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[nosep, leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}[nosep]}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}}

\\hypersetup{
    colorlinks=true,
    linkcolor=black,
    urlcolor=blue!70!black
}

\\begin{document}

\\begin{center}
${header}
\\end{center}

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
  return `\\section*{Summary}

${escapeLatex(summary)}`
}

function generateExperience(experience: ResumeData['experience']): string {
  if (experience.length === 0) return ''
  const items = experience
    .map((exp) => {
      const dateRange = formatDateRange(exp.startDate, exp.endDate, exp.current)
      const bullets = generateBulletPoints(exp.bulletPoints)

      return `\\resumeSubheading
      {${escapeLatex(exp.position)}}{${dateRange}}
      {${escapeLatex(exp.company)}}{${exp.location ? escapeLatex(exp.location) : ''}}
      ${bullets ? `\\resumeItemListStart\n${bullets.split('\n').filter(l => l.trim().startsWith('\\item')).join('\n')}\n\\resumeItemListEnd` : ''}`
    })
    .join('\n')

  return `\\section{Experience}
\\resumeSubHeadingListStart

${items}

\\resumeSubHeadingListEnd`
}

function generateSkills(skills: ResumeData['skills']): string {
  if (skills.length === 0) return ''
  const items = skills
    .map((cat) => {
      const skills = escapeLatex(cat.skills.join(', '))
      return `\\textbf{${escapeLatex(cat.name)}}: ${skills}`
    })
    .join(' \\\\\n')

  return `\\section{Technical Skills}
\\begin{itemize}[nosep, leftmargin=0.15in, label={}]
\\item{\\small ${items}}
\\end{itemize}`
}

function generateProjects(projects: ResumeData['projects']): string {
  if (projects.length === 0) return ''
  const items = projects
    .map((proj) => {
      const leftCol = proj.role
        ? `\\textbf{${escapeLatex(proj.name)}} — \\textit{${escapeLatex(proj.role)}}`
        : `\\textbf{${escapeLatex(proj.name)}}`

      let item = `\\resumeProjectHeading
{${leftCol}}{${escapeLatex(proj.duration || '')}}`

      if (proj.technologies.length > 0) {
        item += `\n{\\small\\emph{${escapeLatex(proj.technologies.join(', '))}}}\\\\`
      }

      if (proj.description) {
        item += `\n{\\small ${escapeLatex(proj.description)}}\\\\`
      }

      const bullets = proj.bulletPoints.filter((b): b is string => !!b && b.trim() !== '')
      if (bullets.length > 0) {
        item += `\n\\resumeItemListStart\n${bullets.map((b) => `\\resumeItem{${escapeLatex(b)}}`).join('\n')}\n\\resumeItemListEnd`
      }

      const urlParts: string[] = []
      if (proj.githubUrl) {
        urlParts.push(`GitHub: ${escapeLatex(proj.githubUrl)}`)
      }
      if (proj.liveDemoUrl) {
        urlParts.push(`Demo: ${escapeLatex(proj.liveDemoUrl)}`)
      }
      if (urlParts.length > 0) {
        item += `\n{\\small ${urlParts.join(' $|$ ')}}`
      }

      return item
    })
    .join('\n')

  return `\\section{Projects}
\\resumeSubHeadingListStart

${items}

\\resumeSubHeadingListEnd`
}

function generateEducation(education: ResumeData['education']): string {
  if (education.length === 0) return ''
  const items = education
    .map((edu) => {
      const degreeLine = edu.specialization
        ? `${escapeLatex(edu.degree)}, ${escapeLatex(edu.specialization)}`
        : escapeLatex(edu.degree)
      const dateRange = formatDateRange(edu.startDate, edu.endDate, false)

      return `\\resumeSubheading
{${escapeLatex(edu.institution)}}{${dateRange}}
{${degreeLine}}{${edu.cgpa ? `CGPA: ${escapeLatex(edu.cgpa)}` : ''}}`
    })
    .join('\n')

  return `\\section{Education}
\\resumeSubHeadingListStart

${items}

\\resumeSubHeadingListEnd`
}

function generateCertifications(certifications: ResumeData['certifications']): string {
  if (certifications.length === 0) return ''
  const items = certifications
    .map((cert) => {
      const issuerStr = cert.issuer ? ` - ${escapeLatex(cert.issuer)}` : ''
      const dateStr = cert.date ? ` \\textit{${escapeLatex(cert.date)}}` : ''
      return `\\textbf{${escapeLatex(cert.name)}}${issuerStr}${dateStr}`
    })
    .join(' \\\\\n')

  return `\\section{Certifications}
\\begin{itemize}[nosep, leftmargin=0.15in, label={}]
\\item{\\small ${items}}
\\end{itemize}`
}

function generateAchievements(achievements: ResumeData['achievements']): string {
  if (achievements.length === 0) return ''
  const items = achievements
    .map((ach) => {
      const dateStr = ach.date ? ` \\hfill ${escapeLatex(ach.date)}` : ''
      let item = `\\item \\textbf{${escapeLatex(ach.title)}}${dateStr}`
      if (ach.description) {
        item += `\\\\\n${escapeLatex(ach.description)}`
      }
      return item
    })
    .join('\n')

  return `\\section{Achievements}
\\begin{itemize}[nosep, leftmargin=0.15in, label={}]
${items}
\\end{itemize}`
}

function generatePublications(publications: ResumeData['publications']): string {
  if (publications.length === 0) return ''
  const items = publications
    .map((pub) => {
      const dateStr = pub.date ? ` \\hfill ${escapeLatex(pub.date)}` : ''
      let item = `\\item \\textbf{${escapeLatex(pub.title)}}${dateStr}\\\\\n\\textit{${escapeLatex(pub.publisher)}}`
      if (pub.description) {
        item += `\\\\\n${escapeLatex(pub.description)}`
      }
      return item
    })
    .join('\n')

  return `\\section{Publications}
\\begin{itemize}[nosep, leftmargin=0.15in, label={}]
${items}
\\end{itemize}`
}

function generateLanguages(languages: ResumeData['languages']): string {
  if (languages.length === 0) return ''
  const items = languages
    .map((lang) => `\\textbf{${escapeLatex(lang.name)}} (${escapeLatex(lang.proficiency)})`)
    .join(', ')

  return `\\section{Languages}
\\begin{itemize}[nosep, leftmargin=0.15in, label={}]
\\item{\\small ${items}}
\\end{itemize}`
}

function generateCustomSection(section: { title: string; content: string }): string {
  if (!section.title || !section.content) return ''
  return `\\section{${escapeLatex(section.title)}}

${escapeLatex(section.content)}`
}
