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
 */
export function generateBulletPoints(bullets: (string | undefined)[]): string {
  const clean = bullets.filter((b): b is string => !!b && b.trim() !== '')
  if (clean.length === 0) return ''
  return `\\begin{itemize}
${clean.map((b) => `  \\item ${escapeLatex(b)}`).join('\n')}
\\end{itemize}`
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
}, useIcons: boolean = false): string[] {
  const parts: string[] = []

  if (personalInfo.email) {
    const escaped = escapeLatex(personalInfo.email)
    parts.push(useIcons ? `\\faIcon{envelope}\\ \\href{mailto:${personalInfo.email}}{${escaped}}` : `\\href{mailto:${personalInfo.email}}{${escaped}}`)
  }
  if (personalInfo.phone) {
    const escaped = escapeLatex(personalInfo.phone)
    parts.push(useIcons ? `\\faIcon{phone}\\ \\href{tel:${personalInfo.phone}}{${escaped}}` : escaped)
  }
  if (personalInfo.location) {
    const escaped = escapeLatex(personalInfo.location)
    parts.push(useIcons ? `\\faIcon{map-marker-alt}\\ ${escaped}` : escaped)
  }
  if (personalInfo.linkedin) {
    const escaped = escapeLatex(personalInfo.linkedin)
    parts.push(useIcons ? `\\faIcon{linkedin}\\ \\href{https://${personalInfo.linkedin}}{${escaped}}` : `\\href{https://${personalInfo.linkedin}}{${escaped}}`)
  }
  if (personalInfo.github) {
    const escaped = escapeLatex(personalInfo.github)
    parts.push(useIcons ? `\\faIcon{github}\\ \\href{https://${personalInfo.github}}{${escaped}}` : `\\href{https://${personalInfo.github}}{${escaped}}`)
  }
  if (personalInfo.website) {
    const escaped = escapeLatex(personalInfo.website)
    parts.push(useIcons ? `\\faIcon{globe}\\ \\href{https://${personalInfo.website}}{${escaped}}` : `\\href{https://${personalInfo.website}}{${escaped}}`)
  }

  return parts
}

/**
 * Wraps the header leftContent with a right-aligned profile image minipage if profileImage is provided.
 */
export function wrapPhotoHeader(
  personalInfo: { profileImage?: string },
  leftContent: string,
  photoWidthPct: number = 0.16
): string {
  if (!personalInfo.profileImage) {
    return leftContent
  }

  const leftWidth = 1.0 - photoWidthPct - 0.04
  return `\\begin{minipage}[t]{${leftWidth.toFixed(2)}\\textwidth}
${leftContent}
\\end{minipage}
\\hfill
\\begin{minipage}[t]{${photoWidthPct.toFixed(2)}\\textwidth}
  \\raggedleft
  \\vspace{-10pt}
  \\IfFileExists{profile.png}{\\includegraphics[width=\\linewidth,height=\\linewidth,keepaspectratio]{profile.png}}{}
\\end{minipage}`
}
