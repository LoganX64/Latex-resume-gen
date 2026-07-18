import type { ResumeVersion } from '@/types/resume'
import { loadTemplate } from '@/templates'
import { downloadFile, downloadPdf } from '@/utils/download'
import { toast } from 'sonner'

export async function quickExportPdf(version: ResumeVersion): Promise<boolean> {
  const template = await loadTemplate(version.templateId)
  if (!template) {
    toast.error('Template not found')
    return false
  }

  const latex = template.generateLatex(version.resume, version.sectionOrder, version.sectionVisibility)

  try {
    const response = await fetch('/api/compile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latex, profileImage: '' }),
    })

    if (!response.ok) {
      let message = 'Compilation failed'
      try {
        const error = await response.json()
        message = error.message || message
      } catch {
        message = `Server error: ${response.status}`
      }
      toast.error('PDF export failed', { description: message })
      return false
    }

    const blob = await response.blob()
    const pageCount = response.headers.get('X-PDF-Page-Count')
    const name = version.resume.personalInfo.fullName || 'resume'
    const filename = `${name.toLowerCase().replace(/\s+/g, '-')}-${version.name.toLowerCase().replace(/\s+/g, '-')}.pdf`
    downloadPdf(blob, filename)
    const description = pageCount && parseInt(pageCount) > 1
      ? `${filename} downloaded. Warning: resume has ${pageCount} pages — aim for 1 page.`
      : `${filename} downloaded successfully.`
    toast.success('PDF exported', { description })
    return true
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not connect to server'
    toast.error('PDF export failed', {
      description: `${message}. Make sure the backend is running.`,
    })
    return false
  }
}

export async function quickExportLatex(version: ResumeVersion): Promise<boolean> {
  const template = await loadTemplate(version.templateId)
  if (!template) {
    toast.error('Template not found')
    return false
  }

  const latex = template.generateLatex(version.resume, version.sectionOrder, version.sectionVisibility)
  const name = version.resume.personalInfo.fullName || 'resume'
  const filename = `${name.toLowerCase().replace(/\s+/g, '-')}-${version.name.toLowerCase().replace(/\s+/g, '-')}.tex`
  downloadFile(latex, filename, 'application/x-latex')
  toast.success('LaTeX file exported', {
    description: `${filename} downloaded successfully.`,
  })
  return true
}
