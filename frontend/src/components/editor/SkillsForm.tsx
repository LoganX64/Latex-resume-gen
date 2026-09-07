import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useResumeStore } from "@/stores/resume-store";
import { Icon } from "@/components/Icon";
import { faPlus, faTrash, faXmark, faGripVertical } from "@/lib/icons";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableSkillCategory = memo(function SortableSkillCategory({
  id,
  index,
}: {
  id: string;
  index: number;
}) {
  const category = useResumeStore((s) => s.resume.skills[index]);
  const updateSkillCategory = useResumeStore((s) => s.updateSkillCategory);
  const updateSkills = useResumeStore((s) => s.updateSkills);
  const removeSkillCategory = useResumeStore((s) => s.removeSkillCategory);
  const [newSkill, setNewSkill] = useState("");

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (!category) return null;

  function addSkill() {
    if (!newSkill.trim()) return;
    updateSkills(category.id, [...category.skills, newSkill.trim()]);
    setNewSkill("");
  }

  function removeSkill(skillIndex: number) {
    updateSkills(
      category.id,
      category.skills.filter((_, i) => i !== skillIndex),
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex flex-col gap-(--card-spacing) overflow-hidden rounded-lg bg-card text-xs/relaxed text-card-foreground ring-1 ring-foreground/10 [--card-spacing:--spacing(4)] ${isDragging ? "opacity-50 bg-muted" : ""}`}
    >
      <CardContent className="p-3 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex items-center gap-2">
            <button
              aria-label={`Drag to reorder ${category.name || "skill category"}`}
              className="cursor-grab active:cursor-grabbing text-rose-500 hover:text-rose-500/80 touch-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
              {...attributes}
              {...listeners}
            >
              <Icon icon={faGripVertical} className="h-3.5 w-3.5" />
            </button>

            <Input
              name="skillCategoryName"
              autoComplete="off"
              value={category.name}
              onChange={(e) => updateSkillCategory(category.id, e.target.value)}
              placeholder="Category name (e.g., Programming Languages)"
              aria-label="Skill category name"
              className="h-10 text-base sm:h-8 sm:text-sm flex-1 min-w-0"
            />

            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => removeSkillCategory(category.id)}
              aria-label={`Remove ${category.name || "skill category"}`}
            >
              <Icon icon={faTrash} className="h-3 w-3 text-rose-500" />
            </Button>
          </div>

          <div className="flex items-center gap-1 sm:flex-1 sm:min-w-[220px] sm:max-w-[300px] w-full sm:pl-0 pl-[22px]">
            <Input
              name="newSkill"
              autoComplete="off"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
              placeholder="Type a skill and press Enter…"
              aria-label="New skill name"
              className="h-10 text-base sm:h-8 sm:text-sm flex-1 min-w-0 w-full"
            />
            <Button
              variant="outline"
              size="sm"
              className="h-8 shrink-0 px-2 text-xs sm:h-8 sm:text-xs"
              onClick={addSkill}
            >
              Add
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {category.skills.map((skill, sIndex) => (
            <span
              key={sIndex}
              className="inline-flex max-w-[200px] min-w-0 items-center gap-1 rounded-md bg-secondary px-2 py-1 text-sm text-secondary-foreground sm:py-0.5 sm:text-xs"
            >
              <span className="min-w-0 truncate">{skill}</span>
              <button
                onClick={() => removeSkill(sIndex)}
                aria-label={`Remove ${skill}`}
                className="flex shrink-0 items-center justify-center rounded-sm text-rose-500 hover:text-rose-500/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 min-w-5 min-h-5 sm:min-w-0 sm:min-h-0"
              >
                <Icon
                  icon={faXmark}
                  className="h-3.5 w-3.5 sm:h-2.5 sm:w-2.5"
                />
              </button>
            </span>
          ))}
        </div>
      </CardContent>
    </div>
  );
});

export function SkillsForm() {
  const skills = useResumeStore((s) => s.resume.skills);
  const addSkillCategory = useResumeStore((s) => s.addSkillCategory);
  const reorderSkillCategories = useResumeStore(
    (s) => s.reorderSkillCategories,
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = skills.findIndex((s) => s.id === active.id);
    const newIndex = skills.findIndex((s) => s.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      reorderSkillCategories(oldIndex, newIndex);
    }
  }

  return (
    <div className="space-y-3">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={skills.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {skills.map((cat, index) => (
            <SortableSkillCategory key={cat.id} id={cat.id} index={index} />
          ))}
        </SortableContext>
      </DndContext>
      <Button
        variant="outline"
        size="sm"
        className="h-10 text-base sm:h-8 sm:text-sm w-full"
        onClick={addSkillCategory}
      >
        <Icon icon={faPlus} className="h-3 w-3 mr-1" aria-hidden="true" />
        Add Skill Category
      </Button>
    </div>
  );
}
