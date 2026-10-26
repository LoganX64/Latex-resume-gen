import type { ResumeVersion } from '@/types/resume'
import { loadTemplate } from '@/templates'
import { downloadFile } from '@/utils/download'
import { toast } from 'sonner'

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
