import { memo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MonthPicker } from '@/components/ui/month-picker'
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

const SortableEducationEntry = memo(function SortableEducationEntry({
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
    <Card
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'opacity-50 bg-muted' : ''}
    >
      <CardContent className="p-3 space-y-2">
      <div className="flex items-center gap-2">
        <button
          aria-label={`Drag to reorder education ${index + 1}`}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
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
          aria-label={`Remove education ${index + 1}`}
        >
          <Trash2 className="h-3 w-3 text-destructive" />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label htmlFor={`edu-institution-${education.id}`} className="text-[10px]">Institution *</Label>
          <Input
            id={`edu-institution-${education.id}`}
            name="institution"
            autoComplete="organization"
            value={education.institution}
            onChange={(e) => updateEducation(education.id, 'institution', e.target.value)}
            placeholder="MIT"
            className="h-7 text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`edu-degree-${education.id}`} className="text-[10px]">Degree *</Label>
          <Input
            id={`edu-degree-${education.id}`}
            name="degree"
            autoComplete="off"
            value={education.degree}
            onChange={(e) => updateEducation(education.id, 'degree', e.target.value)}
            placeholder="B.S. Computer Science"
            className="h-7 text-xs"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-1">
          <Label htmlFor={`edu-spec-${education.id}`} className="text-[10px]">Specialization</Label>
          <Input
            id={`edu-spec-${education.id}`}
            name="specialization"
            value={education.specialization}
            onChange={(e) => updateEducation(education.id, 'specialization', e.target.value)}
            placeholder="AI/ML"
            className="h-7 text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`edu-cgpa-${education.id}`} className="text-[10px]">CGPA</Label>
          <Input
            id={`edu-cgpa-${education.id}`}
            name="cgpa"
            autoComplete="off"
            value={education.cgpa}
            onChange={(e) => updateEducation(education.id, 'cgpa', e.target.value)}
            placeholder="3.9/4.0"
            className="h-7 text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[10px]">Dates</Label>
          <div className="flex gap-1">
            <div className="flex-1">
              <Label htmlFor={`edu-start-${education.id}`} className="sr-only">Start date</Label>
              <MonthPicker
                id={`edu-start-${education.id}`}
                value={education.startDate}
                onValueChange={(val) => updateEducation(education.id, 'startDate', val)}
                aria-label="Start date"
                className="h-7 text-xs"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor={`edu-end-${education.id}`} className="sr-only">End date</Label>
              <MonthPicker
                id={`edu-end-${education.id}`}
                value={education.endDate}
                onValueChange={(val) => updateEducation(education.id, 'endDate', val)}
                aria-label="End date"
                className="h-7 text-xs"
              />
            </div>
          </div>
        </div>
      </div>
      </CardContent>
    </Card>
  )
})

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
        <Plus className="h-3 w-3 mr-1" aria-hidden="true" />
        Add Education
      </Button>
    </div>
  )
}
