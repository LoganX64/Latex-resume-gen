import type { ResumeData, SectionOrder, SectionVisibility } from '@/types/resume'
import { escapeLatex } from '@/lib/utils'
import { formatDateRange, generateBulletPoints, getContactParts } from '../shared'

export function generateClassicLatex(
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
    .join('\n\\vspace{3pt}\n')

  return buildClassicDocument(resume.personalInfo, body)
}

function buildClassicDocument(
  personalInfo: ResumeData['personalInfo'],
  body: string
): string {
  const name = escapeLatex(personalInfo.fullName || 'Your Name')
  const title = personalInfo.professionalTitle
    ? `\\\\[2pt]{\\large\\textit{${escapeLatex(personalInfo.professionalTitle)}}}`
    : ''

  const contactParts = getContactParts(personalInfo, false)
  const contactLine = contactParts.length > 0
    ? `\\\\[0pt]{\\small ${contactParts.join(' $\\cdot$ ')}}`
    : ''

  return `\\documentclass[11pt,a4paper]{article}

\\usepackage[T1]{fontenc}
\\usepackage{charter}
\\usepackage[margin=0.5in]{geometry}

\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{titlesec}
\\usepackage{xcolor}

\\pagestyle{empty}
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{0pt}
\\linespread{0.95}

\\titleformat{\\section}{\\large\\bfseries}{}{0em}{\\MakeUppercase}[\\vspace{-0.4ex}\\titlerule]
\\titlespacing*{\\section}{0pt}{0pt}{3pt}

\\setlist[itemize]{nosep, leftmargin=1.5em, label=\\textbullet, topsep=0pt, itemsep=0pt}

\\hypersetup{
    colorlinks=true,
    linkcolor=black,
    urlcolor=blue!70!black
}

\\begin{document}

\\begin{center}
{\\LARGE\\textbf{${name}}}
${title}
${contactLine}
\\end{center}

\\vspace{-13pt}
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
  return `\\section{Professional Summary}

\\small{${escapeLatex(summary)}}`
}

function generateExperience(experience: ResumeData['experience']): string {
  if (experience.length === 0) return ''
  const items = experience
    .map((exp) => {
      const dateRange = formatDateRange(exp.startDate, exp.endDate, exp.current)
      const bullets = generateBulletPoints(exp.bulletPoints)

      return `\\small{\\textbf{${escapeLatex(exp.position)}} \\hfill ${dateRange} \\\\
\\textit{${escapeLatex(exp.company)}}${exp.location ? ` \\hfill ${escapeLatex(exp.location)}` : ''}
${bullets}}`
    })
    .join('\n\n\\vspace{3pt}\n')

  return `\\section{Work Experience}

${items}`
}

function generateSkills(skills: ResumeData['skills']): string {
  if (skills.length === 0) return ''
  const items = skills
    .map((cat) => `\\textbf{${escapeLatex(cat.name)}}: ${escapeLatex(cat.skills.join(', '))}`)
    .join(' \\\\\n')

  return `\\section{Technical Skills}

\\small{${items}}`
}

function generateProjects(projects: ResumeData['projects']): string {
  if (projects.length === 0) return ''
  const items = projects
    .map((proj) => {
      const rolePart = proj.role ? ` -- \\textit{${escapeLatex(proj.role)}}` : ''
      const datePart = proj.duration ? ` \\hfill \\mbox{${escapeLatex(proj.duration)}}` : ''
      const descLine = proj.description ? `\n${escapeLatex(proj.description)}` : ''
      const bullets = generateBulletPoints(proj.bulletPoints)
      const techLine =
        proj.technologies.length > 0
          ? `\n\\textbf{Tech:} ${escapeLatex(proj.technologies.join(', '))}`
          : ''
      const githubLink = proj.githubUrl ? `\\textbf{GitHub:} \\url{${proj.githubUrl}}` : ''
      const demoLink = proj.liveDemoUrl ? `\\textbf{Demo:} \\url{${proj.liveDemoUrl}}` : ''
      const linkLine = githubLink && demoLink
        ? `\n\n${githubLink} | ${demoLink}`
        : githubLink
          ? `\n\n${githubLink}`
          : demoLink
            ? `\n\n${demoLink}`
            : ''

      return `\\small{\\textbf{${escapeLatex(proj.name)}}${rolePart}${datePart} \\\\${descLine}${bullets}${techLine}${linkLine}}`
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

      return `\\small{\\textbf{${degreeLine}} \\hfill ${dateRange} \\\\
\\textit{${escapeLatex(edu.institution)}}${cgpaLine}}`
    })
    .join('\n\n')

  return `\\section{Education}

${items}`
}

function generateCertifications(certifications: ResumeData['certifications']): string {
  if (certifications.length === 0) return ''
  const items = certifications
    .map((cert, i) => {
      const dateStr = cert.date ? ` \\hfill ${escapeLatex(cert.date)}` : ''
      const issuerStr = cert.issuer ? ` \\textendash{} ${escapeLatex(cert.issuer)}` : ''
      const lineBreak = i < certifications.length - 1 ? ' \\\\' : ''
      return `\\textbf{${escapeLatex(cert.name)}}${issuerStr}${dateStr}${lineBreak}`
    })
    .join('\n')

  return `\\section{Certifications}

\\small{${items}}%`
}

function generateAchievements(achievements: ResumeData['achievements']): string {
  if (achievements.length === 0) return ''
  const items = achievements
    .map((ach) => {
      const dateStr = ach.date ? ` \\hfill ${escapeLatex(ach.date)}` : ''
      const descStr = ach.description ? `\\\\\n${escapeLatex(ach.description)}` : ''
      return `\\textbf{${escapeLatex(ach.title)}}${dateStr}${descStr}`
    })
    .join(' \\\\\n\n')

  return `\\section{Achievements}

\\small{${items}}`
}

function generatePublications(publications: ResumeData['publications']): string {
  if (publications.length === 0) return ''
  const items = publications
    .map((pub) => {
      const dateStr = pub.date ? ` \\hfill ${escapeLatex(pub.date)}` : ''
      const publisherPart = pub.publisher ? ` --- \\textit{${escapeLatex(pub.publisher)}}` : ''
      const descStr = pub.description ? `\\\\\n${escapeLatex(pub.description)}` : ''
      return `\\textbf{${escapeLatex(pub.title)}}${publisherPart}${dateStr}${descStr}`
    })
    .join(' \\\\\n')

  return `\\section{Publications}

\\small{${items}}`
}

function generateLanguages(languages: ResumeData['languages']): string {
  if (languages.length === 0) return ''
  const items = languages
    .map((lang) => `\\textbf{${escapeLatex(lang.name)}} (${escapeLatex(lang.proficiency)})`)
    .join(', ')

  return `\\section{Languages}

\\small{${items}}`
}

function generateCustomSection(section: { title: string; content: string }): string {
  if (!section.title || !section.content) return ''
  return `\\section{${escapeLatex(section.title)}}

\\small{${escapeLatex(section.content)}}`
}
