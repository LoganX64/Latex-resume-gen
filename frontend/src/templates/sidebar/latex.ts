import type { ResumeData, SectionOrder, SectionVisibility } from '@/types/resume'
import { escapeLatex, formatDate } from '@/lib/utils'

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
    .map((section) => generateSidebarSection(section.type, resume))
    .filter(Boolean)
    .join('\n\n')

  const main = mainSections
    .map((section) => generateMainSection(section.type, resume))
    .filter(Boolean)
    .join('\n\n')

  return buildSidebarDocument(resume.personalInfo, sidebar, main)
}

function buildSidebarDocument(
  personalInfo: ResumeData['personalInfo'],
  sidebar: string,
  main: string
): string {
  const name = escapeLatex(personalInfo.fullName || 'Your Name')
  const title = personalInfo.professionalTitle
    ? `\\\\[2pt]{\\large\\textit{${escapeLatex(personalInfo.professionalTitle)}}}`
    : ''

  const contactItems: string[] = []
  if (personalInfo.email) contactItems.push(`\\faIcon{envelope}\\ \\href{mailto:${escapeLatex(personalInfo.email)}}{${escapeLatex(personalInfo.email)}}`)
  if (personalInfo.phone) contactItems.push(`\\faIcon{phone}\\ \\href{tel:${escapeLatex(personalInfo.phone)}}{${escapeLatex(personalInfo.phone)}}`)
  if (personalInfo.location) contactItems.push(`\\faIcon{map-marker*}\\ ${escapeLatex(personalInfo.location)}`)
  if (personalInfo.linkedin) contactItems.push(`\\faIcon{linkedin}\\ \\href{https://${escapeLatex(personalInfo.linkedin)}}{${escapeLatex(personalInfo.linkedin)}}`)
  if (personalInfo.github) contactItems.push(`\\faIcon{github}\\ \\href{https://${escapeLatex(personalInfo.github)}}{${escapeLatex(personalInfo.github)}}`)
  if (personalInfo.website) contactItems.push(`\\faIcon{globe}\\ \\href{https://${escapeLatex(personalInfo.website)}}{${escapeLatex(personalInfo.website)}}`)

  const contactBlock = contactItems.length > 0
    ? `\\section*{Contact}
${contactItems.join('\\\\[3pt]\n')}`
    : ''

  return `\\documentclass[11pt,a4paper]{article}

\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{lmodern}
\\usepackage[margin=0]{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{titlesec}
\\usepackage{xcolor}
\\usepackage{fontawesome5}
\\usepackage{tikz}
\\usepackage{graphicx}
\\usepackage{wrapfig}
\\usepackage{calc}

\\pagestyle{empty}
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{0pt}

\\definecolor{sidebar}{HTML}{1a365d}
\\definecolor{sidebartext}{HTML}{ffffff}
\\definecolor{mainbg}{HTML}{f7fafc}

\\geometry{
  top=0.5in,
  bottom=0.5in,
  left=0pt,
  right=0pt,
}

\\titleformat{\\section}{\\large\\bfseries\\color{sidebar}}{}{0em}{}[\\color{sidebar}\\titlerule]
\\titlespacing*{\\section}{0pt}{8pt}{4pt}

\\setlist[itemize]{nosep, leftmargin=1.2em, label=\\textcolor{sidebar}{\\textbullet}}

\\hypersetup{
    colorlinks=true,
    linkcolor=sidebar,
    urlcolor=sidebar,
}

\\newcommand{\\sidebarsection}[1]{%
  \\textbf{\\color{sidebartext}\\large #1}\\\\[-2pt]
  \\textcolor{sidebartext!50}{\\rule{\\linewidth}{0.5pt}}\\\\[4pt]
}

\\begin{document}

\\begin{tikzpicture}[remember picture, overlay]
  \\fill[sidebar] (current page.north west) rectangle ([xshift=6.5cm]current page.south west);
\\end{tikzpicture}

\\begin{minipage}[t]{6cm}
\\color{sidebartext}

\\vspace{0.4in}

\\begin{center}
{\\LARGE\\textbf{${name}}}
${title}
\\end{center}

\\vspace{8pt}

${contactBlock}

\\vspace{8pt}

${sidebar}

\\end{minipage}%
\\hfill%
\\begin{minipage}[t]{\\dimexpr\\paperwidth-6.5cm-2\\parindent}

\\vspace{0.4in}

${main}

\\end{minipage}

\\end{document}`
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
  return `\\section{Professional Summary}

${escapeLatex(summary)}`
}

