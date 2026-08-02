import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
        <Card key={section.id}>
          <CardContent className="p-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium text-muted-foreground flex-1">
              Custom Section {index + 1}
            </span>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => removeCustomSection(section.id)}
              aria-label={`Remove custom section ${index + 1}`}
            >
              <Trash2 className="h-3 w-3 text-destructive" />
            </Button>
          </div>
          <div className="space-y-1">
            <Label htmlFor={`custom-title-${section.id}`} className="text-xs sm:text-[10px]">Section Title *</Label>
            <Input
              id={`custom-title-${section.id}`}
              name="customSectionTitle"
              autoComplete="off"
              value={section.title}
              onChange={(e) => updateCustomSection(section.id, 'title', e.target.value)}
              placeholder="e.g., Volunteer Experience"
              className="h-10 text-base sm:h-7 sm:text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`custom-content-${section.id}`} className="text-xs sm:text-[10px]">Content *</Label>
            <Textarea
              id={`custom-content-${section.id}`}
              name="customSectionContent"
              value={section.content}
              onChange={(e) => updateCustomSection(section.id, 'content', e.target.value)}
              placeholder="Enter content for this section…"
              className="min-h-[80px] text-base sm:text-xs resize-y py-2"
            />
          </div>
          </CardContent>
        </Card>
      ))}
      <Button
        variant="outline"
        size="sm"
        className="h-10 text-base sm:h-7 sm:text-xs w-full"
        onClick={addCustomSection}
      >
        <Plus className="h-3 w-3 mr-1" aria-hidden="true" />
        Add Custom Section
      </Button>
    </div>
  )
}
