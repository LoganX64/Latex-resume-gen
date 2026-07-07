import type { ResumeData, SectionOrder, SectionVisibility } from '@/types/resume'
import { escapeLatex } from '@/lib/utils'
import { formatDateRange, generateBulletPoints } from '../shared'

export function generatePlushLatex(
  resume: ResumeData,
  sectionOrder: SectionOrder[],
  sectionVisibility: SectionVisibility
): string {
  const sections = sectionOrder.filter(
    (s) => sectionVisibility[s.type] ?? false
  )

  const rightTypes = ['skills', 'education']
  const leftTypes = ['experience', 'projects', 'certifications', 'achievements', 'publications', 'languages', 'customSections']

  const rightSections = sections.filter((s) => rightTypes.includes(s.type))
  const leftSections = sections.filter((s) => leftTypes.includes(s.type))
  const summarySection = sections.find((s) => s.type === 'summary')

  const right = rightSections
    .map((section) => generateRightSection(section.type, resume))
    .filter(Boolean)
    .join('\n')

  const left = leftSections
    .map((section) => generateLeftSection(section.type, resume))
    .filter(Boolean)
    .join('\n')

  const summary = summarySection ? generateSummary(resume.summary) : ''

  return buildPlushDocument(resume.personalInfo, summary, left, right)
}

function buildPlushDocument(
  personalInfo: ResumeData['personalInfo'],
  summary: string,
  left: string,
  right: string
): string {
  const firstName = escapeLatex((personalInfo.fullName || 'Your Name').split(' ')[0])
  const lastName = escapeLatex((personalInfo.fullName || 'Your Name').split(' ').slice(1).join(' ') || '')
  const title = personalInfo.professionalTitle
    ? escapeLatex(personalInfo.professionalTitle)
    : 'Full Stack Software Engineer'

  const contactParts: string[] = []
  if (personalInfo.website) {
    contactParts.push(`\\href{https://${personalInfo.website}}{${escapeLatex(personalInfo.website)}}`)
  }
  if (personalInfo.github) {
    contactParts.push(`\\href{https://${personalInfo.github}}{${escapeLatex(personalInfo.github)}}`)
  }
  if (personalInfo.linkedin) {
    contactParts.push(`\\href{https://${personalInfo.linkedin}}{${escapeLatex(personalInfo.linkedin)}}`)
  }
  if (personalInfo.email) {
    contactParts.push(`\\href{mailto:${personalInfo.email}}{${escapeLatex(personalInfo.email)}}`)
  }
  if (personalInfo.phone) {
    contactParts.push(`\\href{tel:${personalInfo.phone}}{${escapeLatex(personalInfo.phone)}}`)
  }

  const contactLine = contactParts.length > 0
    ? `{\\contactline{${contactParts.join('}{')}}}`
    : ''

  return `\\documentclass[11pt]{article}

\\usepackage[T1]{fontenc}
\\usepackage[margin=0.85cm,vmargin=0.8cm]{geometry}
\\usepackage[hidelinks]{hyperref}
\\usepackage{enumitem}
\\usepackage{graphicx}
\\usepackage{pifont}
\\usepackage[document]{ragged2e}
\\usepackage[usenames,dvipsnames]{xcolor}
\\usepackage{titlesec}
\\usepackage{fancyhdr}
\\usepackage[default]{sourcesanspro}

\\definecolor{date}{HTML}{666666}
\\definecolor{title}{HTML}{1D76E2}
\\definecolor{primary}{HTML}{2b2b2b}
\\definecolor{headings}{HTML}{6A6A6A}
\\definecolor{subheadings}{HTML}{333333}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\titlespacing{\\section}{0pt}{4pt}{3pt}
\\titlespacing{\\subsection}{0pt}{0pt}{0pt}
\\newcommand{\\sectionsep}{\\vspace{3pt}}

\\titleformat{\\section}{\\color{title}\\fontsize{14}{16pt}\\selectfont\\bfseries\\raggedright}{}{0em}{\\MakeUppercase}

\\titleformat{\\subsection}{\\color{subheadings}\\fontsize{11}{13pt}\\selectfont\\bfseries\\raggedright}{}{0em}{\\MakeUppercase}

\\newcommand{\\runsubsection}[1]{\\color{subheadings}\\fontsize{11}{13pt}\\selectfont\\bfseries\\MakeUppercase{#1} \\normalfont}

\\newcommand{\\descript}[1]{\\color{subheadings}\\raggedright\\scshape\\fontsize{10}{13pt}\\selectfont{#1 \\\\} \\normalfont}

\\newcommand{\\location}[1]{\\color{headings}\\raggedright\\fontsize{9}{12pt}\\selectfont{#1\\\\} \\normalfont}

\\newcommand{\\namesection}[4]{
{\\color{title}
\\fontsize{36pt}{44pt}\\selectfont\\bfseries #1 #2
}\\\\[4pt]

{\\fontsize{14pt}{16pt}\\selectfont #3}

\\vspace{2pt}

{\\fontsize{10pt}{13pt}\\selectfont #4}

\\vspace{4pt}
}

\\newcommand{\\contactline}[5]{\\begingroup
\\setbox0=\\hbox{
{#1}\\hspace{0.3cm}
{#2}\\hspace{0.3cm}
{#3}\\hspace{0.3cm}
{#4}\\hspace{0.3cm}
{#5}
}\\parbox{\\wd0}{\\box0}\\endgroup}

\\newenvironment{tightemize}{
\\begin{itemize}[label=\\ding{212}, topsep=0pt, itemsep=1pt, parsep=0pt]}
{\\end{itemize}}

\\hypersetup{
    colorlinks=true,
    linkcolor=title,
    urlcolor=title
}

\\begin{document}

\\namesection{${firstName}}{${lastName}}{${title}}${contactLine}

${summary}

\\begin{minipage}[t]{0.70\\textwidth}
${left}
\\end{minipage}
\\hfill
\\begin{minipage}[t]{0.25\\textwidth}
${right}
\\end{minipage}
\\end{document}`
}

