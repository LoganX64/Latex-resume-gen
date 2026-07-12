import type { ResumeData, SectionOrder, SectionVisibility } from '@/types/resume'
import { escapeLatex } from '@/lib/utils'
import { formatDateRange, generateBulletPoints } from '../shared'

export function generateSidebarLatex(
  resume: ResumeData,
  sectionOrder: SectionOrder[],
  sectionVisibility: SectionVisibility
): string {
  const sections = sectionOrder.filter(
    (s) => sectionVisibility[s.type] ?? false
  )

  const sidebarSections = sections.filter((s) =>
    ['skills', 'languages', 'certifications'].includes(s.type)
  )
  const mainSections = sections.filter((s) =>
    !['skills', 'languages', 'certifications'].includes(s.type)
  )

  const sidebar = sidebarSections
    .map((section) => {
      const content = generateSidebarSection(section.type, resume)
      if (!content) return ''
      const spacing = section.type === 'skills' ? '3pt' : '2pt'
      return `\n\\vspace*{${spacing}}\n${content}`
    })
    .filter(Boolean)
    .join('\n')

  const main = mainSections
    .map((section) => generateMainSection(section.type, resume))
    .filter(Boolean)
    .join('\n\n\\vspace{4pt}\n')

  return buildSidebarDocument(resume.personalInfo, sidebar, main)
}

function buildSidebarDocument(
  personalInfo: ResumeData['personalInfo'],
  sidebar: string,
  main: string
): string {
  const name = escapeLatex(personalInfo.fullName || 'Your Name')
  const title = personalInfo.professionalTitle
    ? `\\\\[1pt]{\\small\\textit{${escapeLatex(personalInfo.professionalTitle)}}}`
    : ''

  const contactBlock = personalInfo.email || personalInfo.phone || personalInfo.location || personalInfo.linkedin || personalInfo.github || personalInfo.website
    ? `\\begingroup\\hypersetup{urlcolor=sidebartext}\n${buildSidebarContactBlock(personalInfo)}\n\\endgroup`
    : ''

  const photoBlock = personalInfo.profileImage
    ? `\\IfFileExists{profile.png}{\\begin{tikzpicture}\\begin{scope}\\clip circle (1.48cm);\\node[inner sep=0pt] {\\includegraphics[width=2.96cm,height=2.96cm,keepaspectratio]{profile.png}};\\end{scope}\\draw[white, thick] circle (1.48cm);\\end{tikzpicture}\\\\[8pt]}{} `
    : ''

  return `\\documentclass[11pt,a4paper]{article}

\\usepackage[T1]{fontenc}
\\usepackage{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{titlesec}
\\usepackage{xcolor}
\\usepackage{tikz}
\\usepackage{graphicx}
\\usepackage{calc}

\\pagestyle{empty}
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{0pt}
\\linespread{0.95}

\\definecolor{sidebar}{HTML}{1a365d}
\\definecolor{sidebartext}{HTML}{ffffff}

\\geometry{
  top=0.3in,
  bottom=0.3in,
  left=0.15in,
  right=0.25in,
}

\\titleformat{\\section}{\\normalsize\\bfseries\\color{sidebar}}{}{0em}{}[\\vspace{-0.4ex}\\color{sidebar}\\titlerule]
\\titlespacing*{\\section}{0pt}{2pt}{4pt}

\\setlist[itemize]{nosep, leftmargin=1.2em, label=\\textcolor{sidebar}{\\textbullet}, topsep=0pt, itemsep=0pt}

\\hypersetup{
    colorlinks=true,
    linkcolor=sidebartext,
    urlcolor=sidebar
}

\\newcommand{\\sidebarsection}[1]{%
  \\noindent{\\textbf{\\color{sidebartext}\\normalsize\\MakeUppercase{#1}}}\\\\[-\\baselineskip+3pt]
  \\textcolor{sidebartext!50}{\\rule{\\dimexpr\\linewidth-\\leftskip-\\rightskip-4pt}{0.4pt}}\\\\[0pt]
}

\\begin{document}

\\begin{tikzpicture}[remember picture, overlay]
  \\fill[sidebar] (current page.north west) rectangle ([xshift=5.8cm+12pt]current page.south west);
\\end{tikzpicture}%

\\begin{minipage}[t]{5.8cm}
\\color{sidebartext}
\\leftskip=12pt \\rightskip=12pt

\\vspace{0.3in}

\\begin{center}
${photoBlock}
{\\Large\\textbf{${name}}}
${title}
\\end{center}

${contactBlock}

${sidebar}

\\end{minipage}%
\\hfill%
\\begin{minipage}[t]{\\dimexpr\\paperwidth-5.8cm-36pt}

\\vspace{0.3in}
\\hspace{24pt}

${main}

\\end{minipage}

\\end{document}`
}

