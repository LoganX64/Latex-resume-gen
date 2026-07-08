import type { ResumeData, SectionOrder, SectionVisibility } from '@/types/resume'
import { escapeLatex } from '@/lib/utils'
import { formatDateRange, generateBulletPoints, getContactParts } from '../shared'

export function generateCompactLatex(
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

  return buildCompactDocument(resume.personalInfo, body)
}

function buildCompactDocument(
  personalInfo: ResumeData['personalInfo'],
  body: string
): string {
  const name = escapeLatex(personalInfo.fullName || 'Your Name')
  const title = personalInfo.professionalTitle
    ? `\\ \\textit{\\textbar\\ ${escapeLatex(personalInfo.professionalTitle)}}`
    : ''

  const contactParts = getContactParts(personalInfo, false)
  const contactLine = contactParts.length > 0
    ? `\\\\[1pt]{\\small ${contactParts.join(' $\\cdot$ ')}}`
    : ''

  return `\\documentclass[9pt,a4paper]{article}

\\usepackage[T1]{fontenc}
\\usepackage{lmodern}
\\usepackage[scaled=0.9]{helvet}
\\renewcommand{\\familydefault}{\\sfdefault}
\\usepackage[margin=0.3in]{geometry}

\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{titlesec}
\\usepackage{xcolor}
\\usepackage{tabularx}

\\pagestyle{empty}
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{0pt}
\\linespread{0.95}

\\titleformat{\\section}{\\normalsize\\bfseries}{}{0em}{\\MakeUppercase}[\\vspace{-1.5ex}\\rule{\\textwidth}{0.5pt}]
\\titlespacing*{\\section}{0pt}{1pt}{1pt}

\\setlist[itemize]{nosep, leftmargin=1.2em, label=\\textbullet, topsep=0pt, itemsep=0pt}

\\hypersetup{
    colorlinks=true,
    linkcolor=black,
    urlcolor=black
}

\\begin{document}

\\begin{center}
{\\large\\textbf{${name}}${title}}
${contactLine}
\\end{center}

\\vspace{-8pt}
\\noindent\\rule{\\textwidth}{0.4pt}

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
  return `\\section{Summary}

${escapeLatex(summary)}`
}

function generateExperience(experience: ResumeData['experience']): string {
  if (experience.length === 0) return ''
  const items = experience
    .map((exp) => {
      const dateRange = formatDateRange(exp.startDate, exp.endDate, exp.current)
      const bullets = generateBulletPoints(exp.bulletPoints)

      return `\\textbf{${escapeLatex(exp.position)}} \\hfill ${dateRange} \\\\
\\textit{${escapeLatex(exp.company)}}${exp.location ? `, ${escapeLatex(exp.location)}` : ''}
${bullets}`
    })
    .join('\n\n\\vspace{3pt}\n')

  return `\\section{Experience}

${items}`
}

function generateSkills(skills: ResumeData['skills']): string {
  if (skills.length === 0) return ''
  const rows: string[] = []
  for (let i = 0; i < skills.length; i += 2) {
    const left = `\\textbf{${escapeLatex(skills[i].name)}}: ${escapeLatex(skills[i].skills.join(', '))}`
    if (i + 1 < skills.length) {
      const right = `\\textbf{${escapeLatex(skills[i + 1].name)}}: ${escapeLatex(skills[i + 1].skills.join(', '))}`
      rows.push(`${left} & ${right} \\\\`)
    } else {
      rows.push(`\\multicolumn{2}{@{}p{\\textwidth}@{}}{${left}} \\\\`)
    }
  }

  return `\\section{Skills}

\\setlength{\\tabcolsep}{0pt}
\\begin{tabularx}{\\textwidth}{@{}>{\\raggedright\\arraybackslash}p{0.48\\textwidth}@{\\hspace{0.04\\textwidth}}>{\\raggedright\\arraybackslash}p{0.48\\textwidth}@{}}
${rows.join('\n')}
\\end{tabularx}`
}

function generateProjects(projects: ResumeData['projects']): string {
  if (projects.length === 0) return ''
  const items = projects
    .map((proj) => {
      const dateLine = proj.duration ? ` \\hfill ${escapeLatex(proj.duration)}` : ''
      const descLine = proj.description ? `${escapeLatex(proj.description)}\n` : ''
      const bullets = generateBulletPoints(proj.bulletPoints)
      const techLine =
        proj.technologies.length > 0
          ? ` \\textit{[${escapeLatex(proj.technologies.join(', '))}]}`
          : ''
      const roleLine = proj.role ? `\\textit{${escapeLatex(proj.role)}}` : ''

      const links: string[] = []
      if (proj.githubUrl) {
        links.push(`GitHub: \\url{${escapeLatex(proj.githubUrl)}}`)
      }
      if (proj.liveDemoUrl) {
        links.push(`Live: \\url{${escapeLatex(proj.liveDemoUrl)}}`)
      }
      const linksLine = links.length > 0 ? `${links.join(' $\\cdot$ ')}` : ''

      return `\\textbf{${escapeLatex(proj.name)}}${techLine}${dateLine} \\\\
${roleLine} \\\\
${descLine}${bullets}${linksLine}`
    })
    .join('\n\n\\vspace{3pt}\n')

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
      const dateRange = formatDateRange(edu.startDate, edu.endDate, false)
      const cgpaLine = edu.cgpa ? ` \\hfill CGPA: ${escapeLatex(edu.cgpa)}` : ''

      return `\\textbf{${degreeLine}} \\hfill ${dateRange} \\\\
${escapeLatex(edu.institution)}${cgpaLine}`
    })
    .join('\n\n')

  return `\\section{Education}

${items}`
}

function generateCertifications(certifications: ResumeData['certifications']): string {
  if (certifications.length === 0) return ''
  const items = certifications
    .map((cert) => {
      const dateStr = cert.date ? ` \\hfill ${escapeLatex(cert.date)}` : ''
      const issuerStr = cert.issuer ? `, ${escapeLatex(cert.issuer)}` : ''
      return `\\textbf{${escapeLatex(cert.name)}}${issuerStr}${dateStr}`
    })
    .join(' \\\\\n')

  return `\\section{Certifications}

${items}`
}

function generateAchievements(achievements: ResumeData['achievements']): string {
  if (achievements.length === 0) return ''
  const items = achievements
    .map((ach) => {
      const dateStr = ach.date ? ` \\hfill ${escapeLatex(ach.date)}` : ''
      return `\\textbf{${escapeLatex(ach.title)}}${dateStr} \\\\
${escapeLatex(ach.description || '')}`
    })
    .join(' \\\\\n')

  return `\\section{Achievements}

${items}`
}

function generatePublications(publications: ResumeData['publications']): string {
  if (publications.length === 0) return ''
  const items = publications
    .map((pub) => {
      const dateStr = pub.date ? ` \\hfill ${escapeLatex(pub.date)}` : ''
      return `\\textbf{${escapeLatex(pub.title)}} -- \\textit{${escapeLatex(pub.publisher)}}${dateStr} \\\\
${escapeLatex(pub.description || '')}`
    })
    .join(' \\\\\n')

  return `\\section{Publications}

${items}`
}

function generateLanguages(languages: ResumeData['languages']): string {
  if (languages.length === 0) return ''
  const items = languages
    .map((lang) => `${escapeLatex(lang.name)}: ${escapeLatex(lang.proficiency)}`)
    .join(', ')

  return `\\section{Languages}

${items}`
}

function generateCustomSection(section: { title: string; content: string }): string {
  if (!section.title || !section.content) return ''
  return `\\section{${escapeLatex(section.title)}}

${escapeLatex(section.content)}`
}
