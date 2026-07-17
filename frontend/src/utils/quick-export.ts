import type { ResumeVersion } from '@/types/resume'
import { loadTemplate } from '@/templates'
import { downloadFile, downloadPdf } from '@/utils/download'
import { toast } from 'sonner'

export async function quickExportPdf(version: ResumeVersion): Promise<void> {
  const template = await loadTemplate(version.templateId)
  if (!template) {
    toast.error('Template not found')
    return
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
      return
    }

    const blob = await response.blob()
    const name = version.resume.personalInfo.fullName || 'resume'
    const filename = `${name.toLowerCase().replace(/\s+/g, '-')}-${version.name.toLowerCase().replace(/\s+/g, '-')}.pdf`
    downloadPdf(blob, filename)
    toast.success('PDF exported', {
      description: `${filename} downloaded successfully.`,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not connect to server'
    toast.error('PDF export failed', {
      description: `${message}. Make sure the backend is running.`,
    })
  }
}

export async function quickExportLatex(version: ResumeVersion): Promise<void> {
  const template = await loadTemplate(version.templateId)
  if (!template) {
    toast.error('Template not found')
    return
  }

  const latex = template.generateLatex(version.resume, version.sectionOrder, version.sectionVisibility)
  const name = version.resume.personalInfo.fullName || 'resume'
  const filename = `${name.toLowerCase().replace(/\s+/g, '-')}-${version.name.toLowerCase().replace(/\s+/g, '-')}.tex`
  downloadFile(latex, filename, 'application/x-latex')
  toast.success('LaTeX file exported', {
    description: `${filename} downloaded successfully.`,
  })
}
