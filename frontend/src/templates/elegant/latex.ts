import type { ResumeData, SectionOrder, SectionVisibility } from '@/types/resume'
import { escapeLatex } from '@/lib/utils'
import { formatDateRange, generateBulletPoints, getContactParts, wrapPhotoHeader } from '../shared'

export function generateElegantLatex(
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

  return buildElegantDocument(resume.personalInfo, body)
}

function buildElegantDocument(
  personalInfo: ResumeData['personalInfo'],
  body: string
): string {
  const name = escapeLatex(personalInfo.fullName || 'Your Name')
  const title = personalInfo.professionalTitle
    ? `\\\\[3pt]{\\large\\color{accent}\\textit{${escapeLatex(personalInfo.professionalTitle)}}}`
    : ''

  const contactParts = getContactParts(personalInfo, false)
  const contactLine = contactParts.length > 0
    ? `\\\\[2pt]{\\small\\color{accent} ${contactParts.join(' $\\cdot$ ')}}`
    : ''

  let headerBlock = ''
  if (personalInfo.profileImage) {
    const titleText = personalInfo.professionalTitle
      ? `\\\\{\\large\\color{accent}\\textit{${escapeLatex(personalInfo.professionalTitle)}}}`
      : ''
    const contactLineLeft = contactParts.length > 0
      ? `\\\\{\\small\\color{accent} ${contactParts.join(' $\\cdot$ ')}}`
      : ''
    const leftText = `{\\LARGE\\textbf{${name}}}${titleText}${contactLineLeft}`
    headerBlock = wrapPhotoHeader(personalInfo, leftText, 0.15)
  } else {
    headerBlock = `\\begin{center}
{\\LARGE\\textbf{${name}}}
${title}
${contactLine}
\\end{center}
\\vspace{-2pt}
\\noindent{\\color{accent}\\rule{\\textwidth}{0.5pt}}`
  }

  return `\\documentclass[10pt,a4paper]{article}

\\usepackage[T1]{fontenc}
\\usepackage{ebgaramond}
\\usepackage[margin=0.3in]{geometry}
\\usepackage{savetrees}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{titlesec}
\\usepackage{xcolor}
\\usepackage{microtype}
\\usepackage{graphicx}

\\pagestyle{empty}
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{0pt}
\\linespread{0.95}

\\definecolor{accent}{HTML}{4a5568}

\\titleformat{\\section}{\\large\\bfseries\\color{accent}}{}{0em}{}[\\color{accent}\\rule{\\textwidth}{0.5pt}]
\\titlespacing*{\\section}{0pt}{2pt}{0pt}

\\setlist[itemize]{nosep, leftmargin=1.5em, label=\\textcolor{accent}{\\textendash{}}, topsep=0pt, itemsep=0pt}

\\hypersetup{
    colorlinks=true,
    linkcolor=accent,
    urlcolor=accent
}

\\begin{document}

${headerBlock}

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

${escapeLatex(summary)}`
}

// Reuse helper for experience
function generateExperience(experience: ResumeData['experience']): string {
  if (experience.length === 0) return ''
  const items = experience
    .map((exp) => {
      const dateRange = formatDateRange(exp.startDate, exp.endDate, exp.current)
      const bullets = generateBulletPoints(exp.bulletPoints)

      return `\\textbf{${escapeLatex(exp.position)}} \\hfill \\textit{${dateRange}} \\\\
\\textit{\\color{accent}${escapeLatex(exp.company)}}${exp.location ? ` \\hfill ${escapeLatex(exp.location)}` : ''}
${bullets}`
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
      const roleLine = proj.role ? `\n\\textit{${escapeLatex(proj.role)}}` : ''
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

      return `\\textbf{${escapeLatex(proj.name)}}${roleLine}${dateLine} \\\\
${descLine}${bullets}${techLine}${linkLine}`
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
      const dateRange = formatDateRange(edu.startDate, edu.endDate, false)
      const cgpaLine = edu.cgpa ? ` \\hfill CGPA: ${escapeLatex(edu.cgpa)}` : ''

      return `\\textbf{${degreeLine}} \\hfill ${dateRange} \\\\
\\textit{${escapeLatex(edu.institution)}}${cgpaLine}`
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
    .map((lang) => `\\textbf{${escapeLatex(lang.name)}} \\textendash{} ${escapeLatex(lang.proficiency)}`)
    .join(', ')

  return `\\section{Languages}

${items}`
}

function generateCustomSection(section: { title: string; content: string }): string {
  if (!section.title || !section.content) return ''
  return `\\section{${escapeLatex(section.title)}}

${escapeLatex(section.content)}`
}
