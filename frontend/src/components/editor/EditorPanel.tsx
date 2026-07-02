import { ReactNode, useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useResumeStore } from '@/stores/resume-store'
import { SectionWrapper } from './SectionWrapper'
import { PersonalInfoForm } from './PersonalInfoForm'
import { SummaryForm } from './SummaryForm'
import { ExperienceForm } from './ExperienceForm'
import { SkillsForm } from './SkillsForm'
import { ProjectsForm } from './ProjectsForm'
import { EducationForm } from './EducationForm'
import { CertificationsForm } from './CertificationsForm'
import { AchievementsForm } from './AchievementsForm'
import { PublicationsForm } from './PublicationsForm'
import { LanguagesForm } from './LanguagesForm'
import { CustomSectionsForm } from './CustomSectionsForm'

const sectionComponents: Record<string, ReactNode> = {
  summary: <SummaryForm />,
  experience: <ExperienceForm />,
  skills: <SkillsForm />,
  projects: <ProjectsForm />,
  education: <EducationForm />,
  certifications: <CertificationsForm />,
  achievements: <AchievementsForm />,
  publications: <PublicationsForm />,
  languages: <LanguagesForm />,
  customSections: <CustomSectionsForm />,
}

const sectionLabels: Record<string, string> = {
  summary: 'Professional Summary',
  experience: 'Work Experience',
  skills: 'Technical Skills',
  projects: 'Projects',
  education: 'Education',
  certifications: 'Certifications',
  achievements: 'Achievements',
  publications: 'Publications',
  languages: 'Languages',
  customSections: 'Custom Sections',
}

export function EditorPanel() {
  const sectionOrder = useResumeStore((s) => s.sectionOrder)
  const sectionVisibility = useResumeStore((s) => s.sectionVisibility)
  const reorderSections = useResumeStore((s) => s.reorderSections)
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({})

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const visibleSections = sectionOrder.filter(
    (s) => sectionVisibility[s.type] ?? false
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = sectionOrder.findIndex((s) => s.id === active.id)
    const newIndex = sectionOrder.findIndex((s) => s.id === over.id)
    if (oldIndex !== -1 && newIndex !== -1) {
      reorderSections(oldIndex, newIndex)
    }
  }

  function toggleCollapse(sectionId: string) {
    setCollapsedSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }))
  }

  return (
    <div className="p-4 space-y-4">
      <PersonalInfoForm />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={visibleSections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {visibleSections.map((section) => (
            <SectionWrapper
              key={section.id}
              id={section.id}
              label={sectionLabels[section.type] || section.label}
              collapsed={collapsedSections[section.id] ?? false}
              onToggleCollapse={() => toggleCollapse(section.id)}
            >
              {sectionComponents[section.type]}
            </SectionWrapper>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  )
}
