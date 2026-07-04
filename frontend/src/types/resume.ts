export interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  location: string
  linkedin?: string
  github?: string
  website?: string
  professionalTitle?: string
  profileImage?: string
}

export interface Experience {
  id: string
  company: string
  position: string
  location?: string
  startDate: string
  endDate: string
  current: boolean
  description?: string
  bulletPoints: string[]
}

export interface Education {
  id: string
  institution: string
  degree: string
  specialization?: string
  cgpa?: string
  startDate: string
  endDate: string
  description?: string
}

export interface SkillCategory {
  id: string
  name: string
  skills: string[]
}

export interface Project {
  id: string
  name: string
  description?: string
  bulletPoints: string[]
  technologies: string[]
  githubUrl?: string
  liveDemoUrl?: string
  role?: string
  duration?: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  url?: string
}

export interface Achievement {
  id: string
  title: string
  description?: string
  date?: string
}

export interface Publication {
  id: string
  title: string
  publisher: string
  date: string
  url?: string
  description?: string
}

export interface Language {
  id: string
  name: string
  proficiency: 'Native' | 'Fluent' | 'Advanced' | 'Intermediate' | 'Basic'
}

export interface CustomSection {
  id: string
  title: string
  content: string
}

export interface SectionVisibility {
  personalInfo: boolean
  summary: boolean
  experience: boolean
  education: boolean
  skills: boolean
  projects: boolean
  certifications: boolean
  achievements: boolean
  publications: boolean
  languages: boolean
  customSections: boolean
}

export interface SectionOrder {
  id: string
  type: keyof SectionVisibility
  label: string
}

export interface ResumeData {
  personalInfo: PersonalInfo
  summary: string
  experience: Experience[]
  education: Education[]
  skills: SkillCategory[]
  projects: Project[]
  certifications: Certification[]
  achievements: Achievement[]
  publications: Publication[]
  languages: Language[]
  customSections: CustomSection[]
}

export interface Margins {
  top: number
  bottom: number
  left: number
  right: number
}

export interface TemplateConfig {
  id: string
  name: string
  description: string
  supportsPhoto: boolean
  category: 'classic' | 'modern' | 'minimal' | 'creative'
  pages?: number
  margins: Margins
}

export type ZoomLevel = 50 | 75 | 100 | 125 | 150 | 'fit'

export interface AppState {
  resume: ResumeData
  templateId: string
  sectionOrder: SectionOrder[]
  sectionVisibility: SectionVisibility
  zoom: ZoomLevel
  darkMode: boolean
}