function generateExperience(experience: ResumeData['experience']): string {
  if (experience.length === 0) return ''
  const items = experience
    .map((exp) => {
      const dateRange = `${formatDate(exp.startDate)} \\textendash{} ${exp.current ? 'Present' : formatDate(exp.endDate)}`
      const bullets = exp.bulletPoints
        .filter(Boolean)
        .map((b) => `  \\item ${escapeLatex(b)}`)
        .join('\n')

      return `\\textbf{${escapeLatex(exp.position)}} \\hfill ${dateRange} \\\\
\\textit{${escapeLatex(exp.company)}}${exp.location ? ` \\hfill ${escapeLatex(exp.location)}` : ''}
${bullets ? `\n\\begin{itemize}\n${bullets}\n\\end{itemize}` : ''}`
    })
    .join('\n\n')

  return `\\section{Experience}

${items}`
}

function generateProjects(projects: ResumeData['projects']): string {
  if (projects.length === 0) return ''
  const items = projects
    .map((proj) => {
      const dateLine = proj.duration ? ` \\hfill ${escapeLatex(proj.duration)}` : ''
      const roleLine = proj.role ? ` \\textit{\\textendash{} ${escapeLatex(proj.role)}}` : ''
      const descLine = proj.description ? `\n${escapeLatex(proj.description)}` : ''
      const bullets = (proj.bulletPoints || [])
        .filter(Boolean)
        .map((b) => `  \\item ${escapeLatex(b)}`)
        .join('\n')
      const techLine =
        proj.technologies.length > 0
          ? `\n\\textit{Technologies:} ${escapeLatex(proj.technologies.join(', '))}`
          : ''

      return `\\textbf{${escapeLatex(proj.name)}}${roleLine}${dateLine} \\\\
${descLine}${bullets ? `\n\\begin{itemize}\n${bullets}\n\\end{itemize}` : ''}${techLine}`
    })
    .join('\n\n')

  return `\\section{Projects}

${items}`
}

function generateEducation(education: ResumeData['education']): string {
  if (education.length === 0) return ''
  const items = education
    .map((edu) => {
      const degreeLine = edu.specialization
        ? `${escapeLatex(edu.degree)} in ${escapeLatex(edu.specialization)}`
        : escapeLatex(edu.degree)
      const dateRange = `${formatDate(edu.startDate)} \\textendash{} ${formatDate(edu.endDate)}`
      const cgpaLine = edu.cgpa ? ` \\hfill CGPA: ${escapeLatex(edu.cgpa)}` : ''

      return `\\textbf{${degreeLine}} \\hfill ${dateRange}${cgpaLine} \\\\
\\textit{${escapeLatex(edu.institution)}}`
    })
    .join('\n\n')

  return `\\section{Education}

${items}`
}

function generateSidebarSkills(skills: ResumeData['skills']): string {
  if (skills.length === 0) return ''
  const items = skills
    .map((cat) => `${escapeLatex(cat.name)}: ${escapeLatex(cat.skills.join(', '))}`)
    .join('\\\\[2pt]\n')

  return `\\sidebarsection{Skills}

${items}`
}

function generateSidebarLanguages(languages: ResumeData['languages']): string {
  if (languages.length === 0) return ''
  const items = languages
    .map((lang) => `${escapeLatex(lang.name)} \\hfill ${escapeLatex(lang.proficiency)}`)
    .join('\\\\[2pt]\n')

  return `\\sidebarsection{Languages}

${items}`
}

function generateSidebarCertifications(certifications: ResumeData['certifications']): string {
  if (certifications.length === 0) return ''
  const items = certifications
    .map((cert) => `${escapeLatex(cert.name)}${cert.issuer ? ` -- ${escapeLatex(cert.issuer)}` : ''}`)
    .join('\\\\[2pt]\n')

  return `\\sidebarsection{Certifications}

${items}`
}

function generateAchievements(achievements: ResumeData['achievements']): string {
  if (achievements.length === 0) return ''
  const items = achievements
    .map((ach) => {
      const dateStr = ach.date ? ` \\hfill ${formatDate(ach.date)}` : ''
      const descStr = ach.description ? `\n${escapeLatex(ach.description)}` : ''
      return `\\textbf{${escapeLatex(ach.title)}}${dateStr}${descStr}`
    })
    .join(' \\\\\n\n')

  return `\\section{Achievements}

${items}`
}

function generatePublications(publications: ResumeData['publications']): string {
  if (publications.length === 0) return ''
  const items = publications
    .map((pub) => {
      const dateStr = pub.date ? ` \\hfill ${formatDate(pub.date)}` : ''
      const descStr = pub.description ? `\n${escapeLatex(pub.description)}` : ''
      return `\\textbf{${escapeLatex(pub.title)}} \\textit{\\textendash{} ${escapeLatex(pub.publisher)}}${dateStr}${descStr}`
    })
    .join(' \\\\\n\n')

  return `\\section{Publications}

${items}`
}

function generateCustomSection(section: { title: string; content: string }): string {
  if (!section.title || !section.content) return ''
  return `\\section{${escapeLatex(section.title)}}

${escapeLatex(section.content)}`
}
