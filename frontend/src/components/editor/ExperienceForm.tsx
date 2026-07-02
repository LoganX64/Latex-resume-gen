import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useResumeStore } from '@/stores/resume-store'
import { Plus, Trash2 } from 'lucide-react'
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
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

function SortableExperienceEntry({
  id,
  index,
}: {
  id: string
  index: number
}) {
  const experience = useResumeStore((s) => s.resume.experience[index])
  const updateExperience = useResumeStore((s) => s.updateExperience)
  const updateExperienceBulletPoints = useResumeStore((s) => s.updateExperienceBulletPoints)
  const removeExperience = useResumeStore((s) => s.removeExperience)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  if (!experience) return null

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border rounded-md p-3 space-y-2 ${isDragging ? 'opacity-50 bg-muted' : 'bg-card'}`}
    >
      <div className="flex items-center gap-2">
        <button
          aria-label={`Drag to reorder experience ${index + 1}`}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
        <span className="text-[10px] font-medium text-muted-foreground flex-1">
          Experience {index + 1}
        </span>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => removeExperience(experience.id)}
          aria-label={`Remove experience ${index + 1}`}
        >
          <Trash2 className="h-3 w-3 text-destructive" />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label htmlFor={`exp-company-${experience.id}`} className="text-[10px]">Company *</Label>
          <Input
            id={`exp-company-${experience.id}`}
            value={experience.company}
            onChange={(e) => updateExperience(experience.id, 'company', e.target.value)}
            placeholder="Google"
            className="h-7 text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`exp-position-${experience.id}`} className="text-[10px]">Position *</Label>
          <Input
            id={`exp-position-${experience.id}`}
            value={experience.position}
            onChange={(e) => updateExperience(experience.id, 'position', e.target.value)}
            placeholder="Senior Software Engineer"
            className="h-7 text-xs"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-1">
          <Label htmlFor={`exp-location-${experience.id}`} className="text-[10px]">Location</Label>
          <Input
            id={`exp-location-${experience.id}`}
            value={experience.location}
            onChange={(e) => updateExperience(experience.id, 'location', e.target.value)}
            placeholder="Mountain View, CA"
            className="h-7 text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`exp-start-${experience.id}`} className="text-[10px]">Start Date *</Label>
          <Input
            id={`exp-start-${experience.id}`}
            type="month"
            value={experience.startDate}
            onChange={(e) => updateExperience(experience.id, 'startDate', e.target.value)}
            className="h-7 text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`exp-end-${experience.id}`} className="text-[10px]">End Date</Label>
          <Input
            id={`exp-end-${experience.id}`}
            type="month"
            value={experience.endDate}
            onChange={(e) => updateExperience(experience.id, 'endDate', e.target.value)}
            disabled={experience.current}
            className="h-7 text-xs"
          />
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={`current-${experience.id}`}
            checked={experience.current}
            onChange={(e) => updateExperience(experience.id, 'current', e.target.checked)}
            className="rounded"
          />
          <Label htmlFor={`current-${experience.id}`} className="text-[10px]">
            Currently working here
          </Label>
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-[10px]">Bullet Points</Label>
        {experience.bulletPoints.map((bullet, bIndex) => (
          <div key={bIndex} className="flex gap-1">
            <Input
              value={bullet}
              onChange={(e) => {
                const newBullets = [...experience.bulletPoints]
                newBullets[bIndex] = e.target.value
                updateExperienceBulletPoints(experience.id, newBullets)
              }}
              placeholder="• Describe your achievement…"
              aria-label={`Bullet point ${bIndex + 1}`}
              className="h-7 text-xs"
            />
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => {
                const newBullets = experience.bulletPoints.filter((_, i) => i !== bIndex)
                updateExperienceBulletPoints(experience.id, newBullets.length ? newBullets : [''])
              }}
              aria-label={`Remove bullet point ${bIndex + 1}`}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
        <Button
          variant="ghost"
          size="sm"
          className="h-6 text-[10px]"
          onClick={() =>
            updateExperienceBulletPoints(experience.id, [...experience.bulletPoints, ''])
          }
        >
          <Plus className="h-3 w-3 mr-1" aria-hidden="true" />
          Add Bullet
        </Button>
      </div>
    </div>
  )
}

export function ExperienceForm() {
  const experience = useResumeStore((s) => s.resume.experience)
  const addExperience = useResumeStore((s) => s.addExperience)
  const reorderExperience = useResumeStore((s) => s.reorderExperience)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = experience.findIndex((e) => e.id === active.id)
    const newIndex = experience.findIndex((e) => e.id === over.id)
    if (oldIndex !== -1 && newIndex !== -1) {
      reorderExperience(oldIndex, newIndex)
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
          items={experience.map((e) => e.id)}
          strategy={verticalListSortingStrategy}
        >
          {experience.map((exp, index) => (
            <SortableExperienceEntry key={exp.id} id={exp.id} index={index} />
          ))}
        </SortableContext>
      </DndContext>
      <Button
        variant="outline"
        size="sm"
        className="h-7 text-xs w-full"
        onClick={addExperience}
      >
        <Plus className="h-3 w-3 mr-1" aria-hidden="true" />
        Add Experience
      </Button>
    </div>
  )
}
