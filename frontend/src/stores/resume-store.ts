import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  ResumeData,
  SectionOrder,
  SectionVisibility,
  ZoomLevel,
  Experience,
  Education,
  Project,
  Certification,
  Achievement,
  Publication,
  Language,
  CustomSection,
} from '@/types/resume'
import { generateId } from '@/lib/utils'

interface ResumeStore {
  resume: ResumeData
  templateId: string
  sectionOrder: SectionOrder[]
  sectionVisibility: SectionVisibility
  zoom: ZoomLevel
  darkMode: boolean

  setTemplateId: (id: string) => void
  setZoom: (zoom: ZoomLevel) => void
  toggleDarkMode: () => void

  updatePersonalInfo: (field: string, value: string) => void
  updateSummary: (value: string) => void

  addExperience: () => void
  updateExperience: (id: string, field: keyof Experience, value: string | boolean) => void
  updateExperienceBulletPoints: (id: string, bullets: string[]) => void
  removeExperience: (id: string) => void
  reorderExperience: (oldIndex: number, newIndex: number) => void

  addEducation: () => void
  updateEducation: (id: string, field: keyof Education, value: string) => void
  removeEducation: (id: string) => void
  reorderEducation: (oldIndex: number, newIndex: number) => void

  addSkillCategory: () => void
  updateSkillCategory: (id: string, name: string) => void
  updateSkills: (categoryId: string, skills: string[]) => void
  removeSkillCategory: (id: string) => void
  reorderSkillCategories: (oldIndex: number, newIndex: number) => void

  addProject: () => void
  updateProject: (id: string, field: keyof Project, value: string | string[]) => void
  removeProject: (id: string) => void
  reorderProjects: (oldIndex: number, newIndex: number) => void

  addCertification: () => void
  updateCertification: (id: string, field: keyof Certification, value: string) => void
  removeCertification: (id: string) => void

  addAchievement: () => void
  updateAchievement: (id: string, field: keyof Achievement, value: string) => void
  removeAchievement: (id: string) => void

  addPublication: () => void
  updatePublication: (id: string, field: keyof Publication, value: string) => void
  removePublication: (id: string) => void

  addLanguage: () => void
  updateLanguage: (id: string, field: keyof Language, value: string) => void
  removeLanguage: (id: string) => void

  addCustomSection: () => void
  updateCustomSection: (id: string, field: keyof CustomSection, value: string) => void
  removeCustomSection: (id: string) => void

  toggleSectionVisibility: (section: keyof SectionVisibility) => void
  reorderSections: (oldIndex: number, newIndex: number) => void

  resetResume: () => void
}

const defaultResume: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: '',
    professionalTitle: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  achievements: [],
  publications: [],
  languages: [],
  customSections: [],
}

const defaultSectionOrder: SectionOrder[] = [
  { id: '1', type: 'summary', label: 'Professional Summary' },
  { id: '2', type: 'experience', label: 'Work Experience' },
  { id: '3', type: 'skills', label: 'Technical Skills' },
  { id: '4', type: 'projects', label: 'Projects' },
  { id: '5', type: 'education', label: 'Education' },
  { id: '6', type: 'certifications', label: 'Certifications' },
  { id: '7', type: 'achievements', label: 'Achievements' },
  { id: '8', type: 'publications', label: 'Publications' },
  { id: '9', type: 'languages', label: 'Languages' },
  { id: '10', type: 'customSections', label: 'Custom Sections' },
]

