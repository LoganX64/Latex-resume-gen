import { memo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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

const SortableProjectEntry = memo(function SortableProjectEntry({
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
    <Card
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'opacity-50 bg-muted' : ''}
    >
      <CardContent className="p-3 space-y-2">
      <div className="flex items-center gap-2">
        <button
          aria-label={`Drag to reorder project ${index + 1}`}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
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
          aria-label={`Remove project ${index + 1}`}
        >
          <Trash2 className="h-3 w-3 text-destructive" />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label htmlFor={`proj-name-${project.id}`} className="text-[10px]">Project Name *</Label>
          <Input
            id={`proj-name-${project.id}`}
            name="projectName"
            autoComplete="off"
            value={project.name}
            onChange={(e) => updateProject(project.id, 'name', e.target.value)}
            placeholder="E-Commerce Platform"
            className="h-7 text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`proj-duration-${project.id}`} className="text-[10px]">Duration</Label>
          <Input
            id={`proj-duration-${project.id}`}
            name="projectDuration"
            autoComplete="off"
            value={project.duration}
            onChange={(e) => updateProject(project.id, 'duration', e.target.value)}
            placeholder="2023 - Present"
            className="h-7 text-xs"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label htmlFor={`proj-role-${project.id}`} className="text-[10px]">Role</Label>
          <Input
            id={`proj-role-${project.id}`}
            name="projectRole"
            value={project.role}
            onChange={(e) => updateProject(project.id, 'role', e.target.value)}
            placeholder="Lead Developer"
            className="h-7 text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`proj-desc-${project.id}`} className="text-[10px]">Description</Label>
          <Textarea
            id={`proj-desc-${project.id}`}
            name="projectDescription"
            value={project.description}
            onChange={(e) => updateProject(project.id, 'description', e.target.value)}
            placeholder="Brief description of the project…"
            className="min-h-[60px] text-xs resize-y"
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-[10px]">Bullet Points</Label>
        {(project.bulletPoints || []).map((bullet, bIndex) => (
          <div key={bIndex} className="flex gap-1">
            <Input
              name="projectBulletPoint"
              autoComplete="off"
              value={bullet}
              onChange={(e) => {
                const newBullets = [...(project.bulletPoints || [])]
                newBullets[bIndex] = e.target.value
                updateProject(project.id, 'bulletPoints', newBullets)
              }}
              placeholder="• Describe a feature or achievement…"
              aria-label={`Bullet point ${bIndex + 1}`}
              className="h-7 text-xs"
            />
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => {
                const newBullets = (project.bulletPoints || []).filter((_, i) => i !== bIndex)
                updateProject(project.id, 'bulletPoints', newBullets.length ? newBullets : [''])
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
            updateProject(project.id, 'bulletPoints', [...(project.bulletPoints || []), ''])
          }
        >
          <Plus className="h-3 w-3 mr-1" aria-hidden="true" />
          Add Bullet
        </Button>
      </div>
      <div className="flex flex-wrap gap-1">
        {(project.technologies || []).map((tech, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground rounded px-2 py-0.5 text-[10px] max-w-[200px] truncate"
          >
            {tech}
            <button
              onClick={() => removeTech(i)}
              aria-label={`Remove ${tech}`}
              className="hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-sm"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-1">
        <Input
          name="newTechnology"
          autoComplete="off"
          value={newTech}
          onChange={(e) => setNewTech(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addTech()
            }
          }}
          placeholder="Add technology and press Enter"
          aria-label="New technology name"
          className="h-7 text-xs"
        />
        <Button variant="outline" size="sm" className="h-7 text-[10px] px-2" onClick={addTech}>
          Add
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label htmlFor={`proj-github-${project.id}`} className="text-[10px]">GitHub URL</Label>
          <Input
            id={`proj-github-${project.id}`}
            name="projectGitHubUrl"
            autoComplete="url"
            value={project.githubUrl}
            onChange={(e) => updateProject(project.id, 'githubUrl', e.target.value)}
            placeholder="github.com/user/project"
            type="url"
            inputMode="url"
            className="h-7 text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`proj-demo-${project.id}`} className="text-[10px]">Live Demo URL</Label>
          <Input
            id={`proj-demo-${project.id}`}
            name="projectDemoUrl"
            autoComplete="url"
            value={project.liveDemoUrl}
            onChange={(e) => updateProject(project.id, 'liveDemoUrl', e.target.value)}
            placeholder="project.example.com"
            type="url"
            inputMode="url"
            className="h-7 text-xs"
          />
        </div>
      </div>
      </CardContent>
    </Card>
  )
})

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
        <Plus className="h-3 w-3 mr-1" aria-hidden="true" />
        Add Project
      </Button>
    </div>
  )
}
