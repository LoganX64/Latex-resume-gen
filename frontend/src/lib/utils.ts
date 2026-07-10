import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

const LATEX_PLACEHOLDER = '\x00'
const LATEX_BACKSLASH_PATTERN = new RegExp(`${LATEX_PLACEHOLDER}BACKSLASH${LATEX_PLACEHOLDER}`, 'g')
const LATEX_TILDE_PATTERN = new RegExp(`${LATEX_PLACEHOLDER}TILDE${LATEX_PLACEHOLDER}`, 'g')
const LATEX_CIRCUM_PATTERN = new RegExp(`${LATEX_PLACEHOLDER}CIRCUM${LATEX_PLACEHOLDER}`, 'g')

export function escapeLatex(text: string): string {
  if (!text) return ''
  let result = text
    .replace(/\\/g, `${LATEX_PLACEHOLDER}BACKSLASH${LATEX_PLACEHOLDER}`)
    .replace(/~/g, `${LATEX_PLACEHOLDER}TILDE${LATEX_PLACEHOLDER}`)
    .replace(/\^/g, `${LATEX_PLACEHOLDER}CIRCUM${LATEX_PLACEHOLDER}`)
    .replace(/[&%$#_{}]/g, (match) => `\\${match}`)
    .replace(LATEX_BACKSLASH_PATTERN, '\\textbackslash{}')
    .replace(LATEX_TILDE_PATTERN, '\\textasciitilde{}')
    .replace(LATEX_CIRCUM_PATTERN, '\\textasciicircum{}')
  return result
}

export function formatDate(date: string): string {
  if (!date) return ''
  const [year, month] = date.split('-')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[parseInt(month, 10) - 1]} ${year}`
}