const defaultSectionVisibility: SectionVisibility = {
  personalInfo: true,
  summary: true,
  experience: true,
  education: true,
  skills: true,
  projects: true,
  certifications: false,
  achievements: false,
  publications: false,
  languages: false,
  customSections: false,
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      resume: defaultResume,
      templateId: 'classic',
      sectionOrder: defaultSectionOrder,
      sectionVisibility: defaultSectionVisibility,
      zoom: 100,
      darkMode: false,

      setTemplateId: (id) => set({ templateId: id }),
      setZoom: (zoom) => set({ zoom }),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

      updatePersonalInfo: (field, value) =>
        set((state) => ({
          resume: {
            ...state.resume,
            personalInfo: { ...state.resume.personalInfo, [field]: value },
          },
        })),

      updateSummary: (value) =>
        set((state) => ({ resume: { ...state.resume, summary: value } })),

      addExperience: () =>
        set((state) => ({
          resume: {
            ...state.resume,
            experience: [
              ...state.resume.experience,
              {
                id: generateId(),
                company: '',
                position: '',
                location: '',
                startDate: '',
                endDate: '',
                current: false,
                description: '',
                bulletPoints: [''],
              },
            ],
          },
        })),

      updateExperience: (id, field, value) =>
        set((state) => ({
          resume: {
            ...state.resume,
            experience: state.resume.experience.map((exp) =>
              exp.id === id ? { ...exp, [field]: value } : exp
            ),
          },
        })),

      updateExperienceBulletPoints: (id, bullets) =>
        set((state) => ({
          resume: {
            ...state.resume,
            experience: state.resume.experience.map((exp) =>
              exp.id === id ? { ...exp, bulletPoints: bullets } : exp
            ),
          },
        })),

      removeExperience: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            experience: state.resume.experience.filter((exp) => exp.id !== id),
          },
        })),

      reorderExperience: (oldIndex, newIndex) =>
        set((state) => {
          const items = [...state.resume.experience]
          const [removed] = items.splice(oldIndex, 1)
          items.splice(newIndex, 0, removed)
          return { resume: { ...state.resume, experience: items } }
        }),

      addEducation: () =>
        set((state) => ({
          resume: {
            ...state.resume,
            education: [
              ...state.resume.education,
              {
                id: generateId(),
                institution: '',
                degree: '',
                specialization: '',
                cgpa: '',
                startDate: '',
                endDate: '',
                description: '',
              },
            ],
          },
        })),

      updateEducation: (id, field, value) =>
        set((state) => ({
          resume: {
            ...state.resume,
            education: state.resume.education.map((edu) =>
              edu.id === id ? { ...edu, [field]: value } : edu
            ),
          },
        })),

      removeEducation: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            education: state.resume.education.filter((edu) => edu.id !== id),
          },
        })),

      reorderEducation: (oldIndex, newIndex) =>
        set((state) => {
          const items = [...state.resume.education]
          const [removed] = items.splice(oldIndex, 1)
          items.splice(newIndex, 0, removed)
          return { resume: { ...state.resume, education: items } }
        }),

      addSkillCategory: () =>
        set((state) => ({
          resume: {
            ...state.resume,
            skills: [
              ...state.resume.skills,
              { id: generateId(), name: '', skills: [] },
            ],
          },
        })),

      updateSkillCategory: (id, name) =>
        set((state) => ({
          resume: {
            ...state.resume,
            skills: state.resume.skills.map((cat) =>
              cat.id === id ? { ...cat, name } : cat
            ),
          },
        })),

      updateSkills: (categoryId, skills) =>
        set((state) => ({
          resume: {
            ...state.resume,
            skills: state.resume.skills.map((cat) =>
              cat.id === categoryId ? { ...cat, skills } : cat
            ),
          },
        })),

      removeSkillCategory: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            skills: state.resume.skills.filter((cat) => cat.id !== id),
          },
        })),

      reorderSkillCategories: (oldIndex, newIndex) =>
        set((state) => {
          const items = [...state.resume.skills]
          const [removed] = items.splice(oldIndex, 1)
          items.splice(newIndex, 0, removed)
          return { resume: { ...state.resume, skills: items } }
        }),

      addProject: () =>
        set((state) => ({
          resume: {
            ...state.resume,
            projects: [
              ...state.resume.projects,
              {
                id: generateId(),
                name: '',
                description: '',
                bulletPoints: [''],
                technologies: [],
                githubUrl: '',
                liveDemoUrl: '',
                role: '',
                duration: '',
              },
            ],
          },
        })),

      updateProject: (id, field, value) =>
        set((state) => ({
          resume: {
            ...state.resume,
            projects: state.resume.projects.map((proj) =>
              proj.id === id ? { ...proj, [field]: value } : proj
            ),
          },
        })),

      removeProject: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            projects: state.resume.projects.filter((proj) => proj.id !== id),
          },
        })),

      reorderProjects: (oldIndex, newIndex) =>
        set((state) => {
          const items = [...state.resume.projects]
          const [removed] = items.splice(oldIndex, 1)
          items.splice(newIndex, 0, removed)
          return { resume: { ...state.resume, projects: items } }
        }),

      addCertification: () =>
        set((state) => ({
          resume: {
            ...state.resume,
            certifications: [
              ...state.resume.certifications,
              { id: generateId(), name: '', issuer: '', date: '', url: '' },
            ],
          },
        })),

      updateCertification: (id, field, value) =>
        set((state) => ({
          resume: {
            ...state.resume,
            certifications: state.resume.certifications.map((cert) =>
              cert.id === id ? { ...cert, [field]: value } : cert
            ),
          },
        })),

      removeCertification: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            certifications: state.resume.certifications.filter(
              (cert) => cert.id !== id
            ),
          },
        })),

      addAchievement: () =>
        set((state) => ({
          resume: {
            ...state.resume,
            achievements: [
              ...state.resume.achievements,
              { id: generateId(), title: '', description: '', date: '' },
            ],
          },
        })),

      updateAchievement: (id, field, value) =>
        set((state) => ({
          resume: {
            ...state.resume,
            achievements: state.resume.achievements.map((ach) =>
              ach.id === id ? { ...ach, [field]: value } : ach
            ),
          },
        })),

      removeAchievement: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            achievements: state.resume.achievements.filter(
              (ach) => ach.id !== id
            ),
          },
        })),

      addPublication: () =>
        set((state) => ({
          resume: {
            ...state.resume,
            publications: [
              ...state.resume.publications,
              { id: generateId(), title: '', publisher: '', date: '', url: '', description: '' },
            ],
          },
        })),

      updatePublication: (id, field, value) =>
        set((state) => ({
          resume: {
            ...state.resume,
            publications: state.resume.publications.map((pub) =>
              pub.id === id ? { ...pub, [field]: value } : pub
            ),
          },
        })),

      removePublication: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            publications: state.resume.publications.filter(
              (pub) => pub.id !== id
            ),
          },
        })),

      addLanguage: () =>
        set((state) => ({
          resume: {
            ...state.resume,
            languages: [
              ...state.resume.languages,
              { id: generateId(), name: '', proficiency: 'Intermediate' },
            ],
          },
        })),

      updateLanguage: (id, field, value) =>
        set((state) => ({
          resume: {
            ...state.resume,
            languages: state.resume.languages.map((lang) =>
              lang.id === id ? { ...lang, [field]: value } : lang
            ),
          },
        })),

      removeLanguage: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            languages: state.resume.languages.filter((lang) => lang.id !== id),
          },
        })),

      addCustomSection: () =>
        set((state) => ({
          resume: {
            ...state.resume,
            customSections: [
              ...state.resume.customSections,
              { id: generateId(), title: '', content: '' },
            ],
          },
        })),

      updateCustomSection: (id, field, value) =>
        set((state) => ({
          resume: {
            ...state.resume,
            customSections: state.resume.customSections.map((sec) =>
              sec.id === id ? { ...sec, [field]: value } : sec
            ),
          },
        })),

      removeCustomSection: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            customSections: state.resume.customSections.filter(
              (sec) => sec.id !== id
            ),
          },
        })),

      toggleSectionVisibility: (section) =>
        set((state) => ({
          sectionVisibility: {
            ...state.sectionVisibility,
            [section]: !state.sectionVisibility[section],
          },
        })),

      reorderSections: (oldIndex, newIndex) =>
        set((state) => {
          const items = [...state.sectionOrder]
          const [removed] = items.splice(oldIndex, 1)
          items.splice(newIndex, 0, removed)
          return { sectionOrder: items }
        }),

      resetResume: () =>
        set({
          resume: defaultResume,
          templateId: 'classic',
          sectionOrder: defaultSectionOrder,
          sectionVisibility: defaultSectionVisibility,
          zoom: 100,
        }),
    }),
    {
      name: 'latex-resume-storage',
    }
  )
)
