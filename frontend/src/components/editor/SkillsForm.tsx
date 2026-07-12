import { memo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useResumeStore } from '@/stores/resume-store'
import { Plus, Trash2, GripVertical, X } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const SortableSkillCategory = memo(function SortableSkillCategory({
  id,
  index,
}: {
  id: string
  index: number
}) {
  const category = useResumeStore((s) => s.resume.skills[index])
  const updateSkillCategory = useResumeStore((s) => s.updateSkillCategory)
  const updateSkills = useResumeStore((s) => s.updateSkills)
  const removeSkillCategory = useResumeStore((s) => s.removeSkillCategory)
  const [newSkill, setNewSkill] = useState('')

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  if (!category) return null

  function addSkill() {
    if (!newSkill.trim()) return
    updateSkills(category.id, [...category.skills, newSkill.trim()])
    setNewSkill('')
  }

  function removeSkill(skillIndex: number) {
    updateSkills(
      category.id,
      category.skills.filter((_, i) => i !== skillIndex)
    )
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'opacity-50 bg-muted' : ''}
    >
      <CardContent className="p-3 space-y-2">
      <div className="flex items-center gap-2">
        <button
          aria-label={`Drag to reorder ${category.name || 'skill category'}`}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
        <Input
          name="skillCategoryName"
          autoComplete="off"
          value={category.name}
          onChange={(e) => updateSkillCategory(category.id, e.target.value)}
          placeholder="Category name (e.g., Programming Languages)"
          aria-label="Skill category name"
          className="h-7 text-xs flex-1"
        />
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => removeSkillCategory(category.id)}
          aria-label={`Remove ${category.name || 'skill category'}`}
        >
          <Trash2 className="h-3 w-3 text-destructive" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-1">
        {category.skills.map((skill, sIndex) => (
          <span
            key={sIndex}
            className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground rounded px-2 py-0.5 text-[10px] max-w-[200px] truncate"
          >
            {skill}
            <button
              onClick={() => removeSkill(sIndex)}
              aria-label={`Remove ${skill}`}
              className="hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-sm"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-1">
        <Input
          name="newSkill"
          autoComplete="off"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addSkill()
            }
          }}
          placeholder="Type a skill and press Enter…"
          aria-label="New skill name"
          className="h-7 text-xs"
        />
        <Button variant="outline" size="sm" className="h-7 text-[10px] px-2" onClick={addSkill}>
          Add
        </Button>
      </div>
      </CardContent>
    </Card>
  )
})

export function SkillsForm() {
  const skills = useResumeStore((s) => s.resume.skills)
  const addSkillCategory = useResumeStore((s) => s.addSkillCategory)
  const reorderSkillCategories = useResumeStore((s) => s.reorderSkillCategories)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = skills.findIndex((s) => s.id === active.id)
    const newIndex = skills.findIndex((s) => s.id === over.id)
    if (oldIndex !== -1 && newIndex !== -1) {
      reorderSkillCategories(oldIndex, newIndex)
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
        className="h-7 text-xs w-full"
        onClick={addSkillCategory}
      >
        <Plus className="h-3 w-3 mr-1" aria-hidden="true" />
        Add Skill Category
      </Button>
    </div>
  )
}
