import type { TemplateConfig } from '@/types/resume'

export default {
  id: 'twocolumn',
  name: 'Modern Two Column',
  description: 'Two-column layout. Left column for experience and projects, right column for skills, education, and references.',
  supportsPhoto: false,
  category: 'modern',
  margins: { top: 7.62, bottom: 7.62, left: 7.62, right: 7.62 },
} satisfies TemplateConfig
