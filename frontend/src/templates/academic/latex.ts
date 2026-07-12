import type { ResumeData, SectionOrder, SectionVisibility } from '@/types/resume'
import { escapeLatex } from '@/lib/utils'
import { formatDateRange, generateBulletPoints } from '../shared'

export function generateAcademicLatex(
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

  return buildAcademicDocument(resume.personalInfo, body)
}

function buildAcademicDocument(
  personalInfo: ResumeData['personalInfo'],
  body: string
): string {
  const name = escapeLatex(personalInfo.fullName || 'Your Name')

  const contactItems: string[] = []
  if (personalInfo.email) {
    const escaped = escapeLatex(personalInfo.email)
    contactItems.push(`\\href{mailto:${personalInfo.email}}{${escaped}}`)
  }
  if (personalInfo.phone) {
    contactItems.push(escapeLatex(personalInfo.phone))
  }
  if (personalInfo.linkedin) {
    const escaped = escapeLatex(personalInfo.linkedin)
    contactItems.push(`\\href{https://${personalInfo.linkedin}}{${escaped}}`)
  }
  if (personalInfo.github) {
    const escaped = escapeLatex(personalInfo.github)
    contactItems.push(`\\href{https://${personalInfo.github}}{${escaped}}`)
  }
  if (personalInfo.website) {
    const escaped = escapeLatex(personalInfo.website)
    contactItems.push(`\\href{https://${personalInfo.website}}{${escaped}}`)
  }
  const contactLine = contactItems.length > 0
    ? `\\\\[0pt]{\\small ${contactItems.join(' $\\mid$ ')}}`
    : ''

  const titleParts = [personalInfo.professionalTitle, personalInfo.location].filter(Boolean)
  const titleLine = titleParts.length > 0
    ? `\\\\[2pt]{\\large\\textit{${titleParts.map(p => escapeLatex(p!)).join(' \\textendash{} ')}}}`
    : ''

  return `\\documentclass[11pt,a4paper]{article}

\\usepackage[T1]{fontenc}
\\usepackage{mathpazo}
\\usepackage[margin=0.3in]{geometry}

\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{titlesec}
\\usepackage{xcolor}
\\usepackage{fancyhdr}
\\usepackage{graphicx}

\\geometry{
  top=0.3in,
  bottom=0.3in,
  left=0.3in,
  right=0.3in
}

\\pagestyle{fancy}
\\fancyhf{}
\\renewcommand{\\headrulewidth}{0.5pt}
\\renewcommand{\\footrulewidth}{0pt}

% Running header on subsequent pages
\\fancyhead[L]{\\small\\color{gray}\\textsc{${name}} \\textbar{} Curriculum Vitae}
\\fancyhead[R]{\\small\\color{gray}Page \\thepage}
\\fancyfoot{}

% Page style for the first page (no header)
\\fancypagestyle{firstpage}{
  \\fancyhf{}
  \\renewcommand{\\headrulewidth}{0pt}
  \\fancyfoot[C]{\\small Page \\thepage}
}

\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{0pt}
\\linespread{0.95}

\\titleformat{\\section}{\\normalsize\\bfseries\\scshape}{}{0em}{}[\\titlerule]
\\titlespacing*{\\section}{0pt}{2pt}{4pt}

\\setlist[itemize]{nosep, leftmargin=1.5em, label=\\textbullet, topsep=0pt, itemsep=0pt}

\\hypersetup{
    colorlinks=true,
    linkcolor=blue!70!black,
    urlcolor=blue!70!black
}

\\begin{document}
\\thispagestyle{firstpage}

\\begingroup
\\centering
{\\LARGE\\textsc{\\textbf{${name}}}}${titleLine}${contactLine}
\\par
\\endgroup
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
  return `\\section{Research Interests}

\\textit{${escapeLatex(summary)}}`
}

function generateExperience(experience: ResumeData['experience']): string {
  if (experience.length === 0) return ''
  const items = experience
    .map((exp) => {
      const dateRange = formatDateRange(exp.startDate, exp.endDate, exp.current)
      const bullets = generateBulletPoints(exp.bulletPoints)

      return `\\textbf{${escapeLatex(exp.position)}} \\hfill \\textit{${dateRange}} \\\\
\\textit{${escapeLatex(exp.company)}}${exp.location ? ` \\hfill ${escapeLatex(exp.location)}` : ''}
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

  return `\\section{Technical Skills}

${items}`
}

function generateProjects(projects: ResumeData['projects']): string {
  if (projects.length === 0) return ''
  const items = projects
    .map((proj) => {
      const dateLine = proj.duration ? ` \\hfill ${escapeLatex(proj.duration)}` : ''
      const roleLine = proj.role ? ` \\textendash{} \\textit{${escapeLatex(proj.role)}}` : ''
      const descLine = proj.description ? `\\\\\n${escapeLatex(proj.description)}` : ''
      const bullets = generateBulletPoints(proj.bulletPoints)
      const hasBullets = bullets.length > 0

      const techLine =
        proj.technologies.length > 0
          ? `${hasBullets ? '\n' : '\\\\\n'}\\textbf{Technologies:} \\textit{${escapeLatex(proj.technologies.join(', '))}}`
          : ''

      const linkAfterBullets = hasBullets && !techLine
      const linkLine = proj.githubUrl || proj.liveDemoUrl
        ? `${linkAfterBullets ? '\n' : '\\\\\n'}\\textit{${
            [proj.githubUrl ? `GitHub: \\url{${escapeLatex(proj.githubUrl)}}` : '',
             proj.liveDemoUrl ? `Demo: \\url{${escapeLatex(proj.liveDemoUrl)}}` : '']
              .filter(Boolean)
              .join(' $\\mid$ ')
          }}`
        : ''

      return `\\textbf{${escapeLatex(proj.name)}}${roleLine}${dateLine}${descLine}${bullets}${techLine}${linkLine}`
    })
    .join('\n\n\\vspace{3pt}\n')

  return `\\section{Research Projects}

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

      return `\\textbf{${degreeLine}} \\hfill \\textit{${dateRange}} \\\\
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
      return `\\textbf{${escapeLatex(cert.name)}}${issuerStr}\\textit{${dateStr}}`
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
      const descStr = ach.description ? `\\\\\n${escapeLatex(ach.description)}` : ''
      return `\\textbf{${escapeLatex(ach.title)}}${dateStr}${descStr}`
    })
    .join(' \\\\\n\n')

  return `\\section{Awards and Honors}

${items}`
}

function generatePublications(publications: ResumeData['publications']): string {
  if (publications.length === 0) return ''
  const items = publications
    .map((pub) => {
      const dateStr = pub.date ? ` \\hfill ${escapeLatex(pub.date)}` : ''
      const descStr = pub.description ? `\n${escapeLatex(pub.description)}` : ''
      return `\\textbf{\\textit{${escapeLatex(pub.title)}}}${dateStr}\\\\\n${escapeLatex(pub.publisher)}${descStr ? `\\\\${descStr}` : ''}`
    })
    .join(' \\\\\n')

  return `\\section{Publications}

${items}`
}

function generateLanguages(languages: ResumeData['languages']): string {
  if (languages.length === 0) return ''
  const items = languages
    .map((lang) => `\\textbf{${escapeLatex(lang.name)}} \\textendash{} ${escapeLatex(lang.proficiency)}`)
    .join('\\quad ')

  return `\\section{Languages}

${items}`
}

function generateCustomSection(section: { title: string; content: string }): string {
  if (!section.title || !section.content) return ''
  return `\\section{${escapeLatex(section.title)}}

${escapeLatex(section.content)}`
}
