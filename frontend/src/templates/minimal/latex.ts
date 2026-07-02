import type { ResumeData, SectionOrder, SectionVisibility } from '@/types/resume'
import { escapeLatex, formatDate } from '@/lib/utils'

export function generateMinimalLatex(
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
    .join('\n\n')

  return buildMinimalDocument(resume.personalInfo, body)
}

function buildMinimalDocument(
  personalInfo: ResumeData['personalInfo'],
  body: string
): string {
  const name = escapeLatex(personalInfo.fullName || 'Your Name')

  const contactParts: string[] = []
  if (personalInfo.email) contactParts.push(escapeLatex(personalInfo.email))
  if (personalInfo.phone) contactParts.push(escapeLatex(personalInfo.phone))
  if (personalInfo.location) contactParts.push(escapeLatex(personalInfo.location))
  if (personalInfo.linkedin) contactParts.push(`\\href{https://${escapeLatex(personalInfo.linkedin)}}{${escapeLatex(personalInfo.linkedin)}}`)
  if (personalInfo.github) contactParts.push(`\\href{https://${escapeLatex(personalInfo.github)}}{${escapeLatex(personalInfo.github)}}`)
  if (personalInfo.website) contactParts.push(`\\href{https://${escapeLatex(personalInfo.website)}}{${escapeLatex(personalInfo.website)}}`)

  const contactLine = contactParts.length > 0
    ? `\\vspace{-4pt}\n\\begin{center}\n${contactParts.join(' $\\mid$ ')}\n\\end{center}`
    : ''

  const titleLine = personalInfo.professionalTitle
    ? `\\vspace{-2pt}\n\\begin{center}\n\\textit{${escapeLatex(personalInfo.professionalTitle)}}\n\\end{center}`
    : ''

  return `\\documentclass[10pt,a4paper]{article}

\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage[margin=0.5in]{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{titlesec}

\\pagestyle{empty}
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{0pt}

\\titleformat{\\section}{\\bfseries\\small\\uppercase}{}{0em}{}[\\titlerule]
\\titlespacing*{\\section}{0pt}{4pt}{2pt}

\\setlist[itemize]{nosep, leftmargin=1.2em, label=\\textbullet}

\\hypersetup{
    colorlinks=true,
    linkcolor=black,
    urlcolor=black,
}

\\begin{document}

\\begin{center}
{\\Large\\textbf{${name}}}
${titleLine}
${contactLine}
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
  return `\\section{Summary}

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
${escapeLatex(exp.company)}${exp.location ? ` \\hfill ${escapeLatex(exp.location)}` : ''}
${bullets ? `\n\\begin{itemize}\n${bullets}\n\\end{itemize}` : ''}`
    })
    .join('\n\n')

  return `\\section{Experience}

${items}`
}

function generateSkills(skills: ResumeData['skills']): string {
  if (skills.length === 0) return ''
  const items = skills
    .map((cat) => `\\textbf{${escapeLatex(cat.name)}}: ${escapeLatex(cat.skills.join(', '))}`)
    .join(' \\\\\n')

  return `\\section{Skills}

${items}`
}

function generateProjects(projects: ResumeData['projects']): string {
  if (projects.length === 0) return ''
  const items = projects
    .map((proj) => {
      const dateLine = proj.duration ? ` \\hfill ${escapeLatex(proj.duration)}` : ''
      const descLine = proj.description ? `\n${escapeLatex(proj.description)}` : ''
      const bullets = (proj.bulletPoints || [])
        .filter(Boolean)
        .map((b) => `  \\item ${escapeLatex(b)}`)
        .join('\n')
      const techLine =
        proj.technologies.length > 0
          ? `\n\\textit{Tech:} ${escapeLatex(proj.technologies.join(', '))}`
          : ''

      return `\\textbf{${escapeLatex(proj.name)}}${dateLine} \\\\
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
${escapeLatex(edu.institution)}`
    })
    .join('\n\n')

  return `\\section{Education}

${items}`
}

function generateCertifications(certifications: ResumeData['certifications']): string {
  if (certifications.length === 0) return ''
  const items = certifications
    .map((cert) => {
      const dateStr = cert.date ? ` \\hfill ${formatDate(cert.date)}` : ''
      return `\\textbf{${escapeLatex(cert.name)}}${cert.issuer ? ` \\textendash{} ${escapeLatex(cert.issuer)}` : ''}${dateStr}`
    })
    .join(' \\\\\n')

  return `\\section{Certifications}

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
