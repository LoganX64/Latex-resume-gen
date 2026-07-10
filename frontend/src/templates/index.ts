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

const configModules = import.meta.glob<{ default: TemplateConfig }>('./*/config.ts', {
  eager: true,
})

const templateModules = import.meta.glob<{ default: Template }>('./*/index.tsx')

const configs: Record<string, TemplateConfig> = {}
for (const [path, mod] of Object.entries(configModules)) {
  const id = path.split('/')[1]
  if (mod.default) {
    configs[id] = mod.default
  }
}

const templateCache = new Map<string, Template>()

export async function loadTemplate(id: string): Promise<Template | undefined> {
  if (templateCache.has(id)) return templateCache.get(id)!
  const path = `./${id}/index.tsx`
  if (!templateModules[path]) return undefined
  const mod = await templateModules[path]()
  const config = configs[id]
  const template: Template = { ...mod.default, config }
  templateCache.set(id, template)
  return template
}

export function getTemplateConfig(id: string): TemplateConfig | undefined {
  return configs[id]
}

export function getAllTemplateConfigs(): TemplateConfig[] {
  return Object.values(configs)
}
