import { escapeLatex, formatDate } from '@/lib/utils'

/**
 * Formats start and end dates into a LaTeX-friendly date range.
 */
export function formatDateRange(startDate: string, endDate: string, current: boolean): string {
  const start = formatDate(startDate)
  const end = current ? 'Present' : formatDate(endDate)
  if (!start) return ''
  return `${start} \\textendash{} ${end}`
}

/**
 * Formats a list of bullet points into a LaTeX itemize block.
 * @param env - The LaTeX list environment to use (default: 'itemize')
 */
export function generateBulletPoints(bullets: (string | undefined)[], env: string = 'itemize'): string {
  const clean = bullets.filter((b): b is string => !!b && b.trim() !== '')
  if (clean.length === 0) return ''
  return `\\begin{${env}}
${clean.map((b) => `  \\item ${escapeLatex(b)}`).join('\n')}
\\end{${env}}`
}

/**
 * Returns a list of formatted contact links based on available personal info fields.
 */
export function getContactParts(personalInfo: {
  email?: string
  phone?: string
  location?: string
  linkedin?: string
  github?: string
  website?: string
}, useIcons: boolean = true): string[] {
  const parts: string[] = []

  if (personalInfo.email) {
    const escaped = escapeLatex(personalInfo.email)
    parts.push(useIcons ? `\\mbox{\\faEnvelope\\ \\href{mailto:${personalInfo.email}}{${escaped}}}` : `\\href{mailto:${personalInfo.email}}{${escaped}}`)
  }
  if (personalInfo.phone) {
    const escaped = escapeLatex(personalInfo.phone)
    parts.push(useIcons ? `\\mbox{\\faPhone\\ \\href{tel:${personalInfo.phone}}{${escaped}}}` : escaped)
  }
  if (personalInfo.location) {
    const escaped = escapeLatex(personalInfo.location)
    parts.push(useIcons ? `\\mbox{\\faMapMarker\\ ${escaped}}` : escaped)
  }
  if (personalInfo.linkedin) {
    const escaped = escapeLatex(personalInfo.linkedin)
    parts.push(useIcons ? `\\mbox{\\faLinkedin\\ \\href{https://${personalInfo.linkedin}}{${escaped}}}` : `\\href{https://${personalInfo.linkedin}}{${escaped}}`)
  }
  if (personalInfo.github) {
    const escaped = escapeLatex(personalInfo.github)
    parts.push(useIcons ? `\\mbox{\\faGithub\\ \\href{https://${personalInfo.github}}{${escaped}}}` : `\\href{https://${personalInfo.github}}{${escaped}}`)
  }
  if (personalInfo.website) {
    const escaped = escapeLatex(personalInfo.website)
    parts.push(useIcons ? `\\mbox{\\faGlobe\\ \\href{https://${personalInfo.website}}{\\mbox{${escaped}}}}` : `\\href{https://${personalInfo.website}}{\\mbox{${escaped}}}`)
  }

  return parts
}
