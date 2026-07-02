import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useResumeStore } from '@/stores/resume-store'
import { Plus, Trash2 } from 'lucide-react'

export function CustomSectionsForm() {
  const customSections = useResumeStore((s) => s.resume.customSections)
  const addCustomSection = useResumeStore((s) => s.addCustomSection)
  const updateCustomSection = useResumeStore((s) => s.updateCustomSection)
  const removeCustomSection = useResumeStore((s) => s.removeCustomSection)

  return (
    <div className="space-y-3">
      {customSections.map((section, index) => (
        <div key={section.id} className="border rounded-md p-3 space-y-2 bg-card">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium text-muted-foreground flex-1">
              Custom Section {index + 1}
            </span>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => removeCustomSection(section.id)}
            >
              <Trash2 className="h-3 w-3 text-destructive" />
            </Button>
          </div>
          <div className="space-y-1">
            <Label className="text-[10px]">Section Title *</Label>
            <Input
              value={section.title}
              onChange={(e) => updateCustomSection(section.id, 'title', e.target.value)}
              placeholder="e.g., Volunteer Experience"
              className="h-7 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px]">Content *</Label>
            <Textarea
              value={section.content}
              onChange={(e) => updateCustomSection(section.id, 'content', e.target.value)}
              placeholder="Enter content for this section..."
              className="min-h-[80px] text-xs resize-y"
            />
          </div>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        className="h-7 text-xs w-full"
        onClick={addCustomSection}
      >
        <Plus className="h-3 w-3 mr-1" />
        Add Custom Section
      </Button>
    </div>
  )
}
