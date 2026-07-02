import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { useState } from 'react'

function SortableProjectEntry({
  id,
  index,
}: {
  id: string
  index: number
}) {
  const project = useResumeStore((s) => s.resume.projects[index])
  const updateProject = useResumeStore((s) => s.updateProject)
  const removeProject = useResumeStore((s) => s.removeProject)
  const [newTech, setNewTech] = useState('')

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  if (!project) return null

  function addTech() {
    if (!newTech.trim()) return
    updateProject(project.id, 'technologies', [...project.technologies, newTech.trim()])
    setNewTech('')
  }

  function removeTech(i: number) {
    updateProject(
      project.id,
      'technologies',
      project.technologies.filter((_, idx) => idx !== i)
    )
  }

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
          Project {index + 1}
        </span>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => removeProject(project.id)}
        >
          <Trash2 className="h-3 w-3 text-destructive" />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-[10px]">Project Name *</Label>
          <Input
            value={project.name}
            onChange={(e) => updateProject(project.id, 'name', e.target.value)}
            placeholder="E-Commerce Platform"
            className="h-7 text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[10px]">Role</Label>
          <Input
            value={project.role}
            onChange={(e) => updateProject(project.id, 'role', e.target.value)}
            placeholder="Lead Developer"
            className="h-7 text-xs"
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-[10px]">Description</Label>
        <Textarea
          value={project.description}
          onChange={(e) => updateProject(project.id, 'description', e.target.value)}
          placeholder="Brief description of the project..."
          className="min-h-[60px] text-xs resize-y"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-[10px]">Bullet Points</Label>
        {(project.bulletPoints || []).map((bullet, bIndex) => (
          <div key={bIndex} className="flex gap-1">
            <Input
              value={bullet}
              onChange={(e) => {
                const newBullets = [...(project.bulletPoints || [])]
                newBullets[bIndex] = e.target.value
                updateProject(project.id, 'bulletPoints', newBullets)
              }}
              placeholder="• Describe a feature or achievement..."
              className="h-7 text-xs"
            />
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => {
                const newBullets = (project.bulletPoints || []).filter((_, i) => i !== bIndex)
                updateProject(project.id, 'bulletPoints', newBullets.length ? newBullets : [''])
              }}
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
            updateProject(project.id, 'bulletPoints', [...(project.bulletPoints || []), ''])
          }
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Bullet
        </Button>
      </div>
      <div className="flex flex-wrap gap-1">
        {(project.technologies || []).map((tech, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground rounded px-2 py-0.5 text-[10px]"
          >
            {tech}
            <button onClick={() => removeTech(i)} className="hover:text-destructive">
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-1">
        <Input
          value={newTech}
          onChange={(e) => setNewTech(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addTech()
            }
          }}
          placeholder="Add technology and press Enter"
          className="h-7 text-xs"
        />
        <Button variant="outline" size="sm" className="h-7 text-[10px] px-2" onClick={addTech}>
          Add
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-[10px]">GitHub URL</Label>
          <Input
            value={project.githubUrl}
            onChange={(e) => updateProject(project.id, 'githubUrl', e.target.value)}
            placeholder="github.com/user/project"
            className="h-7 text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[10px]">Live Demo URL</Label>
          <Input
            value={project.liveDemoUrl}
            onChange={(e) => updateProject(project.id, 'liveDemoUrl', e.target.value)}
            placeholder="project.example.com"
            className="h-7 text-xs"
          />
        </div>
      </div>
    </div>
  )
}

export function ProjectsForm() {
  const projects = useResumeStore((s) => s.resume.projects)
  const addProject = useResumeStore((s) => s.addProject)
  const reorderProjects = useResumeStore((s) => s.reorderProjects)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = projects.findIndex((p) => p.id === active.id)
    const newIndex = projects.findIndex((p) => p.id === over.id)
    if (oldIndex !== -1 && newIndex !== -1) {
      reorderProjects(oldIndex, newIndex)
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
          items={projects.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          {projects.map((proj, index) => (
            <SortableProjectEntry key={proj.id} id={proj.id} index={index} />
          ))}
        </SortableContext>
      </DndContext>
      <Button
        variant="outline"
        size="sm"
        className="h-7 text-xs w-full"
        onClick={addProject}
      >
        <Plus className="h-3 w-3 mr-1" />
        Add Project
      </Button>
    </div>
  )
}