function buildSidebarContactBlock(personalInfo: ResumeData['personalInfo']): string {
  const items: string[] = []

  if (personalInfo.email) {
    items.push(`\\mbox{@}\\ \\href{mailto:${personalInfo.email}}{${escapeLatex(personalInfo.email)}}`)
  }
  if (personalInfo.phone) {
    items.push(`\\#\\ ${escapeLatex(personalInfo.phone)}`)
  }
  if (personalInfo.location) {
    items.push(`*\\ ${escapeLatex(personalInfo.location)}`)
  }
  if (personalInfo.linkedin) {
    items.push(`in\\ \\href{https://${personalInfo.linkedin}}{${escapeLatex(personalInfo.linkedin)}}`)
  }
  if (personalInfo.github) {
    items.push(`gh\\ \\href{https://${personalInfo.github}}{${escapeLatex(personalInfo.github)}}`)
  }
  if (personalInfo.website) {
    items.push(`www\\ \\href{https://${personalInfo.website}}{${escapeLatex(personalInfo.website)}}`)
  }

  if (items.length === 0) return ''

  return items.join('\\\\[2pt]\n')
}

function generateSidebarSection(type: string, resume: ResumeData): string {
  switch (type) {
    case 'skills':
      return generateSidebarSkills(resume.skills)
    case 'languages':
      return generateSidebarLanguages(resume.languages)
    case 'certifications':
      return generateSidebarCertifications(resume.certifications)
    default:
      return ''
  }
}

function generateMainSection(type: string, resume: ResumeData): string {
  switch (type) {
    case 'summary':
      return generateSummary(resume.summary)
    case 'experience':
      return generateExperience(resume.experience)
    case 'projects':
      return generateProjects(resume.projects)
    case 'education':
      return generateEducation(resume.education)
    case 'achievements':
      return generateAchievements(resume.achievements)
    case 'publications':
      return generatePublications(resume.publications)
    case 'customSections':
      return resume.customSections.map((cs) => generateCustomSection(cs)).join('\n\n')
    default:
      return ''
  }
}

function generateSummary(summary: string): string {
  if (!summary) return ''
  return `\\section{PROFESSIONAL SUMMARY}

${escapeLatex(summary)}`
}

function generateExperience(experience: ResumeData['experience']): string {
  if (experience.length === 0) return ''
  const items = experience
    .map((exp) => {
      const dateRange = formatDateRange(exp.startDate, exp.endDate, exp.current)
      const bullets = generateBulletPoints(exp.bulletPoints)

      return `\\textbf{${escapeLatex(exp.position)}} \\hfill \\small ${dateRange} \\\\[1pt]
\\textit{${escapeLatex(exp.company)}}${exp.location ? ` \\hfill \\small ${escapeLatex(exp.location)}` : ''}
${bullets}`
    })
    .join('\n\n\\vspace{6pt}\n')

  return `\\section{EXPERIENCE}

${items}`
}

function generateProjects(projects: ResumeData['projects']): string {
  if (projects.length === 0) return ''
  const items = projects
    .map((proj) => {
      const dateLine = proj.duration ? ` \\hfill \\small ${escapeLatex(proj.duration)}` : ''
      const roleLine = proj.role ? `\n\\textit{${escapeLatex(proj.role)}}` : ''
      const descLine = proj.description ? `${escapeLatex(proj.description)}` : ''
      const bullets = generateBulletPoints(proj.bulletPoints)
      const techLine =
        proj.technologies.length > 0
          ? `\n\\textbf{Tech:} \\small ${escapeLatex(proj.technologies.join(', '))}`
          : ''
      const links: string[] = []
      if (proj.githubUrl) links.push(`GitHub: \\url{${proj.githubUrl}}`)
      if (proj.liveDemoUrl) links.push(`Live: \\url{${proj.liveDemoUrl}}`)
      const linkLine = links.length > 0
        ? `\\\\\n\\small ${links.join(' \\quad ')}`
        : ''

      return `\\textbf{${escapeLatex(proj.name)}}${roleLine}${dateLine} \\\\
${descLine}${bullets}${techLine}${linkLine}`
    })
    .join('\n\n\\vspace{6pt}\n')

  return `\\section{PROJECTS}

${items}`
}

