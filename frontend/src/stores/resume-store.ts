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
  removeProfileImage: () => void
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
    fullName: 'Alex Chen',
    email: 'alex.chen@email.com',
    phone: '+1 (415) 555-0192',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexchen',
    github: 'github.com/alexchen',
    website: 'alexchen.dev',
    professionalTitle: 'Senior Full Stack Engineer',
  },
  summary: 'Full stack engineer with 6+ years building scalable web apps and microservices. Proficient in React, TypeScript, Node.js, and cloud infrastructure. Led monolithic-to-microservices migration reducing deployment time by 70%.',
  experience: [
    {
      id: 'exp1',
      company: 'Stripe',
      position: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      startDate: '2022-03',
      endDate: '',
      current: true,
      description: '',
      bulletPoints: [
        'Architected real-time payment analytics dashboard serving 50K+ merchants using React and WebSocket',
        'Led REST-to-GraphQL migration reducing payload size by 60% and page load times by 40%',
        'Implemented automated CI/CD pipeline with GitHub Actions, cutting deployment time from 45 to 12 minutes',
      ],
    },
    {
      id: 'exp2',
      company: 'Airbnb',
      position: 'Software Engineer',
      location: 'San Francisco, CA',
      startDate: '2020-01',
      endDate: '2022-02',
      current: false,
      description: '',
      bulletPoints: [
        'Built micro-frontend architecture for the host dashboard, enabling independent team deployments',
        'Developed RESTful APIs with Node.js and Express handling 10K+ requests per second',
        'Optimized PostgreSQL queries reducing average response time from 200ms to 45ms',
      ],
    },
    {
      id: 'exp3',
      company: 'Startup Labs',
      position: 'Full Stack Developer',
      location: 'Remote',
      startDate: '2018-06',
      endDate: '2019-12',
      current: false,
      description: '',
      bulletPoints: [
        'Developed MVP from scratch using React, Node.js, and MongoDB, launching in 3 months',
        'Set up AWS infrastructure with Terraform, achieving 99.9% uptime',
      ],
    },
  ],
  education: [
    {
      id: 'edu1',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      specialization: 'Computer Science',
      cgpa: '3.8/4.0',
      startDate: '2014-08',
      endDate: '2018-05',
      description: '',
    },
  ],
  skills: [
    {
      id: 'sk1',
      name: 'Languages',
      skills: ['TypeScript', 'JavaScript', 'Python', 'Go', 'SQL'],
    },
    {
      id: 'sk2',
      name: 'Frontend',
      skills: ['React', 'Next.js', 'Vue.js', 'Tailwind CSS', 'HTML5/CSS3'],
    },
    {
      id: 'sk3',
      name: 'Backend',
      skills: ['Node.js', 'Express', 'FastAPI', 'GraphQL', 'REST APIs'],
    },
    {
      id: 'sk4',
      name: 'Databases',
      skills: ['PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch'],
    },
    {
      id: 'sk5',
      name: 'Cloud & DevOps',
      skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions'],
    },
  ],
  projects: [
    {
      id: 'proj1',
      name: 'CloudDeploy',
      description: 'Open-source deployment platform for Docker containers with auto-scaling and zero-downtime deployments.',
      bulletPoints: [
        'Built CLI tool in Go for managing deployments across multiple cloud providers',
        'Achieved 1.2K+ GitHub stars and 50+ community contributors',
      ],
      technologies: ['Go', 'React', 'Docker', 'Kubernetes', 'AWS'],
      githubUrl: 'github.com/alexchen/clouddeploy',
      liveDemoUrl: 'clouddeploy.dev',
      role: 'Creator & Lead Developer',
      duration: '2023 - Present',
    },
    {
      id: 'proj2',
      name: 'DevMetrics',
      description: 'Developer productivity dashboard that integrates with GitHub, Jira, and Slack to track team performance.',
      bulletPoints: [
        'Designed and built real-time analytics pipeline processing 1M+ events daily',
        'Created interactive data visualizations with D3.js and React',
      ],
      technologies: ['TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'D3.js'],
      githubUrl: 'github.com/alexchen/devmetrics',
      liveDemoUrl: '',
      role: '',
      duration: '2022',
    },
  ],
  certifications: [
    {
      id: 'cert1',
      name: 'AWS Solutions Architect - Associate',
      issuer: 'Amazon Web Services',
      date: '2023-05',
      url: 'aws.amazon.com/certification',
    },
    {
      id: 'cert2',
      name: 'Google Cloud Professional Developer',
      issuer: 'Google Cloud',
      date: '2022-11',
      url: '',
    },
  ],
  achievements: [
    {
      id: 'ach1',
      title: 'Hackathon Winner - TechCrunch Disrupt 2023',
      description: 'Built AI-powered code review tool that won first place among 200+ teams.',
      date: '2023-09',
    },
  ],
  publications: [],
  languages: [
    {
      id: 'lang1',
      name: 'English',
      proficiency: 'Native',
    },
    {
      id: 'lang2',
      name: 'Mandarin',
      proficiency: 'Fluent',
    },
  ],
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

      removeProfileImage: () =>
        set((state) => {
          const { profileImage, ...rest } = state.resume.personalInfo
          return {
            resume: { ...state.resume, personalInfo: rest },
          }
        }),

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
            experience: state.resume.experience.map((exp) => {
              if (exp.id === id) {
                return { ...exp, [field]: value }
              }
              if (field === 'current' && value === true) {
                return { ...exp, current: false }
              }
              return exp
            }),
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
