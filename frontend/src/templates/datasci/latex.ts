import type { ResumeData, SectionOrder, SectionVisibility } from '@/types/resume'
import { escapeLatex } from '@/lib/utils'
import { formatDateRange, generateBulletPoints } from '../shared'

export function generateDatasciLatex(
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

  return buildDatasciDocument(resume.personalInfo, body)
}

function buildDatasciDocument(
  personalInfo: ResumeData['personalInfo'],
  body: string
): string {
  const name = escapeLatex(personalInfo.fullName || 'Your Name')
  const title = personalInfo.professionalTitle
    ? escapeLatex(personalInfo.professionalTitle)
    : 'Data Scientist / Junior Developer'

  const phone = personalInfo.phone ? escapeLatex(personalInfo.phone) : ''
  const city = personalInfo.location ? escapeLatex(personalInfo.location) : ''
  const email = personalInfo.email
    ? `\\href{mailto:${personalInfo.email}}{\\underline{${escapeLatex(personalInfo.email)}}}`
    : ''
  const github = personalInfo.github
    ? (() => {
        const gh = personalInfo.github.replace(/^(https?:\/\/)?(www\.)?github\.com\//, '')
        return `\\href{https://github.com/${gh}}{\\underline{github.com/${escapeLatex(gh)}}}`
      })()
    : ''
  const linkedin = personalInfo.linkedin
    ? (() => {
        const li = personalInfo.linkedin.replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\//, '')
        return `\\href{https://www.linkedin.com/in/${li}}{\\underline{linkedin.com/in/${escapeLatex(li)}}}`
      })()
    : ''
  const portfolio = personalInfo.website
    ? `Portfolio: \\href{https://${personalInfo.website}}{\\underline{${escapeLatex(personalInfo.website)}}}`
    : ''

  const leftLines = [phone, city, email].filter(Boolean)
  const rightLines = [portfolio, github, linkedin].filter(Boolean)
  const lheadContent = leftLines.join(' \\\\[2pt]\n')
  const rheadContent = rightLines.join(' \\\\[2pt]\n')

  return `\\documentclass[10pt]{article}
\\usepackage[utf8]{inputenc}

\\usepackage[T1]{fontenc}
\\usepackage[default,semibold]{sourcesanspro}
\\usepackage[10pt]{moresize}
\\usepackage{anyfontsize}
\\usepackage{csquotes}

\\usepackage[margin=.5in, top=.5in, bottom=1in]{geometry}
\\raggedright
\\raggedbottom
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{0pt}

\\usepackage{xcolor}
\\definecolor{highlight}{RGB}{61,90,128}

\\usepackage{hyperref}
\\hypersetup{colorlinks=true,urlcolor=highlight}

\\usepackage[inline]{enumitem}
\\setlength{\\tabcolsep}{0in}

\\usepackage[nostruts]{titlesec}
\\titlespacing*{\\section}{0em}{0pt}{0em}
\\titleformat{\\section}{\\color{highlight} \\scshape \\raggedright \\large}{}{0em}{}[\\vspace{-0.75em}\\hrulefill]
\\linespread{0.95}

\\titlespacing*{\\subsection}{0em}{0em}{0em}
\\titleformat{\\subsection}{\\bfseries}{}{0em}{}[]

\\newcommand{\\skills}[1]{ {\\bfseries #1}}
\\newcommand{\\subtext}[1]{\\textit{#1}\\par\\vspace{-.5em}}

\\setlist[itemize]{align=parleft,left=0pt..1em}
\\newenvironment{zitemize}{
\\begin{itemize}[topsep=0pt,itemsep=0pt,parsep=1pt]}
{\\end{itemize}}

\\pagenumbering{gobble}

\\RequirePackage{fancyhdr}

\\def\\name{${name}}
\\def\\phone{${phone}}
\\def\\city{${city}}
\\def\\email{${email}}
\\def\\role{${title}}

\\fancypagestyle{first_page}{
\\fancyhf{}
\\lhead{
${lheadContent}
}
\\chead{
\\centering
{\\Huge \\skills{\\name}} \\\\[.25em]
{\\color{highlight} \\Large{${title}}}
}
\\rhead{
${rheadContent}
}
\\renewcommand{\\headrulewidth}{1pt}
\\renewcommand{\\headrule}{\\hbox to\\headwidth{\\color{highlight}\\leaders\\hrule height \\headrulewidth\\hfill}}
\\setlength{\\headheight}{90pt}
\\setlength{\\headsep}{5pt}
}

\\fancypagestyle{others}{
\\fancyhf{}
\\renewcommand{\\headrulewidth}{0pt}
\\setlength{\\headheight}{30pt}
\\setlength{\\headsep}{5pt}
}

\\begin{document}\\pagestyle{others}\\thispagestyle{first_page}

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
  return escapeLatex(summary)
}

function generateExperience(experience: ResumeData['experience']): string {
  if (experience.length === 0) return ''
  const items = experience
    .map((exp) => {
      const dateRange = formatDateRange(exp.startDate, exp.endDate, exp.current)
      const bullets = generateBulletPoints(exp.bulletPoints, 'zitemize')

      return `\\textbf{${escapeLatex(exp.position)}} \\hfill ${dateRange} \\\\
\\textit{${escapeLatex(exp.company)}}${exp.location ? ` \\hfill ${escapeLatex(exp.location)}` : ''}
${bullets}`
    })
    .join('\n\n\\vspace{3pt}\n')

  return `\\section{Technical Experience}

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
      const headerLines: string[] = []

      const datePart = proj.duration ? ` \\hfill ${escapeLatex(proj.duration)}` : ''
      headerLines.push(`\\textbf{${escapeLatex(proj.name)}}${datePart}`)

      if (proj.role) {
        headerLines.push(`\\textit{${escapeLatex(proj.role)}}`)
      }

      if (proj.description) {
        headerLines.push(`\\textit{${escapeLatex(proj.description)}}`)
      }

      const footerLines: string[] = []

      if (proj.technologies.length > 0) {
        footerLines.push(`\\textbf{Tech:} ${escapeLatex(proj.technologies.join(', '))}`)
      }

      const linkParts: string[] = []
      if (proj.githubUrl) {
        linkParts.push(`\\textbf{GitHub:} \\url{${proj.githubUrl}}`)
      }
      if (proj.liveDemoUrl) {
        linkParts.push(`\\textbf{Live:} \\url{${proj.liveDemoUrl}}`)
      }
      if (linkParts.length > 0) {
        footerLines.push(linkParts.join(' \\quad '))
      }

      const bullets = generateBulletPoints(proj.bulletPoints, 'zitemize')

      const header = headerLines.join(' \\\\\n')
      const footer = footerLines.length > 0 ? '\n' + footerLines.join(' \\\\\n') : ''

      return `${header}${bullets}${footer}`
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
      const descStr = ach.description ? `\\\\\n${escapeLatex(ach.description)}` : ''
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
      const descStr = pub.description ? `\\\\\n${escapeLatex(pub.description)}` : ''
      return `\\textbf{${escapeLatex(pub.title)}}${pub.publisher ? ` - ${escapeLatex(pub.publisher)}` : ''}${dateStr}${descStr}`
    })
    .join(' \\\\\n\n')

  return `\\section{Publications}

${items}`
}

function generateLanguages(languages: ResumeData['languages']): string {
  if (languages.length === 0) return ''
  const items = languages
    .map((lang) => `\\textbf{${escapeLatex(lang.name)}} \\textendash{} ${escapeLatex(lang.proficiency)}`)
    .join(' \\quad ')

  return `\\section{Activities}

${items}`
}

function generateCustomSection(section: { title: string; content: string }): string {
  if (!section.title || !section.content) return ''
  return `\\section{${escapeLatex(section.title)}}

${escapeLatex(section.content)}`
}