function generateEducation(education: ResumeData['education']): string {
  if (education.length === 0) return ''
  const items = education
    .map((edu) => {
      const degreeLine = edu.specialization
        ? `${escapeLatex(edu.degree)} in ${escapeLatex(edu.specialization)}`
        : escapeLatex(edu.degree)
      const dateRange = formatDateRange(edu.startDate, edu.endDate, false)
      const cgpaLine = edu.cgpa ? ` \\hfill CGPA: ${escapeLatex(edu.cgpa)}` : ''

      return `\\textbf{${degreeLine}} \\hfill \\small ${dateRange} \\\\[1pt]
\\textit{${escapeLatex(edu.institution)}}${cgpaLine}`
    })
    .join('\n\n\\vspace{6pt}\n')

  return `\\section{EDUCATION}

${items}`
}

function generateSidebarSkills(skills: ResumeData['skills']): string {
  if (skills.length === 0) return ''
  const items = skills
    .map((cat) => `\\textbf{${escapeLatex(cat.name)}}\\\\\n{\\small ${escapeLatex(cat.skills.join(', '))}}`)
    .join('\\\\[2pt]\n')

  return `\\sidebarsection{Skills}
${items}\\\\[0pt]`
}

function generateSidebarLanguages(languages: ResumeData['languages']): string {
  if (languages.length === 0) return ''
  const items = languages
    .map((lang) => {
      const proficiency = lang.proficiency ? `\\\\{\\scriptsize ${escapeLatex(lang.proficiency)}}` : ''
      return `{\\scriptsize \\textbf{${escapeLatex(lang.name)}}${proficiency}}`
    })
    .join('\\\\[0pt]\n')

  return `\\sidebarsection{Languages}
${items}\\\\[0pt]`
}

function generateSidebarCertifications(certifications: ResumeData['certifications']): string {
  if (certifications.length === 0) return ''
  const items = certifications
    .map((cert) => {
      const issuer = cert.issuer ? `\\\\{\\scriptsize ${escapeLatex(cert.issuer)}}` : ''
      return `{\\scriptsize \\textbf{${escapeLatex(cert.name)}}${issuer}}`
    })
    .join('\\\\[0pt]\n')

  return `\\sidebarsection{Certifications}
${items}\\\\[0pt]`
}

function generateAchievements(achievements: ResumeData['achievements']): string {
  if (achievements.length === 0) return ''
  const items = achievements
    .map((ach) => {
      const dateStr = ach.date ? ` \\hfill \\small ${escapeLatex(ach.date)}` : ''
      const descStr = ach.description ? `\\\\\n\\small ${escapeLatex(ach.description)}` : ''
      return `\\textbf{${escapeLatex(ach.title)}}${dateStr}${descStr}`
    })
    .join(' \\\\\n\n')

  return `\\section{ACHIEVEMENTS}

${items}`
}

function generatePublications(publications: ResumeData['publications']): string {
  if (publications.length === 0) return ''
  const items = publications
    .map((pub) => {
      const dateStr = pub.date ? ` \\hfill \\small ${escapeLatex(pub.date)}` : ''
      const descStr = pub.description ? `\\\\\n\\small ${escapeLatex(pub.description)}` : ''
      return `\\textbf{${escapeLatex(pub.title)}} \\textit{\\textendash{} ${escapeLatex(pub.publisher)}}${dateStr}${descStr}`
    })
    .join(' \\\\\n\n')

  return `\\section{PUBLICATIONS}

${items}`
}

function generateCustomSection(section: { title: string; content: string }): string {
  if (!section.title || !section.content) return ''
  return `\\section{${escapeLatex(section.title)}}

${escapeLatex(section.content)}`
}
