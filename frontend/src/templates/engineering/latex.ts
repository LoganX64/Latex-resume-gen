import type { ResumeData, SectionOrder, SectionVisibility } from '@/types/resume'
import { escapeLatex } from '@/lib/utils'
import { formatDateRange, generateBulletPoints, getContactParts } from '../shared'

export function generateEngineeringLatex(
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

  return buildEngineeringDocument(resume.personalInfo, body)
}

function buildEngineeringDocument(
  personalInfo: ResumeData['personalInfo'],
  body: string
): string {
  const name = escapeLatex(personalInfo.fullName || 'Your Name')
  const title = personalInfo.professionalTitle
    ? `\\\\[2pt]{\\large\\color{darkblue}\\textit{${escapeLatex(personalInfo.professionalTitle)}}}`
    : ''

  const contactParts = getContactParts(personalInfo, true)
  const contactLine = contactParts.length > 0
    ? `\\\\[2pt]{\\small\\textit{${contactParts.join(' $\\mid$ ')}}}`
    : ''

  let headerBlock = ''
  if (personalInfo.profileImage) {
    const titleText = personalInfo.professionalTitle
      ? `\\\\{\\large\\color{darkblue}\\textit{${escapeLatex(personalInfo.professionalTitle)}}}`
      : ''
    const contactLineLeft = contactParts.length > 0
      ? `\\\\{\\small\\textit{${contactParts.join(' $\\mid$ ')}}}`
      : ''
    const leftText = `{\\LARGE\\textbf{\\color{darkblue}${name}}}${titleText}${contactLineLeft}`
    const photoWidth = 0.09
    const leftWidth = 1.0 - photoWidth - 0.04
    headerBlock = `\\begin{minipage}[t]{${leftWidth.toFixed(2)}\\textwidth}%
\\vspace{0pt}
${leftText}
\\end{minipage}%
\\hfill%
\\begin{minipage}[t]{${photoWidth.toFixed(2)}\\textwidth}%
\\vspace{0pt}
\\raggedleft
\\IfFileExists{profile.png}{\\begin{tikzpicture}[baseline=(current bounding box.north)]\\clip[rounded corners=8pt] (0,0) rectangle (\\linewidth,\\linewidth);\\node at (\\linewidth/2,\\linewidth/2) {\\includegraphics[width=\\linewidth,height=\\linewidth,keepaspectratio]{profile.png}};\\end{tikzpicture}}{}
\\end{minipage}
\\par\\vspace{4pt}
\\noindent{\\color{darkblue}\\rule{\\textwidth}{1.5pt}}`
  } else {
    headerBlock = `\\begin{center}
{\\LARGE\\textbf{\\color{darkblue}${name}}}
${title}
${contactLine}
\\end{center}
\\vspace{-2pt}
\\noindent{\\color{darkblue}\\rule{\\textwidth}{1.5pt}}`
  }

  return `\\documentclass[11pt,a4paper]{article}

\\usepackage[T1]{fontenc}
\\usepackage[scaled=0.9]{helvet}
\\renewcommand{\\familydefault}{\\sfdefault}
\\usepackage[margin=0.5in]{geometry}

\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{titlesec}
\\usepackage{xcolor}
\\usepackage{tabularx}
\\usepackage{graphicx}
\\usepackage{tikz}
\\usepackage{fontawesome}

\\pagestyle{empty}
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{0pt}
\\linespread{0.95}

\\definecolor{darkblue}{HTML}{1e3a5f}
\\definecolor{lightgray}{HTML}{f0f0f0}

\\titleformat{\\section}{\\normalsize\\bfseries\\color{darkblue}}{}{0em}{}[\\vspace{-1.5ex}\\color{darkblue}\\rule{\\textwidth}{1pt}]
\\titlespacing*{\\section}{0pt}{2pt}{0pt}

\\setlist[itemize]{nosep, leftmargin=1.5em, label=\\textcolor{darkblue}{\\textbullet}, topsep=0pt, itemsep=0pt}

\\hypersetup{
    colorlinks=true,
    linkcolor=darkblue,
    urlcolor=darkblue
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

  return `\\section{Technical Skills}

\\small{{\\linespread{0.90}\\selectfont
\\renewcommand{\\arraystretch}{1.0}
\\setlength{\\tabcolsep}{0pt}
\\begin{tabularx}{\\textwidth}{@{}>{\\raggedright\\arraybackslash}p{0.48\\textwidth}@{\\hspace{0.04\\textwidth}}>{\\raggedright\\arraybackslash}p{0.48\\textwidth}@{}}
${rows.join('\n')}
\\end{tabularx}}}`
}

function generateProjects(projects: ResumeData['projects']): string {
  if (projects.length === 0) return ''
  const items = projects
    .map((proj) => {
      const dateLine = proj.duration ? ` \\hfill \\textcolor{gray}{${escapeLatex(proj.duration)}}` : ''
      const roleLine = proj.role ? ` \\textit{${escapeLatex(proj.role)}}` : ''
      const descLine = proj.description ? `${escapeLatex(proj.description)}` : ''
      const bullets = generateBulletPoints(proj.bulletPoints)
      const techLine =
        proj.technologies.length > 0
          ? `\\textbf{Tech:} \\textcolor{darkblue}{${escapeLatex(proj.technologies.join(', '))}}`
          : ''
      const linkParts: string[] = []
      if (proj.githubUrl) {
        linkParts.push(`\\textbf{GitHub:} \\url{${proj.githubUrl}}`)
      }
      if (proj.liveDemoUrl) {
        linkParts.push(`\\textbf{Live:} \\url{${proj.liveDemoUrl}}`)
      }
      const linkLine = linkParts.length > 0
        ? `${linkParts.join(' \\quad ')}`
        : ''

      return `\\small{\\textbf{${escapeLatex(proj.name)}}${roleLine}${dateLine} \\\\[0pt]
${descLine}
${bullets}
${techLine} \\\\
${linkLine}}`
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
      const cgpaLine = edu.cgpa ? ` \\hfill CGPA: \\textbf{${escapeLatex(edu.cgpa)}}` : ''

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
    .map((cert) => {
      const dateStr = cert.date ? ` \\hfill ${escapeLatex(cert.date)}` : ''
      const issuerStr = cert.issuer ? ` \\textendash{} ${escapeLatex(cert.issuer)}` : ''
      const urlIcon = cert.url ? ` \\href{${cert.url}}{\\faExternalLink}` : ''
      return `\\textbf{${escapeLatex(cert.name)}}${urlIcon}${issuerStr}${dateStr}`
    })
    .join(' \\\\\n')

  return `\\section{Certifications}

\\small{${items}}`
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
      const descStr = pub.description ? `\\\\\n${escapeLatex(pub.description)}` : ''
      const urlIcon = pub.url ? ` \\href{${pub.url}}{\\faExternalLink}` : ''
      return `\\textbf{${escapeLatex(pub.title)}}${urlIcon} \\textit{\\textendash{} ${escapeLatex(pub.publisher)}}${dateStr}${descStr}`
    })
    .join(' \\\\\n')

  return `\\section{Publications}

\\small{${items}}`
}

function generateLanguages(languages: ResumeData['languages']): string {
  if (languages.length === 0) return ''
  const items = languages
    .map((lang) => `\\textbf{${escapeLatex(lang.name)}} \\textendash{} ${escapeLatex(lang.proficiency)}`)
    .join(', ')

  return `\\section{Languages}

\\small{${items}}`
}

function generateCustomSection(section: { title: string; content: string }): string {
  if (!section.title || !section.content) return ''
  return `\\section{${escapeLatex(section.title)}}

\\small{${escapeLatex(section.content)}}`
}
