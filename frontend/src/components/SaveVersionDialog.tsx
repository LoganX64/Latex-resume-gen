import { useState, useEffect, useMemo } from 'react'
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
  const updateVersion = useVersionsStore((s) => s.updateVersion)
  const findMatchingVersion = useVersionsStore((s) => s.findMatchingVersion)

  const templateConfig = getTemplateConfig(templateId)
  const activeSections = sectionOrder.filter((s) => {
    if (s.type === 'personalInfo') return true
    return sectionVisibility[s.type]
  })

  const currentData = useMemo(() => ({
    resume,
    templateId,
    sectionOrder,
    sectionVisibility,
  }), [resume, templateId, sectionOrder, sectionVisibility])

  const matchedVersion = useMemo(() => {
    if (!open) return null
    return findMatchingVersion(currentData)
  }, [open, currentData, findMatchingVersion])

  useEffect(() => {
    if (open && matchedVersion) {
      setName(matchedVersion.name)
    } else if (open) {
      setName('')
    }
  }, [open, matchedVersion])

  function handleSaveAsNew() {
    if (!name.trim()) return

    const { profileImage, ...personalInfoWithoutPhoto } = resume.personalInfo
    const success = addVersion({
      name: name.trim(),
      resume: {
        ...resume,
        personalInfo: personalInfoWithoutPhoto,
      },
      templateId,
      sectionOrder,
      sectionVisibility,
    })

    if (!success) {
      toast.error('Storage full', {
        description: 'Could not save version. Try deleting some old versions to free up space.',
      })
      return
    }

    toast.success('Resume saved', {
      description: `"${name.trim()}" saved as a new version.`,
    })
    setName('')
    onOpenChange(false)
  }

  function handleUpdate() {
    if (!matchedVersion) return

    const { profileImage, ...personalInfoWithoutPhoto } = resume.personalInfo
    const success = updateVersion(matchedVersion.id, {
      name: name.trim() || matchedVersion.name,
      resume: {
        ...resume,
        personalInfo: personalInfoWithoutPhoto,
      },
      templateId,
      sectionOrder,
      sectionVisibility,
    })

    if (!success) {
      toast.error('Update failed', {
        description: 'Could not update version. Please try again.',
      })
      return
    }

    toast.success('Version updated', {
      description: `"${name.trim() || matchedVersion.name}" has been updated.`,
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (matchedVersion) handleUpdate()
                  else handleSaveAsNew()
                }
              }}
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
        {matchedVersion ? (
          <div className="space-y-2 pt-2">
            <div className="flex gap-2">
              <Button
                className="flex-1 h-11 sm:h-7"
                onClick={handleUpdate}
                disabled={!name.trim()}
              >
                Update
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-11 sm:h-7"
                onClick={handleSaveAsNew}
                disabled={!name.trim()}
              >
                Save as New
              </Button>
            </div>
            <Button
              variant="ghost"
              className="w-full h-11 sm:h-7"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div className="pt-2">
            <Button
              className="w-full h-11 sm:h-7"
              onClick={handleSaveAsNew}
              disabled={!name.trim()}
            >
              Save Version
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
