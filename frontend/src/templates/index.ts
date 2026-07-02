import type { ResumeData, SectionOrder, SectionVisibility, TemplateConfig } from '@/types/resume'
import type { ReactNode } from 'react'

export interface TemplatePreviewProps {
  resume: ResumeData
  sections: { id: string; type: string; label: string }[]
}

export interface Template {
  config: TemplateConfig
  Preview: (props: TemplatePreviewProps) => ReactNode
  generateLatex: (
    resume: ResumeData,
    sectionOrder: SectionOrder[],
    sectionVisibility: SectionVisibility
  ) => string
}

const templateModules = import.meta.glob<{ default: Template }>('./*/index.tsx', {
  eager: true,
})

const templates: Record<string, Template> = {}

for (const [path, mod] of Object.entries(templateModules)) {
  const id = path.split('/')[1]
  if (mod.default) {
    templates[id] = mod.default
  }
}

export function getTemplate(id: string): Template | undefined {
  return templates[id]
}

export function getTemplateConfig(id: string): TemplateConfig | undefined {
  return templates[id]?.config
}

export function getAllTemplates(): Template[] {
  return Object.values(templates)
}

export function getAllTemplateConfigs(): TemplateConfig[] {
  return Object.values(templates).map((t) => t.config)
}
