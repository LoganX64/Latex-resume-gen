import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

export function escapeLatex(text: string): string {
  if (!text) return ''
  const placeholder = '\x00'
  let result = text
    .replace(/\\/g, `${placeholder}BACKSLASH${placeholder}`)
    .replace(/~/g, `${placeholder}TILDE${placeholder}`)
    .replace(/\^/g, `${placeholder}CIRCUM${placeholder}`)
    .replace(/[&%$#_{}]/g, (match) => `\\${match}`)
    .replace(new RegExp(`${placeholder}BACKSLASH${placeholder}`, 'g'), '\\textbackslash{}')
    .replace(new RegExp(`${placeholder}TILDE${placeholder}`, 'g'), '\\textasciitilde{}')
    .replace(new RegExp(`${placeholder}CIRCUM${placeholder}`, 'g'), '\\textasciicircum{}')
  return result
}

export function formatDate(date: string): string {
  if (!date) return ''
  const [year, month] = date.split('-')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[parseInt(month, 10) - 1]} ${year}`
}
