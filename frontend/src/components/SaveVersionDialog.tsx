import { useState } from 'react'
import { useResumeStore } from '@/stores/resume-store'
import { useVersionsStore } from '@/stores/versions-store'
import { getTemplateConfig } from '@/templates'
import { toast } from 'sonner'
import { ImageOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

interface SaveVersionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SaveVersionDialog({ open, onOpenChange }: SaveVersionDialogProps) {
  const [name, setName] = useState('')
  const resume = useResumeStore((s) => s.resume)
  const templateId = useResumeStore((s) => s.templateId)
  const sectionOrder = useResumeStore((s) => s.sectionOrder)
  const sectionVisibility = useResumeStore((s) => s.sectionVisibility)
  const addVersion = useVersionsStore((s) => s.addVersion)

  const templateConfig = getTemplateConfig(templateId)
  const activeSections = sectionOrder.filter((s) => {
    if (s.type === 'personalInfo') return true
    return sectionVisibility[s.type]
  })

  function handleSave() {
    if (!name.trim()) return

    const { profileImage, ...personalInfoWithoutPhoto } = resume.personalInfo
    addVersion({
      name: name.trim(),
      resume: {
        ...resume,
        personalInfo: personalInfoWithoutPhoto,
      },
      templateId,
      sectionOrder,
      sectionVisibility,
    })

    toast.success('Resume saved', {
      description: `"${name.trim()}" saved as a version.`,
    })
    setName('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save Resume Version</DialogTitle>
          <DialogDescription>
            Save your current resume as a named version to access it later.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="version-name">Version Name *</Label>
            <Input
              id="version-name"
              placeholder="e.g. Frontend Developer"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              autoFocus
            />
          </div>
          <div className="rounded-md border bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">Will save:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Resume content ({activeSections.length} sections)</li>
              <li>Template: {templateConfig?.name || templateId}</li>
              <li>Section order & visibility</li>
            </ul>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs text-destructive">
            <ImageOff className="h-3.5 w-3.5 shrink-0" />
            <span>Profile photo will NOT be saved with this version.</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} disabled={!name.trim()}>
            Save Version
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
