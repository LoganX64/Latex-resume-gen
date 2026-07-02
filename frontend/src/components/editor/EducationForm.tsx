import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useResumeStore } from '@/stores/resume-store'
import { Plus, Trash2, GripVertical } from 'lucide-react'
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

function SortableEducationEntry({
  id,
  index,
}: {
  id: string
  index: number
}) {
  const education = useResumeStore((s) => s.resume.education[index])
  const updateEducation = useResumeStore((s) => s.updateEducation)
  const removeEducation = useResumeStore((s) => s.removeEducation)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  if (!education) return null

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border rounded-md p-3 space-y-2 ${isDragging ? 'opacity-50 bg-muted' : 'bg-card'}`}
    >
      <div className="flex items-center gap-2">
        <button
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
        <span className="text-[10px] font-medium text-muted-foreground flex-1">
          Education {index + 1}
        </span>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => removeEducation(education.id)}
        >
          <Trash2 className="h-3 w-3 text-destructive" />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-[10px]">Institution *</Label>
          <Input
            value={education.institution}
            onChange={(e) => updateEducation(education.id, 'institution', e.target.value)}
            placeholder="MIT"
            className="h-7 text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[10px]">Degree *</Label>
          <Input
            value={education.degree}
            onChange={(e) => updateEducation(education.id, 'degree', e.target.value)}
            placeholder="B.S. Computer Science"
            className="h-7 text-xs"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-1">
          <Label className="text-[10px]">Specialization</Label>
          <Input
            value={education.specialization}
            onChange={(e) => updateEducation(education.id, 'specialization', e.target.value)}
            placeholder="AI/ML"
            className="h-7 text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[10px]">CGPA</Label>
          <Input
            value={education.cgpa}
            onChange={(e) => updateEducation(education.id, 'cgpa', e.target.value)}
            placeholder="3.9/4.0"
            className="h-7 text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[10px]">Dates</Label>
          <div className="flex gap-1">
            <Input
              type="month"
              value={education.startDate}
              onChange={(e) => updateEducation(education.id, 'startDate', e.target.value)}
              className="h-7 text-xs"
            />
            <Input
              type="month"
              value={education.endDate}
              onChange={(e) => updateEducation(education.id, 'endDate', e.target.value)}
              className="h-7 text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export function EducationForm() {
  const education = useResumeStore((s) => s.resume.education)
  const addEducation = useResumeStore((s) => s.addEducation)
  const reorderEducation = useResumeStore((s) => s.reorderEducation)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = education.findIndex((e) => e.id === active.id)
    const newIndex = education.findIndex((e) => e.id === over.id)
    if (oldIndex !== -1 && newIndex !== -1) {
      reorderEducation(oldIndex, newIndex)
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
          items={education.map((e) => e.id)}
          strategy={verticalListSortingStrategy}
        >
          {education.map((edu, index) => (
            <SortableEducationEntry key={edu.id} id={edu.id} index={index} />
          ))}
        </SortableContext>
      </DndContext>
      <Button
        variant="outline"
        size="sm"
        className="h-7 text-xs w-full"
        onClick={addEducation}
      >
        <Plus className="h-3 w-3 mr-1" />
        Add Education
      </Button>
    </div>
  )
}
