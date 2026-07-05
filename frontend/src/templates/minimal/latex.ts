import type { ResumeData, SectionOrder, SectionVisibility } from '@/types/resume'
import { escapeLatex } from '@/lib/utils'
import { formatDateRange, generateBulletPoints, getContactParts } from '../shared'

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
    .join('\n')

  return buildMinimalDocument(resume.personalInfo, body)
}

function buildMinimalDocument(
  personalInfo: ResumeData['personalInfo'],
  body: string
): string {
  const name = escapeLatex(personalInfo.fullName || 'Your Name')

  // Minimal uses plain text for contact (no hyperlinks) to keep it clean
  const contactParts = getContactParts(personalInfo, false)
  const contactLine = contactParts.length > 0
    ? contactParts.join(' $\\mid$ ')
    : ''

  const titleLine = personalInfo.professionalTitle
    ? `\\vspace{-2pt}\n\\begin{center}\n\\textit{${escapeLatex(personalInfo.professionalTitle)}}\n\\end{center}`
    : ''

  return `\\documentclass[10pt,a4paper]{article}

\\usepackage[T1]{fontenc}
\\usepackage[scaled=0.9]{helvet}
\\renewcommand{\\familydefault}{\\sfdefault}
\\usepackage[margin=0.3in]{geometry}
\\usepackage{savetrees}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{titlesec}
\\usepackage{xcolor}

\\pagestyle{empty}
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{0pt}
\\linespread{0.95}

\\titleformat{\\section}{\\bfseries\\small}{}{0em}{\\MakeUppercase}[\\vspace{-0.4ex}\\titlerule]
\\titlespacing*{\\section}{0pt}{2pt}{4pt}

\\setlist[itemize]{nosep, leftmargin=1.2em, label=\\textendash, topsep=0pt, itemsep=0pt}

\\hypersetup{
    colorlinks=true,
    linkcolor=black,
    urlcolor=black
}

\\begin{document}

\\begin{center}
{\\Large\\textbf{${name}}}
${titleLine}
${contactLine ? `\\vspace{-4pt}\\begin{center}\n${contactLine}\n\\end{center}` : ''}
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
      const dateRange = formatDateRange(exp.startDate, exp.endDate, exp.current)
      const bullets = generateBulletPoints(exp.bulletPoints)

      return `\\textbf{${escapeLatex(exp.position)}} \\hfill ${dateRange} \\\\
${escapeLatex(exp.company)}${exp.location ? ` $|$ ${escapeLatex(exp.location)}` : ''}
${bullets}`
    })
    .join('\n\n\\vspace{3pt}\n')

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
      const bullets = generateBulletPoints(proj.bulletPoints)
      const techLine =
        proj.technologies.length > 0
          ? `\n\\textbf{Tech:} ${escapeLatex(proj.technologies.join(', '))}`
          : ''
      const links = [proj.githubUrl, proj.liveDemoUrl].filter((l): l is string => !!l)
      const linkLine = links.length > 0
        ? `\n${links.map((l) => `\\url{${l}}`).join(' \\quad ')}`
        : ''

      return `\\textbf{${escapeLatex(proj.name)}}${dateLine} \\\\
${descLine}${bullets}${techLine}${linkLine}`
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
      const issuerStr = cert.issuer ? ` \\textendash{} ${escapeLatex(cert.issuer)}` : ''
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
      const dateStr = pub.date ? ` \\hfill ${escapeLatex(pub.date)}` : ''
      return `\\textbf{${escapeLatex(pub.title)}}${dateStr}\n\\textit{${escapeLatex(pub.publisher)}}`
    })
    .join(' \\\\\n\n')

  return `\\section{Publications}

${items}`
}

function generateLanguages(languages: ResumeData['languages']): string {
  if (languages.length === 0) return ''
  const items = languages
    .map((lang) => `\\textbf{${escapeLatex(lang.name)}} (${escapeLatex(lang.proficiency)})`)
    .join(', ')

  return `\\section{Languages}

${items}`
}

function generateCustomSection(section: { title: string; content: string }): string {
  if (!section.title || !section.content) return ''
  return `\\section{${escapeLatex(section.title)}}

${escapeLatex(section.content)}`
}