function generateSummary(summary: string): string {
  if (!summary) return ''
  return `\\section{Professional Summary}
${escapeLatex(summary)}`
}

function generateLeftSection(type: string, resume: ResumeData): string {
  switch (type) {
    case 'experience':
      return generateExperience(resume.experience)
    case 'projects':
      return generateProjects(resume.projects)
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

function generateRightSection(type: string, resume: ResumeData): string {
  switch (type) {
    case 'skills':
      return generateSkills(resume.skills)
    case 'education':
      return generateEducation(resume.education)
    default:
      return ''
  }
}

function generateExperience(experience: ResumeData['experience']): string {
  if (experience.length === 0) return ''
  const items = experience
    .map((exp) => {
      const dateRange = formatDateRange(exp.startDate, exp.endDate, exp.current)
      const loc = exp.location ? ` | ${escapeLatex(exp.location)}` : ''
      const bullets = generateBulletPoints(exp.bulletPoints)

      return `\\runsubsection{${escapeLatex(exp.company)}}
\\descript{| ${escapeLatex(exp.position)}}
\\location{${dateRange}${loc}}
\\begin{tightemize}
\\sectionsep
${bullets ? bullets.split('\n').filter(l => l.trim().startsWith('\\item')).join('\n') : ''}
\\end{tightemize}
\\sectionsep`
    })
    .join('\n')

  return `\\section{Experience}
${items}`
}

function generateProjects(projects: ResumeData['projects']): string {
  if (projects.length === 0) return ''
  const items = projects
    .map((proj) => {
      const techLabel = proj.technologies.length > 0
        ? ` | ${escapeLatex(proj.technologies.join(', '))}`
        : ''
      const dateStr = proj.duration || ''
      const bullets = generateBulletPoints(proj.bulletPoints)

      return `\\runsubsection{${escapeLatex(proj.name)}}
\\descript{${techLabel}}
\\location{${escapeLatex(dateStr)}}
\\begin{tightemize}
${bullets ? bullets.split('\n').filter(l => l.trim().startsWith('\\item')).join('\n') : ''}
\\end{tightemize}
\\sectionsep`
    })
    .join('\n')

  return `\\section{Projects}
${items}`
}

function generateSkills(skills: ResumeData['skills']): string {
  if (skills.length === 0) return ''
  const items = skills
    .map((cat) => `\\subsection{${escapeLatex(cat.name)}}
\\sectionsep
${cat.skills.map(s => escapeLatex(s)).join(' \\textbullet{} ')} \\\\
\\sectionsep
\\sectionsep`)
    .join('\n')

  return `\\section{Skills}
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
      const cgpaLine = edu.cgpa ? `\n\\location{ Cum. GPA: ${escapeLatex(edu.cgpa)} }` : ''

      return `\\subsection{${escapeLatex(edu.institution || 'Institution')}}
\\descript{${degreeLine}}
\\location{${dateRange}}${cgpaLine}

\\sectionsep`
    })
    .join('\n')

  return `\\section{Education}
${items}`
}

function generateCertifications(certifications: ResumeData['certifications']): string {
  if (certifications.length === 0) return ''
  const items = certifications
    .map((cert) => {
      const issuerStr = cert.issuer ? ` \\textendash{} ${escapeLatex(cert.issuer)}` : ''
      const dateStr = cert.date ? ` \\hfill \\small ${escapeLatex(cert.date)}` : ''
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
      const dateStr = ach.date ? ` \\hfill \\small ${escapeLatex(ach.date)}` : ''
      const descStr = ach.description ? `\n\\small ${escapeLatex(ach.description)}` : ''
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
      const dateStr = pub.date ? ` \\hfill \\small ${escapeLatex(pub.date)}` : ''
      const descStr = pub.description ? `\n\\small ${escapeLatex(pub.description)}` : ''
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
    .join(' \\\\\n')

  return `\\section{Languages}
${items}`
}

function generateCustomSection(section: { title: string; content: string }): string {
  if (!section.title || !section.content) return ''
  return `\\section{${escapeLatex(section.title)}}
${escapeLatex(section.content)}`
}
