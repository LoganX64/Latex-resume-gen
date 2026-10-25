import { ReactNode, useEffect, useRef, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useResumeStore } from "@/stores/resume-store";
import { SectionWrapper } from "@/components/editor/SectionWrapper";
import { EditorSection } from "@/components/editor/EditorSection";
import { PersonalInfoForm } from "@/components/editor/PersonalInfoForm";
import { SummaryForm } from "@/components/editor/SummaryForm";
import { ExperienceForm } from "@/components/editor/ExperienceForm";
import { SkillsForm } from "@/components/editor/SkillsForm";
import { ProjectsForm } from "@/components/editor/ProjectsForm";
import { EducationForm } from "@/components/editor/EducationForm";
import { CertificationsForm } from "@/components/editor/CertificationsForm";
import { AchievementsForm } from "@/components/editor/AchievementsForm";
import { PublicationsForm } from "@/components/editor/PublicationsForm";
import { LanguagesForm } from "@/components/editor/LanguagesForm";
import { CustomSectionsForm } from "@/components/editor/CustomSectionsForm";
import { faChevronDown } from "@/lib/icons";
import "@/components/v2/editor/editor-scroll-v2.css";

const sectionComponents: Record<string, ReactNode> = {
  summary: <SummaryForm />,
  experience: <ExperienceForm />,
  skills: <SkillsForm />,
  projects: <ProjectsForm />,
  education: <EducationForm />,
  certifications: <CertificationsForm />,
  achievements: <AchievementsForm />,
  publications: <PublicationsForm />,
  languages: <LanguagesForm indicatorIcon={faChevronDown} />,
  customSections: <CustomSectionsForm />,
};

const sectionLabels: Record<string, string> = {
  summary: "Professional Summary",
  experience: "Work Experience",
  skills: "Technical Skills",
  projects: "Projects",
  education: "Education",
  certifications: "Certifications",
  achievements: "Achievements",
  publications: "Publications",
  languages: "Languages",
  customSections: "Custom Sections",
};

interface EditorPanelV2Props {
  activeSection?: string;
}

export function EditorPanelV2({ activeSection }: EditorPanelV2Props) {
  const sectionOrder = useResumeStore((s) => s.sectionOrder);
  const reorderSections = useResumeStore((s) => s.reorderSections);
  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const previousActiveSection = useRef(activeSection);

  useEffect(() => {
    if (!activeSection) return;
    if (previousActiveSection.current === activeSection) return;
    previousActiveSection.current = activeSection;

    const container = scrollRef.current;
    const el = document.getElementById(`section-${activeSection}`);
    if (!container || !el) return;

    const containerTop = container.getBoundingClientRect().top;
    const targetTop = el.getBoundingClientRect().top;

    container.scrollTo({
      top: container.scrollTop + targetTop - containerTop - 8,
      behavior: "smooth",
    });
  }, [activeSection]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    const onScroll = () => {
      el.classList.add("is-scrolling");
      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = setTimeout(() => el.classList.remove("is-scrolling"), 900);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const visibleSections = sectionOrder;

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sectionOrder.findIndex((s) => s.id === active.id);
    const newIndex = sectionOrder.findIndex((s) => s.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      reorderSections(oldIndex, newIndex);
    }
  }

  function toggleCollapse(sectionId: string) {
    setCollapsedSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  }

  return (
    <div
      id="editor-main"
      ref={scrollRef}
      className="editor-scroll-v2 h-full overflow-y-auto overscroll-contain px-3 pb-28 pt-1 sm:px-4"
    >
      <div className="space-y-4">
        <EditorSection sectionType="personal">
          <PersonalInfoForm />
        </EditorSection>

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
              <EditorSection key={section.id} sectionType={section.type}>
                <SectionWrapper
                  id={section.id}
                  sectionType={section.type}
                  label={sectionLabels[section.type] || section.label}
                  collapsed={collapsedSections[section.id] ?? false}
                  onToggleCollapse={() => toggleCollapse(section.id)}
                >
                  {sectionComponents[section.type]}
                </SectionWrapper>
              </EditorSection>
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
